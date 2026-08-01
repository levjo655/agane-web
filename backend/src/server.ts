import express from "express";
import cors from "cors";

import knivesRouter from "./routes/knives";
import collaborationRoutes from "./routes/collaborations";
import path from "path";


const app = express();


app.use(cors());
app.use(express.json());


// serve images
app.use(
  "/uploads",
  express.static("uploads")
);
app.use(
 "/api/collaborations",
 collaborationRoutes
);
app.use(
  "/uploads",
  express.static(
    path.join(__dirname,"../uploads")
  )
);


app.use(
  "/api/knives",
  knivesRouter
);
app.use(
  "/uploads",
  express.static("uploads")
);


app.listen(8080, () => {
  console.log(
    "Ågane API running on port 8080"
  );
});