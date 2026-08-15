import express from "express";
import cors from "cors";
import path from "path";

import knivesRouter from "./routes/knives";
import collaborationRoutes from "./routes/collaborations";
import makerRoutes from "./routes/makers";
import stripeRoutes from "./routes/stripe";


const app = express();


// ==========================
// CORS
// ==========================

app.use(cors());


// ==========================
// STRIPE WEBHOOK
// IMPORTANT:
// MUST COME BEFORE express.json()
// ==========================

app.use(
  "/api/stripe/webhook",
  express.raw({
    type: "application/json"
  })
);


// ==========================
// JSON
// ==========================

app.use(express.json());


// ==========================
// STATIC FILES
// ==========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);


// ==========================
// API ROUTES
// ==========================

app.use(
  "/api/stripe",
  stripeRoutes
);


app.use(
  "/api/knives",
  knivesRouter
);


app.use(
  "/api/collaborations",
  collaborationRoutes
);


app.use(
  "/api/makers",
  makerRoutes
);


// ==========================
// SERVER
// ==========================

app.listen(
  8080,
  () => {

    console.log(
      "Ågane API running on port 8080"
    );

  }
);