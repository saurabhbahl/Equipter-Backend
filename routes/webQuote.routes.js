import express from "express";
import { webQuoteService } from "../controllers/webQuote.controller.js";
import { checkAdminRole, verifyToken } from "../middlewares/verifyToken.js";
const webQuoteRouter = express.Router();

webQuoteRouter.post("/", webQuoteService.createNewWebQuote);
webQuoteRouter.get("/", verifyToken,checkAdminRole, webQuoteService.getAllWebQuotesWithRelatedData);
webQuoteRouter.get("/:id", webQuoteService.getWebQuote);
webQuoteRouter.delete("/:id", webQuoteService.deleteSingleWebQuoteById);
webQuoteRouter.put("/:id", webQuoteService.updateSingleWebQuoteById);
webQuoteRouter.post("/send-mail", webQuoteService.sendMail);


// quote accessory
webQuoteRouter.post("/quote-accessory",webQuoteService.createQuoteAccessory)



export default webQuoteRouter;
