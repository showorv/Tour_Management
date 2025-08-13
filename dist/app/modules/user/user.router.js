"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validationSchema_1 = require("../../middlewares/validationSchema");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
router.post("/register", multer_config_1.multerUpload.single("file"), (0, validationSchema_1.validateSchma)(user_validation_1.createUserValidation), user_controller_1.userController.createUser);
router.get("/users", (0, checkAuth_1.checkAuth)("ADMIN", "SUPERADMIN"), user_controller_1.userController.getAllUser);
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userController.getMe);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), user_controller_1.userController.getSingleUser);
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), multer_config_1.multerUpload.single("file"), (0, validationSchema_1.validateSchma)(user_validation_1.updateUserValidation), user_controller_1.userController.updateUser); //...Object.values(Role) means all role can update their profile
exports.userRouter = router;
