import { Types } from "mongoose";


export enum PaymentStatus{
    PAID= "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}


export interface IPayment {

    booking: Types.ObjectId;
   
    transactionId: string; // unique like slung
    amount: number;
    paymentGateway ?: any;
    invoiceUrl?: string;
    status: PaymentStatus

}