import{ Router } from "express"
import { userController } from "./user.controller"

const router = Router()

router.post("/register", userController.createUser)
router.get("/users", userController.getAllUser)

export const userRouter = router