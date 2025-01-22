import express from "express";
import { fetchAllOrders } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.get("/", fetchAllOrders);

export default orderRouter;