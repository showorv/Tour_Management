import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateSchma } from "../../middlewares/validationSchema";
import { divisionController } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";


const route = Router()

route.post("/create", checkAuth(Role.SUPERADMIN, Role.ADMIN),
multerUpload.single("file"),
 validateSchma(createDivisionSchema), 
 divisionController.createDivision)

 route.get("/", divisionController.getAllDivision)

 route.get("/:slug", divisionController.getSingleDivision)

 route.patch("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN),
 multerUpload.single("file"),
    validateSchma(updateDivisionSchema),
    divisionController.updateDivision
 )
 route.delete("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN),
    divisionController.deleteDivision
 )


export const divisionRouter = route;