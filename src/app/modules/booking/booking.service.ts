import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { BookingStatus, IBooking } from "./booking.interface"
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model"
import { Payment } from "../payment/payment.model"
import { PaymentStatus } from "../payment/payment.interface"
import { Tour } from "../tour/tour.model"


const getTransaction = ()=>{

    return `Tran_${Date.now()}_${Math.floor(Math.random()*1000)}`
}


// booking er mddhe user ta k amra decodedtoken theke pathiye dibo. booking er mddhei payment ta create korbo. booking add korle auto payment create hobe bt unpaid thakbe.shudhu booking id r amount ta add hoye jabe. but jdi kono booking er por kono error hoy booking create hoileo payment create hbe na. thats a catch. etai hcche transaction rollback. means bkash e jdi amra j num e bkash on nei sekhane tk pathay seta kintu user theke tk kate but j number e pathaise sekhane jai na.se tk user chaile ferot ante pare,


const createBookings = async(payload: Partial<IBooking>, userId: string)=>{

    const transactionId = getTransaction()

    const user = await User.findById(userId)



    if(!user?.phone || !user?.address){
        throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile by adding phone no and address")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if(!tour){
        throw new AppError(httpStatus.FORBIDDEN, "tour not found")
    }

    if(!tour.costFrom){
        throw new AppError(httpStatus.FORBIDDEN, "tour has no cost")
    }

    const amount = Number(tour?.costFrom) * Number(payload.guestCount);


    const booking = await Booking.create({
        user: userId,
        status: BookingStatus.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PaymentStatus.UNPAID,
        transactionId: transactionId,
        amount: amount
    })

    const updatedBoking = await Booking.findByIdAndUpdate
                                        ( booking._id , 
                                            { payment: payment._id}, 
                                            {new: true, runValidators: true}
                                        ).populate("user", "name email phone address")
                                        .populate("tour", "title costFrom")
                                        .populate("payment")

    return updatedBoking;


}

const getAllBooking =async ()=>{

}

const getSingleBooking =async ()=>{

}


const getUserBooking = async()=>{

}

const updateStatusBooking =async ()=>{

}

export const bookingService = {createBookings, getAllBooking, getSingleBooking,getUserBooking,updateStatusBooking}