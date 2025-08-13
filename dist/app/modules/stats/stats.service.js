"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsService = void 0;
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const userStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUserPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IActive.ACTIVE }); // sobgulate await use na kore eksathe promise.all diye dicchi
    const totalInactiveUserPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IActive.INACTIVE });
    const totalBlockedUserPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IActive.BLOCKED });
    const newUserInLastSevenDaysAgo = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUserInLastThirtyDaysAgo = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const roleBasedUser = user_model_1.User.aggregate([
        // stage 1: group by Role and count
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUser, totalActive, totalInactive, totalBlocked, newUserSeven, newUserThirty, roleUser] = yield Promise.all([
        totalUsersPromise,
        totalActiveUserPromise,
        totalInactiveUserPromise,
        totalBlockedUserPromise,
        newUserInLastSevenDaysAgo,
        newUserInLastThirtyDaysAgo,
        roleBasedUser
    ]);
    return {
        totalUser, totalActive, totalInactive, totalBlocked, newUserSeven, newUserThirty, roleUser
    };
});
const tourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const tourTypeWithTourPromise = tour_model_1.Tour.aggregate([
        // stage1: connect tour-type model with tour -> $lookup
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        // stage2 ->> array to object -> unwind
        {
            $unwind: "$type"
        },
        // stage3 - grouping and count
        {
            $group: {
                _id: "$type.name", /*"type": [
                    {
                        "_id": "6880ec7f18c26cf7f41ce27f",
                        "name": "DayLong",
                        "createdAt": "2025-07-23T14:06:55.756Z",
                        "updatedAt": "2025-07-23T14:06:55.756Z"
                    }
                ] */
                count: { $sum: 1 }
            }
        }
    ]);
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        // grouping all and count avg
        {
            $group: {
                _id: null,
                avgCost: { $avg: "$costFrom" }
            }
        }
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        // lookup to add dision in tour
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ]);
    const highestTourBookedPromise = booking_model_1.Booking.aggregate([
        //stage 1 -> grouping by tour and count
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        // stage 2: sort
        {
            $sort: { bookingCount: -1 }
        },
        // stage 3: limit
        {
            $limit: 5
        },
        // stage 4_>. lookup to see the tour name
        // {
        //     $lookup: {
        //         from: "tours",
        //         localField: "tour",
        //         foreignField: "_id",
        //         as: "tourName"
        //     }
        // }
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tourName"
            }
        },
        {
            $unwind: "$tourName"
        },
        {
            $project: {
                bookingCount: 1,
                "tourName.title": 1,
                "tourName.slug": 1
            }
        }
    ]);
    const [totalTour, tourTypeWithTour, avgTourCost, totalTourByDivision, highestTourBooked] = yield Promise.all([
        totalTourPromise,
        tourTypeWithTourPromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        highestTourBookedPromise
    ]);
    return {
        totalTour, tourTypeWithTour, avgTourCost, totalTourByDivision, highestTourBooked
    };
});
const bookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBooking7DaysAgoPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const totalBooking30DaysAgoPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        // group by status
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    const bookingPerTourPromise = booking_model_1.Booking.aggregate([
        // group by tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        // sorting desc
        {
            $sort: { bookingCount: -1 }
        },
        //limit
        {
            $limit: 10
        },
        // lookup
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        // project
        {
            $project: {
                _id: 1,
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        //groupinh
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ]);
    const totalBookingByUniqueUserPromise = booking_model_1.Booking.aggregate([
        //group by user
        {
            $group: {
                _id: "$user",
                userCount: { $sum: 1 }
            }
        },
        {
            $sort: { userCount: -1 }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                userCount: 1,
                "user.name": 1,
                "user.email": 1,
                "user.phone": 1,
                "user.address": 1
            }
        }
    ]);
    const totalUniqueUserBookingPromise = booking_model_1.Booking.distinct("user").then(user => user.length);
    const [totalBooking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking, totalBooking7DaysAgo, totalBooking30DaysAgo, totalBookingByUniqueUser, totalUniqueUserBooking] = yield Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        totalBooking7DaysAgoPromise,
        totalBooking30DaysAgoPromise,
        totalBookingByUniqueUserPromise,
        totalUniqueUserBookingPromise
    ]);
    return {
        totalBooking, totalBookingByStatus, bookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        totalBooking7DaysAgo, totalBooking30DaysAgo, totalBookingByUniqueUser, totalUniqueUserBooking
    };
});
const paymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $match: { status: payment_interface_1.PaymentStatus.PAID }
        },
        {
            $group: {
                _id: null,
                Revenue: { $sum: "$amount" }
            }
        }
    ]);
    const avgRevenuePromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgRevenue: { $avg: "$amount" }
            }
        }
    ]);
    const paymentGateWayDataPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgRevenue, paymentGateWayData] = yield Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgRevenuePromise,
        paymentGateWayDataPromise
    ]);
    return {
        totalPayment, totalPaymentByStatus,
        totalRevenue: totalRevenue[0].Revenue,
        avgRevenue: avgRevenue[0].avgRevenue,
        paymentGateWayData
    };
});
exports.statsService = { userStats, tourStats, bookingStats, paymentStats };
