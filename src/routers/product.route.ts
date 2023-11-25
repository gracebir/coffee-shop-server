/** @format */
import productController from "../controllers/product.controller";

import { Router } from "express";
import { upload } from "../utils/helper";

const router = Router();

router.get("/all", productController.getAllProduct);
router.get("/category/:category", productController.getAllProduct);
router.get("/:id", productController.getAllProduct);
router.post(
    "/create",
    upload.single("imageUrl"),
    productController.getAllProduct
);

export default router;
