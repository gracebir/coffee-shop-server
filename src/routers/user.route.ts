/** @format */

import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/signin", userController.login);

export default router;
