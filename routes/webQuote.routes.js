import express from "express";
import { webQuoteService } from "../controllers/webQuote.controller.js";
const webQuoteRouter = express.Router();

webQuoteRouter.post("/", webQuoteService.createNewWebQuote);
webQuoteRouter.get("/", webQuoteService.getAllWebQuotesWithRelatedData);
webQuoteRouter.delete("/:id", webQuoteService.deleteSingleWebQuoteById);
webQuoteRouter.put("/:id", webQuoteService.updateSingleWebQuoteById);

export default webQuoteRouter;
