import express from "express";
import { webQuoteService } from "../controllers/webQuote.controller.js";
const webQuoteRouter = express.Router();

webQuoteRouter.post("/", webQuoteService.createNewWebQuote);
webQuoteRouter.get("/", webQuoteService.getAllWebQuotesWithRelatedData);
webQuoteRouter.get("/:id", webQuoteService.getWebQuote);
webQuoteRouter.delete("/:id", webQuoteService.deleteSingleWebQuoteById);
webQuoteRouter.put("/:id", webQuoteService.updateSingleWebQuoteById);
webQuoteRouter.post("/send-mail", webQuoteService.sendMail);

export default webQuoteRouter;
