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


      // ------------------------------------------
      // VALIDATE KNIFE ID
      // ------------------------------------------

      if (!knifeId) {

        return res.status(400).json({
          error: "Knife ID is required"
        });

      }


      // ------------------------------------------
      // FIND KNIFE
      // ------------------------------------------

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


      // ------------------------------------------
      // CHECK STATUS
      // ------------------------------------------

      if (
        knife.status !== "available"
      ) {

        return res.status(400).json({
          error: "This knife is no longer available"
        });

      }


      // ------------------------------------------
      // CHECK EXISTING ORDER
      // ------------------------------------------

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


      // ------------------------------------------
      // CREATE STRIPE CHECKOUT
      // ------------------------------------------

      const session =
        await stripe.checkout.sessions.create({

          mode: "payment",

          line_items: [

            {

              price_data: {

                currency: "sek",

                product_data: {

                  name:
                    knife.title

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

            type:
              "knife",

            knifeId:
              knife.id

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

      const {
        supplyId,
        quantity
      } = req.body;


      // ------------------------------------------
      // VALIDATE SUPPLY ID
      // ------------------------------------------

      if (!supplyId) {

        return res.status(400).json({
          error: "Supply ID is required"
        });

      }


      // ------------------------------------------
      // VALIDATE QUANTITY
      // ------------------------------------------

      const requestedQuantity =
        Number(quantity);


      if (
        !Number.isInteger(
          requestedQuantity
        ) ||
        requestedQuantity < 1
      ) {

        return res.status(400).json({
          error: "A valid quantity is required"
        });

      }


      // ------------------------------------------
      // FIND SUPPLY
      // ------------------------------------------

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


      // ------------------------------------------
      // CHECK STOCK
      // ------------------------------------------

      if (
        supply.stock <= 0
      ) {

        return res.status(400).json({
          error: "This product is currently out of stock"
        });

      }


      // ------------------------------------------
      // CHECK REQUESTED QUANTITY
      // ------------------------------------------

      if (
        requestedQuantity >
        supply.stock
      ) {

        return res.status(400).json({

          error:
            `Only ${supply.stock} unit${
              supply.stock === 1
                ? ""
                : "s"
            } available`

        });

      }


      // ------------------------------------------
      // CHECK STATUS
      // ------------------------------------------

      if (
        supply.status !== "available"
      ) {

        return res.status(400).json({
          error: "This product is currently not available"
        });

      }


      // ------------------------------------------
      // CHECK PRICE
      // ------------------------------------------

      if (
        !supply.price ||
        supply.price <= 0
      ) {

        return res.status(400).json({
          error: "This product has an invalid price"
        });

      }


      // ------------------------------------------
      // CREATE STRIPE CHECKOUT
      // ------------------------------------------

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

              quantity:
                requestedQuantity

            }

          ],

          success_url:
            `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `http://localhost:5173/shop/${supply.slug}`,

          metadata: {

            type:
              "sharpening-supply",

            supplyId:
              supply.id,

            quantity:
              String(
                requestedQuantity
              )

          }

        });


      console.log(
        `Stripe supply checkout created: ${session.id}`
      );


      console.log(
        `Supply: ${supply.title}`
      );


      console.log(
        `Quantity: ${requestedQuantity}`
      );


      console.log(
        `Total: ${
          supply.price *
          requestedQuantity
        } SEK`
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
        Array.isArray(
          req.params.sessionId
        )
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
      // SHARPENING SUPPLY
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
              stripeSessionId:
                session.id
            }

          });


        const quantity =
          Number(
            session.metadata?.quantity ||
            1
          );


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

          quantity,

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
                    supply.images,

                  stock:
                    supply.stock,

                  status:
                    supply.status

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
            stripeSessionId:
              session.id
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


    // ------------------------------------------
    // VERIFY STRIPE EVENT
    // ------------------------------------------

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


        // ------------------------------------------
        // GET QUANTITY FROM STRIPE METADATA
        // ------------------------------------------

        const quantity =
          Number(
            session.metadata?.quantity ||
            1
          );


        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {

          console.error(
            `Invalid quantity in Stripe session ${session.id}`
          );

          return res.json({
            received: true
          });

        }


        console.log(
          `Supply purchase quantity: ${quantity}`
        );


        // ------------------------------------------
        // DUPLICATE SESSION CHECK
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
            `Order already exists for session ${session.id}`
          );

          return res.json({
            received: true
          });

        }


        // ------------------------------------------
        // PROCESS SUPPLY PURCHASE
        // ------------------------------------------

        try {

          const result =
            await prisma.$transaction(
              async (tx) => {

                // --------------------------------------
                // GET SUPPLY
                // --------------------------------------

                const supply =
                  await tx.sharpeningSupply.findUnique({

                    where: {
                      id: supplyId
                    }

                  });


                if (!supply) {

                  throw new Error(
                    "Sharpening supply not found"
                  );

                }


                // --------------------------------------
                // CHECK STOCK
                // --------------------------------------

                if (
                  supply.stock < quantity
                ) {

                  throw new Error(

                    `Not enough stock. Available: ${
                      supply.stock
                    }, requested: ${
                      quantity
                    }`

                  );

                }


                // --------------------------------------
                // DECREASE STOCK
                // --------------------------------------

                const newStock =
                  supply.stock -
                  quantity;


                const newStatus =
                  newStock <= 0
                    ? "sold-out"
                    : "available";


                // --------------------------------------
                // UPDATE STOCK
                // --------------------------------------

                await tx.sharpeningSupply.update({

                  where: {

                    id:
                      supply.id

                  },

                  data: {

                    stock:
                      newStock,

                    status:
                      newStatus

                  }

                });


                // --------------------------------------
                // CREATE ORDER
                // --------------------------------------

                const order =
                  await tx.order.create({

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
                        supply.price *
                        quantity *
                        100,

                      currency:
                        session.currency ||
                        "sek",

                      status:
                        "paid"

                    }

                  });


                return {

                  order,

                  newStock,

                  quantity

                };

              }
            );


          console.log(
            `SUPPLY ORDER CREATED: ${result.order.id}`
          );


          console.log(
            `Supply ${supplyId} quantity purchased: ${result.quantity}`
          );


          console.log(
            `Supply ${supplyId} stock decreased to ${result.newStock}`
          );


          if (
            result.newStock === 0
          ) {

            console.log(
              `Supply ${supplyId} is now SOLD OUT`
            );

          }


        } catch (error) {

          console.error(
            "SUPPLY PAYMENT PROCESSING ERROR:",
            error
          );

          /*
           * We return 200 so Stripe does not
           * endlessly retry the webhook.
           */

          return res.json({
            received: true
          });

        }


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


      // ------------------------------------------
      // FIND KNIFE
      // ------------------------------------------

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
      // DUPLICATE SESSION
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


      // ------------------------------------------
      // DUPLICATE KNIFE
      // ------------------------------------------

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


      // ------------------------------------------
      // MARK KNIFE SOLD
      // ------------------------------------------

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


    // ==================================================
    // OTHER STRIPE EVENTS
    // ==================================================

    /*
     * charge.succeeded
     * payment_intent.created
     * payment_intent.succeeded
     * charge.updated
     *
     * Nothing needs to be done here.
     */


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


      return res.json(
        orders
      );

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