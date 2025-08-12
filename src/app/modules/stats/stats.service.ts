import { Booking } from "../booking/booking.model"
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

}
const paymentStats = async ()=>{

}


export const statsService = {userStats, tourStats,bookingStats,paymentStats}