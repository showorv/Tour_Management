import AppError from "../../errorHelpers/AppError";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model"
import { ISSLComerz } from "../sslcomerz/sslcomerz.interface";
import { sslcomerzService } from "../sslcomerz/sslcomerz.service";
import { PaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";
import httpsStatus from "http-status-codes"

const initPayment =async (bookingId: string)=>{

    // assume user first e payment e cancel korse.but pore abr pay korar jnne to url ashbe na. tai ekhan theke again url create kore sslcomerz page e pathanoi  main logic


    const payment = await Payment.findOne ( { booking: bookingId})

    if(!payment){
        throw new AppError(httpsStatus.NOT_FOUND, "payment not found. you have not booked tour")
    }


    const booking = await Booking.findById(payment.booking)
                                       
    const userAddress =( booking?.user as any).address;
    const userName =( booking?.user as any).name;
    const userPhone =( booking?.user as any).phone;
    const userEmail =( booking?.user as any).email;

    const sslPayload : ISSLComerz = {
        
        address: userAddress,
        name: userName,
        phone: userPhone,
        email: userEmail,
        transactionId: payment.transactionId,
        amount: payment.amount

    }

   const sslcomerz =  await sslcomerzService.sslcomerzInitialize(sslPayload)

   return{
    paymentUrl: sslcomerz.GatewayPageURL
    
   }

  
   
}
const paymentSuccess =async (query: Record<string ,string>)=>{

    // updated booking status
    // update payment status
    // redirect to frontend
    //not send reponse

            const session = await Booking.startSession()
            session.startTransaction();

        try {
            
        
        
            // payment k transaction id er maddhome get korte pari. r transaction id amra query theke nite pari.
        
            const updatedPayment = await Payment.findOneAndUpdate( {transactionId: query.transactionId} , {
                status: PaymentStatus.PAID
            },
            {new: true, runValidators: true, session})
        
        
            await Booking.findByIdAndUpdate( 
                updatedPayment?.booking, 
                { status: BookingStatus.COMPLETE}, 
                {new: true, runValidators: true, session})
            
        
        
            await session.commitTransaction() // transaction here
            session.endSession()     

            return {success: true,  message: "Payment completed successfully"}

        } catch (error) {
            await session.abortTransaction() // rollback
            session.endSession()
            throw error;
        }
   
}
const paymentFail =async (query: Record<string ,string>)=>{
 const session = await Booking.startSession()
            session.startTransaction();

        try {
            
        
        
            // payment k transaction id er maddhome get korte pari. r transaction id amra query theke nite pari.
        
            const updatedPayment = await Payment.findOneAndUpdate( {transactionId: query.transactionId} , {
                status: PaymentStatus.FAILED
            },
            {new: true, runValidators: true, session})
        
        
            await Booking.findByIdAndUpdate( 
                updatedPayment?.booking, 
                { status: BookingStatus.FAILED}, 
                {new: true, runValidators: true, session})
           
        
        
            await session.commitTransaction() // transaction here
            session.endSession()     

            return {success: true,  message: "Payment failed"}
            
        } catch (error) {
            await session.abortTransaction() // rollback
            session.endSession()
            throw error;
        }
   
}
const paymentCancel =async (query: Record<string ,string>)=>{
    const session = await Booking.startSession()
    session.startTransaction();

try {
    


   

    const updatedPayment = await Payment.findOneAndUpdate( {transactionId: query.transactionId} , {
        status: PaymentStatus.CANCELLED
    },
    {new: true, runValidators: true, session})


    await Booking.findByIdAndUpdate( 
        updatedPayment?.booking, 
        { status: BookingStatus.CANCEL}, 
        {new: true, runValidators: true, session})
   


    await session.commitTransaction() // transaction here
    session.endSession()     

    return {success: true,  message: "Payment cancelled"}
    
} catch (error) {
    await session.abortTransaction() // rollback
    session.endSession()
    throw error;
}

}


export const paymentService = {paymentCancel,paymentFail,paymentSuccess,initPayment}