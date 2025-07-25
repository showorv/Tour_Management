import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { bookingController } from "./booking.controller";
import { validateSchma } from "../../middlewares/validationSchema";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";


const router = Router()

router.post("/create", checkAuth(...Object.values(Role)),validateSchma(createBookingZodSchema), bookingController.createBooking);

router.get("/", checkAuth(Role.ADMIN, Role.SUPERADMIN), bookingController.getAllBooking);

router.get("/my-bookings", checkAuth(...Object.values(Role)), bookingController.getUserBooking);

router.get("/:bookingId", checkAuth(...Object.values(Role)), bookingController.getSingleBooking);

router.patch("/:bookingId/status", checkAuth(...Object.values(Role)),validateSchma(updateBookingStatusZodSchema), bookingController.updateStatusBooking);


export const bookingRouter = router;