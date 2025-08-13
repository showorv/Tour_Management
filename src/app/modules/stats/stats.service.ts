import { Booking } from "../booking/booking.model"
import { PaymentStatus } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.model"
import { IActive } from "../user/user.interface"
import { User } from "../user/user.model"

const now = new Date() 

const sevenDaysAgo = new Date(now).setDate(now.getDate()  - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate()  - 30)

const userStats = async ()=>{

    const totalUsersPromise = User.countDocuments()

    const totalActiveUserPromise = User.countDocuments({ isActive: IActive.ACTIVE})  // sobgulate await use na kore eksathe promise.all diye dicchi
    const totalInactiveUserPromise = User.countDocuments({ isActive: IActive.INACTIVE})
    const totalBlockedUserPromise = User.countDocuments({ isActive: IActive.BLOCKED})

    const newUserInLastSevenDaysAgo = User.countDocuments({
        createdAt: {$gte : sevenDaysAgo}
    })
    const newUserInLastThirtyDaysAgo = User.countDocuments({
        createdAt: {$gte : thirtyDaysAgo}
    })


    const roleBasedUser = User.aggregate([
        // stage 1: group by Role and count
        {
            $group: {
                _id: "$role",
                count: {  $sum: 1} 

            }
    
        }
    ])

    const [totalUser, totalActive, totalInactive, totalBlocked, newUserSeven, newUserThirty, roleUser] = await Promise.all([
        totalUsersPromise,
        totalActiveUserPromise,
        totalInactiveUserPromise,
        totalBlockedUserPromise,
        newUserInLastSevenDaysAgo,
        newUserInLastThirtyDaysAgo,
        roleBasedUser
    ])
    
    return {
        totalUser, totalActive, totalInactive, totalBlocked, newUserSeven, newUserThirty, roleUser
    }
}
const tourStats = async ()=>{


    const totalTourPromise = Tour.countDocuments()

    const tourTypeWithTourPromise = Tour.aggregate([

        // stage1: connect tour-type model with tour -> $lookup

        {
            $lookup : {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },

        // stage2 ->> array to object -> unwind

        {
            $unwind : "$type"
        },

        // stage3 - grouping and count

        {
            $group : {
                _id: "$type.name",  /*"type": [
                    {
                        "_id": "6880ec7f18c26cf7f41ce27f",
                        "name": "DayLong",
                        "createdAt": "2025-07-23T14:06:55.756Z",
                        "updatedAt": "2025-07-23T14:06:55.756Z"
                    }
                ] */
                count: {$sum: 1}
            }
        }
    ])

    const avgTourCostPromise = Tour.aggregate([

        // grouping all and count avg

        {
            $group : {
                _id: null,
                avgCost: {$avg : "$costFrom"}
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([

        // lookup to add dision in tour

        {
            $lookup: {
                from: "divisions",
                localField:"division",
                foreignField:"_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: {$sum: 1}
            }
        }
    ])

    const highestTourBookedPromise = Booking.aggregate([
        //stage 1 -> grouping by tour and count

        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1}
            }
        },
        // stage 2: sort
        {
            $sort : { bookingCount: -1}
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
                let: {tourId: "$_id"},
               pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$tourId"]}
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
    ])

    const [totalTour,tourTypeWithTour, avgTourCost, totalTourByDivision, highestTourBooked ] = await Promise.all ([
        totalTourPromise,
        tourTypeWithTourPromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        highestTourBookedPromise
    ])

    return {
        totalTour,tourTypeWithTour, avgTourCost, totalTourByDivision, highestTourBooked
    }
}
const bookingStats = async ()=>{

    const totalBookingPromise = Booking.countDocuments()

    const totalBooking7DaysAgoPromise = Booking.countDocuments({
        createdAt: {$gte: sevenDaysAgo}
    })
    const totalBooking30DaysAgoPromise = Booking.countDocuments({
        createdAt: {$gte: thirtyDaysAgo}
    })

    const totalBookingByStatusPromise = Booking.aggregate([

        // group by status

        {
            $group : {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([

        // group by tour
        {
            $group: {
                _id: "$tour",
                bookingCount: {$sum: 1}
            }
        },

        // sorting desc

        {
            $sort: {bookingCount: -1}
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
            $project:{
                _id: 1,
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([

        //groupinh

        {
            $group: {
                _id: null,
                avgGuestCount: {$avg: "$guestCount"}
            }
        }
    ])

    const totalBookingByUniqueUserPromise = Booking.aggregate([

        //group by user

        {
            $group: {
                _id: "$user",
                userCount: {$sum: 1}
            }
        },

        {
            $sort: {userCount: -1}
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
                "user.name":1,
                "user.email":1,
                "user.phone":1,
                "user.address":1
            }
        }
    ]) 


    const totalUniqueUserBookingPromise = Booking.distinct("user").then(user => user.length)

    const [totalBooking,totalBookingByStatus,bookingPerTour,avgGuestCountPerBooking,totalBooking7DaysAgo, totalBooking30DaysAgo,  totalBookingByUniqueUser, totalUniqueUserBooking] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        totalBooking7DaysAgoPromise,
        totalBooking30DaysAgoPromise,
        totalBookingByUniqueUserPromise,
        totalUniqueUserBookingPromise
    ])

    return{
        totalBooking,totalBookingByStatus, bookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount
        ,totalBooking7DaysAgo, totalBooking30DaysAgo, totalBookingByUniqueUser, totalUniqueUserBooking
    }

}
const paymentStats = async ()=>{

    const totalPaymentPromise = Payment.countDocuments()

    const totalPaymentByStatusPromise = Payment.aggregate([

        {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        {
            $match: { status: PaymentStatus.PAID}
        },

        {
            $group: {
                _id: null,
                Revenue: {$sum: "$amount"}
            }
        }
    ])
    const avgRevenuePromise = Payment.aggregate([
       

        {
            $group: {
                _id: null,
                avgRevenue: {$avg: "$amount"}
            }
        }
    ])
    const paymentGateWayDataPromise = Payment.aggregate([
       

        {
            $group: {
                _id: {$ifNull: ["$paymentGatewayData.status", "UNKNOWN"]},
               count: {$sum: 1}
            }
        }
    ])



    const [totalPayment,totalPaymentByStatus,totalRevenue,avgRevenue,paymentGateWayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgRevenuePromise,
        paymentGateWayDataPromise
    ])


    return{
        totalPayment,totalPaymentByStatus,
        totalRevenue: totalRevenue[0].Revenue,
        avgRevenue: avgRevenue[0].avgRevenue,
        paymentGateWayData
 

    }
}


export const statsService = {userStats, tourStats,bookingStats,paymentStats}