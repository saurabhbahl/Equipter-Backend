import express from "express";
import { forgetPassword, loginUser, registerUser, resetPassword } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password/:token", resetPassword);


export default authRouter;
