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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePDF = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // === HEADER ===
            doc
                .fontSize(26)
                .fillColor("#1F4E79")
                .text("Travel Company Ltd.", { align: "center" })
                .moveDown(0.3);
            // Optional: add logo
            // doc.image("path/to/logo.png", 50, 45, { width: 50 });
            // === INVOICE TITLE ===
            doc
                .moveDown()
                .fontSize(20)
                .fillColor("#000000")
                .text("INVOICE", { align: "center" });
            doc
                .moveTo(50, doc.y + 5)
                .lineTo(550, doc.y + 5)
                .strokeColor("#1F4E79")
                .lineWidth(2)
                .stroke();
            doc.moveDown(3);
            // === BASIC INFO ===
            doc.fontSize(12).fillColor("#000000");
            doc.text(`Transaction ID: ${invoiceData.transactionId}`);
            doc.text(`Booking Date: ${invoiceData.bookingDate}`);
            doc.text(`User Name: ${invoiceData.userName}`);
            doc.moveDown(2);
            // === TOUR DETAILS BOX ===
            doc
                .rect(50, doc.y, 500, 110)
                .strokeColor("#1F4E79")
                .lineWidth(1)
                .stroke();
            doc
                .fontSize(14)
                .fillColor("#1F4E79")
                .text("Tour Details", 60, doc.y + 3);
            doc
                .fontSize(12)
                .fillColor("#000000")
                .text(`Tour: ${invoiceData.tourTitle}`, 60, doc.y + 10)
                .text(`Guests: ${invoiceData.guestCount}`, 60, doc.y + 12)
                .text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`, 60, doc.y + 14);
            doc.moveDown(6);
            // === TOTAL AMOUNT HIGHLIGHT ===
            doc
                .fontSize(14)
                .fillColor("#FFFFFF")
                .rect(350, doc.y, 200, 30)
                .fill("#1F4E79");
            doc
                .fillColor("#FFFFFF")
                .text(`Total: $${invoiceData.totalAmount.toFixed(2)}`, 360, doc.y + 7);
            doc.moveDown(4);
            // === FOOTER ===
            doc
                .fontSize(12)
                .fillColor("#666666")
                .text("Thank you for choosing us!", { align: "center" })
                .moveDown(0.5)
                .fontSize(10)
                .text("This is a system generated invoice and does not require a signature.", { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        console.log("invoice error", error);
        throw new AppError_1.default(401, "error in invoice");
    }
});
exports.generatePDF = generatePDF;
