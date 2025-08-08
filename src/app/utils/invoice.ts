

import PDFDocuement from "pdfkit"
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData{
    transactionId: string,
    bookingDate: Date,
    userName: string
    tourTitle: string
    guestCount: number
    totalAmount: number
}


export const generatePDF =async (invoiceData: IInvoiceData): Promise<Buffer>=>{

    try {
        return new Promise((resolve, reject)=>{

            const doc = new PDFDocuement({size: "A4", margin: 50})

            const buffer: Uint8Array[]= []

            doc.on("data", (chunk)=> buffer.push(chunk))
            doc.on("end", ()=> resolve(Buffer.concat(buffer)))
            doc.on("err", (err)=> reject(err))


            // pdf content

            doc.fontSize(20).text("Invoice", {align: "center"})
            doc.moveDown()

            doc.fontSize(14).text(`transaction Id: ${invoiceData.transactionId}`)
            doc.fontSize(14).text(`Booking Date: ${invoiceData.bookingDate}`)
            doc.fontSize(14).text(`User name: ${invoiceData.userName}`)

            doc.moveDown()

            doc.fontSize(14).text(`Tour: ${invoiceData.tourTitle}`)
            doc.fontSize(14).text(`Guest Number: ${invoiceData.guestCount}`)
            doc.fontSize(14).text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`)

            doc.fontSize(18).text("Thank you for choosing us", {align: "center"})

            doc.end()

        })
    } catch (error) {
        console.log("invoice error", error);
        throw new AppError(401, "error in invoice")
        
    }
}