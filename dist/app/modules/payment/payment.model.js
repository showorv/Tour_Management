"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGateway: {
        type: mongoose_1.Schema.Types.Mixed // string,array,object anything
    },
    invoiceUrl: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.UNPAID
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
