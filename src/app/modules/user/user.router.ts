import {  Router} from "express";
import { userController } from "./user.controller";

import { createUserValidation, updateUserValidation } from "./user.validation";
import { validateSchma } from "../../middlewares/validationSchema";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateSchma(createUserValidation),
  userController.createUser
);
router.get("/users",checkAuth("ADMIN","SUPERADMIN"), userController.getAllUser);
router.get("/me",checkAuth(...Object.values(Role)), userController.getMe);

router.patch("/:id", 
checkAuth(...Object.values(Role)),
multerUpload.single("file"),
validateSchma(updateUserValidation),
 userController.updateUser) //...Object.values(Role) means all role can update their profile

export const userRouter = router;
