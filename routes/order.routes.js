import express from "express";
import { OrderService } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.get("/", OrderService.fetchAllOrders);

export default orderRouter;
