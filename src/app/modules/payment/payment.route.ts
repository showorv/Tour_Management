import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router()

router.post("/init-payment/:bookingId", paymentController.initPayment)
router.post("/success", paymentController.paymentSuccess)
router.post("/fail", paymentController.paymentFail)
router.post("/cancel", paymentController.paymentCancel)
router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), paymentController.invoicePaymentDownloadUrl)

export const paymentRouter = router;