import express from "express";
const salesForceRouter = express.Router();
import {
  sFAddNewObject,
  sFQuery,
} from "../controllers/salesForce.controllers.js";
import { checkSFAccessToken } from "../middlewares/sFMiddlewares.js";

// for querying on salesforce object
salesForceRouter.post("/query",checkSFAccessToken ,sFQuery)

// for adding new sales force object
salesForceRouter.post("/object/new", checkSFAccessToken,sFAddNewObject);

export default salesForceRouter;

