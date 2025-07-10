import { Router } from "express";
import { userController } from "./user.controller";

import { createUserValidation } from "./user.validation";
import { validateSchma } from "../../middlewares/validationSchema";

const router = Router();

router.post(
  "/register",
  validateSchma(createUserValidation),
  userController.createUser
);
router.get("/users", userController.getAllUser);

export const userRouter = router;
