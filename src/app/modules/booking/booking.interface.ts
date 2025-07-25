// User ->. select tour -> booking tour (pending)->> payment (unpaid)-> payment complete ->. booking update = Confirm -> payment update = paid

import { Types } from "mongoose";


export enum BookingStatus{
    PENDING = "PENDING",
    COMPLETE = "COMPLETE",
    CANCEL ="CANCEL",
    FAILED = "FAILED"
}

export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId,
    payment?: Types.ObjectId,
    guestCount: number,
    status: BookingStatus
}