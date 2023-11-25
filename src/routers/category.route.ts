/** @format */

import { Router } from "express";
import categoryController from "../controllers/category.controller";

const router = Router();

router.get("/all", categoryController.getAllCategories);
router.post("/create", categoryController.createCategories);
router.put("/update/:productId", categoryController.updateCategory);
router.put("/delete/:productId", categoryController.deleteCategory);

export default router;
