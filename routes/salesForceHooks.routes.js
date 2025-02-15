import express from "express";
import { salesForceHooksService } from "../controllers/salesForceHooks.controllers.js";
const salesForceHooksRouter = express.Router();


// for handling webQuotes
salesForceHooksRouter.post("/webquote",salesForceHooksService.webQuoteHandler);

// for handling orders
salesForceHooksRouter.post("/order",salesForceHooksService.orderHandler);


export default salesForceHooksRouter;

