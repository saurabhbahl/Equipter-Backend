import express from "express";
const userRouter = express.Router();
import { createUser, getUsers } from "../controllers/controllers.js";

userRouter.get("/", getUsers);
userRouter.post("/", createUser);

export default userRouter;
