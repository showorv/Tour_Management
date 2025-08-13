"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.createLogin);
router.post("/refresh-token", auth_controller_1.authController.getNewAccessToken);
router.post("/logout", auth_controller_1.authController.logout);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.changePassword);
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.setPassword);
// frontend-> forgot pass -> email -> check email status valid -> short validation token -> email -> rest password url -> localhost:5173/reset-password?email=...&token=token -> frontend ei query theke email r token extract -> authorization for token -> new password -> password hash
router.post("/forgot-password", auth_controller_1.authController.forgotPassword);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.resetPassword);
router.get("/google", auth_controller_1.authController.googleController);
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=something issue in your account` }), auth_controller_1.authController.googleCallback);
exports.authRouter = router;
