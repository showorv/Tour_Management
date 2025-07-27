import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { BookingStatus, IBooking } from "./booking.interface"
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model"
import { Payment } from "../payment/payment.model"
import { PaymentStatus } from "../payment/payment.interface"
import { Tour } from "../tour/tour.model"


const getTransaction = ()=>{

    return `tran_${Date.now()}_${Math.floor(Math.random()*1000)}`
}


// booking er mddhe user ta k amra decodedtoken theke pathiye dibo. booking er mddhei payment ta create korbo. booking add korle auto payment create hobe bt unpaid thakbe.shudhu booking id r amount ta add hoye jabe. but jdi kono booking er por kono error hoy booking create hoileo payment create hbe na. thats a catch. etai hcche transaction rollback. means bkash e jdi amra j num e bkash on nei sekhane tk pathay seta kintu user theke tk kate but j number e pathaise sekhane jai na.se tk user chaile ferot ante pare,

// transaction rollback ->>>
/* 
    first of all its duplicate the db collections/ replica

    then its create session 

    old db ->> [ create booking, create payment, update booking ] ->> real db
    old db ->> [ create booking, error, create payment, error update booking, error ] ->> if any error-> not going to real db. its stop the work of previous and send same old db

*/


//! SSLCOMERZ workflow

/* 

1/ Frontend(localhost:5173)-> user-> tour -> booking (pending) -> payment (unpaid) -> sslcomerz page -> payment complete -> backend api -> update booking (success) payment (paid) -> redirect -> Frontend (localhost:5173/payment/sucess)

2/ Frontend(localhost:5173)-> user-> tour -> booking (pending) -> payment (unpaid) -> sslcomerz page -> payment failed/canceled -> backend api -> update booking (pending) payment (unpaid) -> redirect -> Frontend (localhost:5173/payment/fail or cancel)

*/

const createBookings = async(payload: Partial<IBooking>, userId: string)=>{

    const transactionId = getTransaction()

      // create session for transaction rollback
    const session = await Booking.startSession()
    session.startTransaction(); // give this session to create,update, in get not. in create have to give an array in first arguement

    try {
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
    
    
        const booking = await Booking.create([{
            user: userId,
            status: BookingStatus.PENDING,
            ...payload
        }], {session})  // in create or update session gives an array.
    
        // throw new Error()
    
        // booking create er payment e kono error na thkle booking create hoileo payment create hobe na. thats why transaction rollback use korte hbe
    
        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PaymentStatus.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], {session})
    
        const updatedBoking = await Booking.findByIdAndUpdate
                                            ( booking[0]._id , 
                                                { payment: payment[0]._id}, 
                                                {new: true, runValidators: true,session}
                                            ).populate("user", "name email phone address")
                                            .populate("tour", "title costFrom")
                                            .populate("payment")
    
                                            await session.commitTransaction() // transaction here
                                            session.endSession()
    
        return updatedBoking;
        
    } catch (error) {
        await session.abortTransaction() // rollback
        session.endSession()
        throw error;
    }

   


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