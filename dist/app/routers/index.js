"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const auth_route_1 = require("../modules/auth/auth.route");
const division_route_1 = require("../modules/division/division.route");
const tour_route_1 = require("../modules/tour/tour.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payment/payment.route");
const otp_router_1 = require("../modules/otp/otp.router");
const stats_router_1 = require("../modules/stats/stats.router");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_router_1.userRouter
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter
    },
    {
        path: "/division",
        route: division_route_1.divisionRouter
    },
    {
        path: "/tour",
        route: tour_route_1.tourRouter
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRouter
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRouter
    },
    {
        path: "/otp",
        route: otp_router_1.otpRouter
    },
    {
        path: "/stats",
        route: stats_router_1.statsRouter
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
