
import express from "express";
import cors from "cors";
import path from "path";

import knivesRouter from "./routes/knives";
import collaborationRoutes from "./routes/collaborations";
import makerRoutes from "./routes/makers";
import stripeRoutes from "./routes/stripe";
import sharpeningSuppliesRouter from "./routes/sharpeningSupplies";


const app = express();


// ==================================================
// CORS
// ==================================================

app.use(cors());


// ==================================================
// STRIPE WEBHOOK
// IMPORTANT:
// Stripe requires the raw request body for
// webhook signature verification.
//
// This MUST come BEFORE express.json()
// ==================================================

app.use(
  "/api/stripe/webhook",
  express.raw({
    type: "application/json"
  })
);


// ==================================================
// JSON
// ==================================================

app.use(express.json());


// ==================================================
// STATIC FILES
// ==================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);
app.use(
  "/api/sharpening-supplies",
  sharpeningSuppliesRouter
);



// ==================================================
// STRIPE ROUTES
// ==================================================

app.use(
  "/api/stripe",
  stripeRoutes
);


// ==================================================
// KNIFE ROUTES
// ==================================================

app.use(
  "/api/knives",
  knivesRouter
);


// ==================================================
// COLLABORATION ROUTES
// ==================================================

app.use(
  "/api/collaborations",
  collaborationRoutes
);


// ==================================================
// MAKER ROUTES
// ==================================================

app.use(
  "/api/makers",
  makerRoutes
);


// ==================================================
// SERVER
// ==================================================

const PORT = 8080;

app.listen(
  PORT,
  () => {

    console.log(
      `Ågane API running on port ${PORT}`
    );

  }
);

