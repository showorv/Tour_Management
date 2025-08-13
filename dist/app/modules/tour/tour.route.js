"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validationSchema_1 = require("../../middlewares/validationSchema");
const tour_validation_1 = require("./tour.validation");
const tour_controller_1 = require("./tour.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// ************* Tour type route *********
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), (0, validationSchema_1.validateSchma)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.tourController.createTourType);
router.get("/tour-type", tour_controller_1.tourController.getTourType);
router.patch("/tour-type/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), tour_controller_1.tourController.updateTourType);
router.delete("/tour-type/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), tour_controller_1.tourController.deleteTourType);
// ******** Tour route **********
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), multer_config_1.multerUpload.array("files"), (0, validationSchema_1.validateSchma)(tour_validation_1.createTourZodSchema), tour_controller_1.tourController.createTour);
router.get("/", tour_controller_1.tourController.getTour);
router.get("/:slug", tour_controller_1.tourController.getSingleTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), multer_config_1.multerUpload.array("files"), (0, validationSchema_1.validateSchma)(tour_validation_1.updateTourZodSchema), tour_controller_1.tourController.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPERADMIN), tour_controller_1.tourController.deleteTour);
exports.tourRouter = router;
