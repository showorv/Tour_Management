import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ISSLComerz } from "./sslcomerz.interface";
import axios from "axios"
import httpsCode from "http-status-codes"

const sslcomerzInitialize = async (payload: ISSLComerz)=>{
    try {
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url:`${envVars.SSL.SSL_SUCCESS_BACKEND_URL }?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url:`${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url:`${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel` ,
            // ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        }
    
        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        })
    
        return response.data
    } catch (error:any) {
        
        throw new AppError(httpsCode.BAD_REQUEST, error.message)
    }
   
}

export const sslcomerzService = {sslcomerzInitialize}