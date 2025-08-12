import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsController } from "./stats.controller";

const router = Router ()

router.get ("/user-stats",  checkAuth(Role.ADMIN, Role.SUPERADMIN), statsController.userStats)
router.get ("/tour-stats",  checkAuth(Role.ADMIN, Role.SUPERADMIN), statsController.tourStats)
router.get ("/booking-stats",  checkAuth(Role.ADMIN, Role.SUPERADMIN), statsController.bookingStats)
router.get ("/payment-stats",  checkAuth(Role.ADMIN, Role.SUPERADMIN), statsController.paymentStats)


export const statsRouter = router