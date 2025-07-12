import {  Router} from "express";
import { userController } from "./user.controller";

import { createUserValidation } from "./user.validation";
import { validateSchma } from "../../middlewares/validationSchema";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateSchma(createUserValidation),
  userController.createUser
);
router.get("/users",checkAuth("ADMIN","SUPERADMIN"), userController.getAllUser);

router.patch("/:id", checkAuth(...Object.values(Role)), userController.updateUser) //...Object.values(Role) means all role can update their profile

export const userRouter = router;
