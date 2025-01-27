import express from "express";
import { confirmAdmin } from "../controllers/admin.controllers.js";
import { paymentService } from "../controllers/payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/makePayment", paymentService.makePayment);
paymentRouter.post("/sendInvoice", paymentService.createInvoiceAndSendEmail);
paymentRouter.post("/create-checkout-session", paymentService.createCheckoutSession);
paymentRouter.post("/webhook", paymentService.handleWebhook);

export default paymentRouter