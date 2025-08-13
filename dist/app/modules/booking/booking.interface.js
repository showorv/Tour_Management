"use strict";
// User ->. select tour -> booking tour (pending)->> payment (unpaid)-> payment complete ->. booking update = Confirm -> payment update = paid
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["COMPLETE"] = "COMPLETE";
    BookingStatus["CANCEL"] = "CANCEL";
    BookingStatus["FAILED"] = "FAILED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
