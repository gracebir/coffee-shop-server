/** @format */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routers/product.route";
import categoryRouter from "./routers/category.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// endpoints
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server run on port ${port}...`));
