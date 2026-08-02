import express from "express";
import cors from "cors";
import path from "path";

import knivesRouter from "./routes/knives";
import collaborationRoutes from "./routes/collaborations";
import makerRoutes from "./routes/makers";


const app = express();


app.use(cors());

app.use(express.json());



// ==========================
// STATIC FILES
// ==========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname,"../uploads")
  )
);




// ==========================
// API ROUTES
// ==========================

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





app.listen(8080,()=>{

console.log(
"Ågane API running on port 8080"
);

});