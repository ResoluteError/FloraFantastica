import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter"

const app : express.Application = express();

app.use("/api/plants",plantsRouter);

app.use(express.static("FaunaFantasticaFrontend/dist/FaunaFantasticaFrontend"));

app.listen(8080, () => {
  console.log("Listening");
});