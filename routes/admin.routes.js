import express from "express";
import { confirmAdmin } from "../controllers/admin.controllers.js";
const adminRouter = express.Router();

adminRouter.post("/check-admin", confirmAdmin);

export default adminRouter