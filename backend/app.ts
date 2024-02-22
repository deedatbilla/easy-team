require("dotenv").config();
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { productsController } from "./controllers/product.contoller";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.set("trust proxy", true);
app.get("/products", productsController.getProducts);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
