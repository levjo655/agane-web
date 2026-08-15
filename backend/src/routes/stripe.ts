import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../prisma";

const router = Router();


const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);


// ==================================================
// CREATE CHECKOUT SESSION
// ==================================================

router.post(
  "/create-checkout",
  async (req, res) => {

    try {

      const {
        knifeId
      } = req.body;


      if (!knifeId) {

        return res.status(400).json({
          error: "Knife ID is required"
        });

      }


      // ==========================
      // FIND KNIFE
      // ==========================

      const knife =
        await prisma.knife.findUnique({

          where: {
            id: knifeId
          }

        });


      if (!knife) {

        return res.status(404).json({
          error: "Knife not found"
        });

      }


      // ==========================
      // CHECK AVAILABILITY
      // ==========================

      if (
        knife.status !== "available"
      ) {

        return res.status(400).json({
          error: "This knife is no longer available"
        });

      }


      // ==========================
      // CREATE STRIPE SESSION
      // ==========================

      const session =
        await stripe.checkout.sessions.create({

          mode: "payment",

          line_items: [

            {

              price_data: {

                currency: "sek",

                product_data: {

                  name: knife.title

                },

                unit_amount:
                  knife.price * 100

              },

              quantity: 1

            }

          ],

          success_url:
            `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `http://localhost:5173/shop/${knife.slug}`,

          metadata: {

            knifeId:
              knife.id

          }

        });


      res.json({

        url:
          session.url

      });


    } catch (error) {

      console.error(
        "CREATE CHECKOUT ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed creating checkout"

      });

    }

  }
);


// ==================================================
// STRIPE WEBHOOK
// ==================================================

router.post(
  "/webhook",
  async (req, res) => {

    const signature =
      req.headers[
        "stripe-signature"
      ];


    if (!signature) {

      return res.status(400).send(
        "Missing Stripe signature"
      );

    }


    let event: Stripe.Event;


    try {

      event =
        stripe.webhooks.constructEvent(

          req.body,

          signature,

          process.env.STRIPE_WEBHOOK_SECRET as string

        );

    } catch (error) {

      console.error(
        "STRIPE WEBHOOK ERROR:",
        error
      );

      return res.status(400).send(
        "Invalid webhook signature"
      );

    }


    // ==========================
    // PAYMENT COMPLETED
    // ==========================

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object as Stripe.Checkout.Session;


      const knifeId =
        session.metadata?.knifeId;


      if (!knifeId) {

        console.error(
          "Webhook missing knifeId"
        );

        return res.json({
          received: true
        });

      }


      // ==========================
      // FIND KNIFE
      // ==========================

      const knife =
        await prisma.knife.findUnique({

          where: {
            id: knifeId
          }

        });


      if (!knife) {

        console.error(
          "Knife not found:",
          knifeId
        );

        return res.json({
          received: true
        });

      }


      // ==========================
      // MARK SOLD
      // ==========================

      await prisma.knife.update({

        where: {
          id: knifeId
        },

        data: {

          status: "sold"

        }

      });


      console.log(
        `Knife ${knife.title} marked as SOLD`
      );

    }


    res.json({
      received: true
    });

  }
);


export default router;