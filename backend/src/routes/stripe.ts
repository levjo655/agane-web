import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../prisma";

const router = Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);


// ==================================================
// CREATE KNIFE CHECKOUT SESSION
// ==================================================

router.post(
  "/create-checkout",
  async (req, res) => {

    try {

      const {
        knifeId
      } = req.body;


      // ==========================
      // VALIDATE KNIFE ID
      // ==========================

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
      // CHECK EXISTING ORDER
      // ==========================

      const existingOrder =
        await prisma.order.findUnique({

          where: {
            knifeId: knife.id
          }

        });


      if (existingOrder) {

        return res.status(400).json({
          error: "This knife has already been purchased"
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

            type: "knife",

            knifeId:
              knife.id

          }

        });


      console.log(
        `Stripe knife checkout created: ${session.id}`
      );


      res.json({

        url:
          session.url

      });


    } catch (error) {

      console.error(
        "CREATE KNIFE CHECKOUT ERROR:",
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
// CREATE SHARPENING SUPPLY CHECKOUT SESSION
// ==================================================

router.post(
  "/create-supply-checkout",
  async (req, res) => {

    try {

      const {
        supplyId
      } = req.body;


      // ==========================
      // VALIDATE SUPPLY ID
      // ==========================

      if (!supplyId) {

        return res.status(400).json({

          error:
            "Supply ID is required"

        });

      }


      // ==========================
      // FIND SUPPLY
      // ==========================

      const supply =
        await prisma.sharpeningSupply.findUnique({

          where: {

            id:
              supplyId

          }

        });


      if (!supply) {

        return res.status(404).json({

          error:
            "Sharpening supply not found"

        });

      }


      // ==========================
      // CHECK AVAILABILITY
      // ==========================

      if (
        supply.status !== "available"
      ) {

        return res.status(400).json({

          error:
            "This product is no longer available"

        });

      }


      // ==========================
      // VALIDATE PRICE
      // ==========================

      if (
        !supply.price ||
        supply.price <= 0
      ) {

        return res.status(400).json({

          error:
            "This product has an invalid price"

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

                  name:
                    supply.title,

                  description:
                    supply.description ||
                    undefined

                },

                unit_amount:
                  supply.price * 100

              },

              quantity: 1

            }

          ],


          // ==========================
          // SUCCESS
          // ==========================

          success_url:
            `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,


          // ==========================
          // CANCEL
          // ==========================

          cancel_url:
            `http://localhost:5173/shop/${supply.slug}`,


          // ==========================
          // METADATA
          // ==========================

          metadata: {

            type:
              "sharpening-supply",

            supplyId:
              supply.id

          }

        });


      console.log(
        `Stripe supply checkout created: ${session.id}`
      );


      console.log(
        `Supply: ${supply.title}`
      );


      console.log(
        `Price: ${supply.price} SEK`
      );


      res.json({

        url:
          session.url

      });


    } catch (error) {

      console.error(
        "CREATE SUPPLY CHECKOUT ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed creating supply checkout"

      });

    }

  }
);


// ==================================================
// GET CHECKOUT SESSION
// ==================================================

router.get(
  "/session/:sessionId",
  async (req, res) => {

    try {

      const sessionId =
        Array.isArray(req.params.sessionId)
          ? req.params.sessionId[0]
          : req.params.sessionId;


      if (!sessionId) {

        return res.status(400).json({

          error:
            "Session ID is required"

        });

      }


      // ==========================
      // GET STRIPE SESSION
      // ==========================

      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId
        );


      // ==========================
      // ONLY SHOW COMPLETED
      // ==========================

      if (
        session.payment_status !== "paid"
      ) {

        return res.status(400).json({

          error:
            "Payment has not been completed"

        });

      }


      // ==========================
      // DETERMINE PRODUCT TYPE
      // ==========================

      const type =
        session.metadata?.type ||
        "knife";


      // ==================================================
      // SHARPENING SUPPLY
      // ==================================================

      if (
        type === "sharpening-supply"
      ) {

        const supplyId =
          session.metadata?.supplyId;


        let supply = null;


        if (supplyId) {

          supply =
            await prisma.sharpeningSupply.findUnique({

              where: {

                id:
                  supplyId

              }

            });

        }


        return res.json({

          sessionId:
            session.id,

          paymentStatus:
            session.payment_status,

          amount:
            session.amount_total
              ? session.amount_total / 100
              : 0,

          currency:
            session.currency || "sek",

          customerEmail:
            session.customer_details?.email ||
            null,

          customerName:
            session.customer_details?.name ||
            null,

          orderId:
            null,

          type:
            "sharpening-supply",

          supply:
            supply
              ? {

                  id:
                    supply.id,

                  title:
                    supply.title,

                  slug:
                    supply.slug,

                  images:
                    supply.images

                }

              : null

        });

      }


      // ==================================================
      // KNIFE
      // ==================================================

      const knifeId =
        session.metadata?.knifeId;


      let knife = null;


      if (knifeId) {

        knife =
          await prisma.knife.findUnique({

            where: {

              id:
                knifeId

            },

            include: {

              maker: true

            }

          });

      }


      // ==========================
      // GET ORDER
      // ==========================

      const order =
        await prisma.order.findUnique({

          where: {

            stripeSessionId:
              session.id

          }

        });


      // ==========================
      // RETURN KNIFE DATA
      // ==========================

      return res.json({

        sessionId:
          session.id,

        paymentStatus:
          session.payment_status,

        amount:
          session.amount_total
            ? session.amount_total / 100
            : 0,

        currency:
          session.currency || "sek",

        customerEmail:
          session.customer_details?.email ||
          order?.customerEmail ||
          null,

        customerName:
          session.customer_details?.name ||
          order?.customerName ||
          null,

        orderId:
          order?.id ||
          null,

        type:
          "knife",

        knife:

          knife
            ? {

                id:
                  knife.id,

                title:
                  knife.title,

                slug:
                  knife.slug,

                images:
                  knife.images,

                maker:
                  knife.maker

              }

            : null

      });


    } catch (error) {

      console.error(
        "GET STRIPE SESSION ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed loading payment"

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


    // ==========================
    // CHECK SIGNATURE
    // ==========================

    if (!signature) {

      return res.status(400).send(
        "Missing Stripe signature"
      );

    }


    let event: Stripe.Event;


    // ==========================
    // VERIFY EVENT
    // ==========================

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


    console.log(
      `Stripe event received: ${event.type}`
    );


    // ==================================================
    // PAYMENT COMPLETED
    // ==================================================

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object as Stripe.Checkout.Session;


      console.log(
        "STRIPE PAYMENT COMPLETED:",
        session.id
      );


      // ==================================================
      // DETERMINE PRODUCT TYPE
      // ==================================================

      const type =
        session.metadata?.type ||
        "knife";


      // ==================================================
      // SHARPENING SUPPLY PAYMENT
      // ==================================================

      if (
        type === "sharpening-supply"
      ) {

        const supplyId =
          session.metadata?.supplyId;


        if (!supplyId) {

          console.error(
            "Webhook missing supplyId"
          );

          return res.json({
            received: true
          });

        }


        const supply =
          await prisma.sharpeningSupply.findUnique({

            where: {

              id:
                supplyId

            }

          });


        if (!supply) {

          console.error(
            "Sharpening supply not found:",
            supplyId
          );

          return res.json({
            received: true
          });

        }


        // ==========================
        // MARK SUPPLY SOLD OUT
        // ==========================

        await prisma.sharpeningSupply.update({

          where: {

            id:
              supply.id

          },

          data: {

            status:
              "sold-out"

          }

        });


        console.log(
          `Sharpening supply ${supply.title} marked as SOLD OUT`
        );


        return res.json({

          received:
            true

        });

      }


      // ==================================================
      // KNIFE PAYMENT
      // ==================================================

      const knifeId =
        session.metadata?.knifeId;


      if (!knifeId) {

        console.error(
          "Webhook missing knifeId"
        );

        return res.json({

          received:
            true

        });

      }


      // ==========================
      // FIND KNIFE
      // ==========================

      const knife =
        await prisma.knife.findUnique({

          where: {

            id:
              knifeId

          }

        });


      if (!knife) {

        console.error(
          "Knife not found:",
          knifeId
        );

        return res.json({

          received:
            true

        });

      }


      // ==========================
      // CHECK EXISTING SESSION
      // ==========================

      const existingSessionOrder =
        await prisma.order.findUnique({

          where: {

            stripeSessionId:
              session.id

          }

        });


      if (existingSessionOrder) {

        console.log(
          `Order already exists for Stripe session ${session.id}`
        );

        return res.json({

          received:
            true

        });

      }


      // ==========================
      // CHECK KNIFE ORDER
      // ==========================

      const existingKnifeOrder =
        await prisma.order.findUnique({

          where: {

            knifeId:
              knife.id

          }

        });


      if (existingKnifeOrder) {

        console.log(
          `Knife ${knife.title} already has an order: ${existingKnifeOrder.id}`
        );


        if (
          knife.status !== "sold"
        ) {

          await prisma.knife.update({

            where: {

              id:
                knife.id

            },

            data: {

              status:
                "sold"

            }

          });

        }


        return res.json({

          received:
            true

        });

      }


      // ==========================
      // CUSTOMER
      // ==========================

      const customerEmail =
        session.customer_details?.email ||
        null;


      const customerName =
        session.customer_details?.name ||
        null;


      // ==========================
      // AMOUNT
      // ==========================

      const amount =
        session.amount_total ||
        knife.price * 100;


      // ==========================
      // CURRENCY
      // ==========================

      const currency =
        session.currency ||
        "sek";


      // ==========================
      // CREATE ORDER
      // ==========================

      const order =
        await prisma.order.create({

          data: {

            knifeId:
              knife.id,

            stripeSessionId:
              session.id,

            customerEmail:
              customerEmail,

            customerName:
              customerName,

            amount:
              amount,

            currency:
              currency,

            status:
              "paid"

          }

        });


      console.log(
        `ORDER CREATED: ${order.id}`
      );


      // ==========================
      // MARK KNIFE SOLD
      // ==========================

      await prisma.knife.update({

        where: {

          id:
            knife.id

        },

        data: {

          status:
            "sold"

        }

      });


      console.log(
        `Knife ${knife.title} marked as SOLD`
      );

    }


    // ==================================================
    // RETURN SUCCESS
    // ==================================================

    return res.json({

      received:
        true

    });

  }
);


// ==================================================
// GET ALL ORDERS
// ==================================================

router.get(
  "/orders",
  async (_req, res) => {

    try {

      const orders =
        await prisma.order.findMany({

          include: {

            knife: {

              include: {

                maker:
                  true

              }

            }

          },

          orderBy: {

            createdAt:
              "desc"

          }

        });


      res.json(
        orders
      );

    } catch (error) {

      console.error(
        "GET ORDERS ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed fetching orders"

      });

    }

  }
);


export default router;