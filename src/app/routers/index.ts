import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.route";
import { divisionRouter } from "../modules/division/division.route";
import { tourRouter } from "../modules/tour/tour.route";
import { bookingRouter } from "../modules/booking/booking.route";
import { paymentRouter } from "../modules/payment/payment.route";


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/division",
        route: divisionRouter
    },
    {
        path: "/tour",
        route: tourRouter
    },
    {
        path: "/booking",
        route: bookingRouter
    },
    {
        path: "/payment",
        route: paymentRouter
    },
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})