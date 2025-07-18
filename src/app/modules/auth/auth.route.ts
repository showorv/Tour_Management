import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/login", authController.createLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logout)
router.post("/reset-password",checkAuth(...Object.values(Role)), authController.resetPassword)


export const authRouter = router