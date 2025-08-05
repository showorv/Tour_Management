import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router()

router.post("/login", authController.createLogin)
router.post("/refresh-token", authController.getNewAccessToken)
router.post("/logout", authController.logout)
router.post("/change-password",checkAuth(...Object.values(Role)), authController.changePassword)

router.post("/set-password",checkAuth(...Object.values(Role)), authController.setPassword)
// frontend-> forgot pass -> email -> check email status valid -> short validation token -> email -> rest password url -> localhost:5173/reset-password?email=...&token=token -> frontend ei query theke email r token extract -> authorization for token -> new password -> password hash
router.post("/forgot-password", authController.forgotPassword)

router.post("/reset-password",checkAuth(...Object.values(Role)), authController.resetPassword)

router.get("/google", authController.googleController)
router.get("/google/callback",passport.authenticate("google", {failureRedirect: `${envVars.FRONTEND_URL}/login?error=something issue in your account`}), authController.googleCallback)


export const authRouter = router