/** @format */

import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/signin", userController.login);
router.delete("/signout", userController.logout);
router.delete("/delete/:id", userController.deleteUser);

export default router;
