import express from "express";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
import CategoryRouter from "./router/category.js";
import ProductRouter from "./router/product.js";
const PORT = process.env.PORT ?? 6000;
const app = express();

app.use(cors())
app.use(express.json())

app.use("/category", CategoryRouter);
app.use("/product", ProductRouter);

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
