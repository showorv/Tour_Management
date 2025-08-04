import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateSchma } from "../../middlewares/validationSchema";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { tourController } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router()

// ************* Tour type route *********



router.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPERADMIN), validateSchma(createTourTypeZodSchema), tourController.createTourType)
router.get("/tour-type",  tourController.getTourType)
router.patch("/tour-type/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), tourController.updateTourType)
router.delete("/tour-type/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), tourController.deleteTourType)







// ******** Tour route **********


router.post("/create", checkAuth(Role.ADMIN, Role.SUPERADMIN), 
multerUpload.array("files"),
validateSchma(createTourZodSchema),
 tourController.createTour)
router.get("/",  tourController.getTour)
router.get("/:slug",  tourController.getSingleTour)
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), validateSchma(updateTourZodSchema), tourController.updateTour)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPERADMIN), tourController.deleteTour)




export const tourRouter = router