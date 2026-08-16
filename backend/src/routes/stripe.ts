import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../prisma";

const router = Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);


// ==================================================
// CREATE KNIFE CHECKOUT
// ==================================================

router.post(
  "/create-checkout",
  async (req, res) => {

    try {

      const { knifeId } = req.body;

      if (!knifeId) {

        return res.status(400).json({
          error: "Knife ID is required"
        });

      }

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

      if (knife.status !== "available") {

        return res.status(400).json({
          error: "This knife is no longer available"
        });

      }

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

            knifeId: knife.id

          }

        });

      console.log(
        `Stripe knife checkout created: ${session.id}`
      );

      return res.json({
        url: session.url
      });

    } catch (error) {

      console.error(
        "CREATE KNIFE CHECKOUT ERROR:",
        error
      );

      return res.status(500).json({
        error: "Failed creating checkout"
      });

    }

  }
);


// ==================================================
// CREATE SHARPENING SUPPLY CHECKOUT
// ==================================================

router.post(
  "/create-supply-checkout",
  async (req, res) => {

    try {

      const { supplyId } = req.body;

      if (!supplyId) {

        return res.status(400).json({
          error: "Supply ID is required"
        });

      }

      const supply =
        await prisma.sharpeningSupply.findUnique({

          where: {
            id: supplyId
          }

        });

      if (!supply) {

        return res.status(404).json({
          error: "Sharpening supply not found"
        });

      }

      if (
        supply.status !== "available" ||
        supply.stock <= 0
      ) {

        return res.status(400).json({
          error: "This product is currently out of stock"
        });

      }

      if (
        !supply.price ||
        supply.price <= 0
      ) {

        return res.status(400).json({
          error: "This product has an invalid price"
        });

      }

      const session =
        await stripe.checkout.sessions.create({

          mode: "payment",

          line_items: [

            {

              price_data: {

                currency: "sek",

                product_data: {

                  name: supply.title,

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

          success_url:
            `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `http://localhost:5173/shop/${supply.slug}`,

          metadata: {

            type: "sharpening-supply",

            supplyId: supply.id

          }

        });

      console.log(
        `Stripe supply checkout created: ${session.id}`
      );

      return res.json({
        url: session.url
      });

    } catch (error) {

      console.error(
        "CREATE SUPPLY CHECKOUT ERROR:",
        error
      );

      return res.status(500).json({
        error: "Failed creating supply checkout"
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
          error: "Session ID is required"
        });

      }

      const session =
        await stripe.checkout.sessions.retrieve(
          sessionId
        );

      if (
        session.payment_status !== "paid"
      ) {

        return res.status(400).json({
          error: "Payment has not been completed"
        });

      }

      const type =
        session.metadata?.type ||
        "knife";


      // ==================================================
      // SUPPLY
      // ==================================================

      if (
        type === "sharpening-supply"
      ) {

        const supplyId =
          session.metadata?.supplyId;

        if (!supplyId) {

          return res.status(400).json({
            error: "Supply ID missing from payment"
          });

        }

        const supply =
          await prisma.sharpeningSupply.findUnique({

            where: {
              id: supplyId
            }

          });

        const order =
          await prisma.order.findUnique({

            where: {
              stripeSessionId: session.id
            }

          });

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
            session.currency ||
            "sek",

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

      const knife =
        knifeId
          ? await prisma.knife.findUnique({

              where: {
                id: knifeId
              },

              include: {
                maker: true
              }

            })
          : null;

      const order =
        await prisma.order.findUnique({

          where: {
            stripeSessionId: session.id
          }

        });

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
          session.currency ||
          "sek",

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

      return res.status(500).json({
        error: "Failed loading payment"
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
      req.headers["stripe-signature"];

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

    console.log(
      `Stripe event received: ${event.type}`
    );


    // ==================================================
    // CHECKOUT COMPLETED
    // ==================================================

    if (
      event.type ===
      "checkout.session.completed"
    ) {

      const session =
        event.data.object as Stripe.Checkout.Session;

      const type =
        session.metadata?.type ||
        "knife";

      console.log(
        `Payment completed: ${session.id}`
      );


      // ==================================================
      // SHARPENING SUPPLY
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
              id: supplyId
            }

          });

        if (!supply) {

          console.error(
            "Supply not found:",
            supplyId
          );

          return res.json({
            received: true
          });

        }


        // ------------------------------------------
        // DUPLICATE WEBHOOK PROTECTION
        // ------------------------------------------

        const existingOrder =
          await prisma.order.findUnique({

            where: {
              stripeSessionId: session.id
            }

          });

        if (existingOrder) {

          console.log(
            `Order already exists for session ${session.id}`
          );

          return res.json({
            received: true
          });

        }


        // ------------------------------------------
        // CHECK STOCK
        // ------------------------------------------

        if (supply.stock <= 0) {

          console.error(
            `Supply ${supply.title} is out of stock`
          );

          return res.json({
            received: true
          });

        }


        // ------------------------------------------
        // CREATE ORDER + REDUCE STOCK
        // ------------------------------------------

        const order =
          await prisma.$transaction(
            async (tx) => {

              const updatedSupply =
                await tx.sharpeningSupply.updateMany({

                  where: {

                    id: supply.id,

                    stock: {
                      gt: 0
                    }

                  },

                  data: {

                    stock: {
                      decrement: 1
                    }

                  }

                });

              if (
                updatedSupply.count !== 1
              ) {

                throw new Error(
                  "Supply went out of stock"
                );

              }

              const currentSupply =
                await tx.sharpeningSupply.findUnique({

                  where: {
                    id: supply.id
                  }

                });

              if (
                currentSupply &&
                currentSupply.stock === 0
              ) {

                await tx.sharpeningSupply.update({

                  where: {
                    id: supply.id
                  },

                  data: {
                    status: "sold-out"
                  }

                });

              }

              return tx.order.create({

                data: {

                  sharpeningSupplyId:
                    supply.id,

                  stripeSessionId:
                    session.id,

                  customerEmail:
                    session.customer_details?.email ||
                    null,

                  customerName:
                    session.customer_details?.name ||
                    null,

                  amount:
                    session.amount_total ||
                    supply.price * 100,

                  currency:
                    session.currency ||
                    "sek",

                  status:
                    "paid"

                }

              });

            }
          );

        console.log(
          `SUPPLY ORDER CREATED: ${order.id}`
        );

        return res.json({
          received: true
        });

      }


      // ==================================================
      // KNIFE
      // ==================================================

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


      // ------------------------------------------
      // DUPLICATE WEBHOOK PROTECTION
      // ------------------------------------------

      const existingSessionOrder =
        await prisma.order.findUnique({

          where: {
            stripeSessionId:
              session.id
          }

        });

      if (existingSessionOrder) {

        console.log(
          `Order already exists for ${session.id}`
        );

        return res.json({
          received: true
        });

      }


      const existingKnifeOrder =
        await prisma.order.findUnique({

          where: {
            knifeId:
              knife.id
          }

        });

      if (existingKnifeOrder) {

        console.log(
          `Knife already has order ${existingKnifeOrder.id}`
        );

        if (
          knife.status !== "sold"
        ) {

          await prisma.knife.update({

            where: {
              id: knife.id
            },

            data: {
              status: "sold"
            }

          });

        }

        return res.json({
          received: true
        });

      }


      // ------------------------------------------
      // CREATE KNIFE ORDER
      // ------------------------------------------

      const order =
        await prisma.order.create({

          data: {

            knifeId:
              knife.id,

            stripeSessionId:
              session.id,

            customerEmail:
              session.customer_details?.email ||
              null,

            customerName:
              session.customer_details?.name ||
              null,

            amount:
              session.amount_total ||
              knife.price * 100,

            currency:
              session.currency ||
              "sek",

            status:
              "paid"

          }

        });

      await prisma.knife.update({

        where: {
          id: knife.id
        },

        data: {
          status: "sold"
        }

      });

      console.log(
        `KNIFE ORDER CREATED: ${order.id}`
      );

      console.log(
        `Knife ${knife.title} marked SOLD`
      );

    }

    return res.json({
      received: true
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
                maker: true
              }

            },

            sharpeningSupply: true

          },

          orderBy: {
            createdAt: "desc"
          }

        });

      return res.json(orders);

    } catch (error) {

      console.error(
        "GET ORDERS ERROR:",
        error
      );

      return res.status(500).json({
        error: "Failed fetching orders"
      });

    }

  }
);


export default router;