import express from "express";
import { StateService, ZoneService, ZoneStateService } from "../controllers/state.controller.js";
import { checkAdminRole, verifyToken } from "../middlewares/verifyToken.js";

const stateRouter = express.Router();

// State Routes
stateRouter.post("/states", verifyToken,checkAdminRole,StateService.createState);
stateRouter.get("/states", StateService.getAllStates);
stateRouter.get("/states/:id", StateService.getStateById);
stateRouter.put("/states/:id",verifyToken,checkAdminRole, StateService.updateStateById);
stateRouter.delete("/states/:id",verifyToken,checkAdminRole, StateService.deleteStateById);

// Zone Routes
stateRouter.post("/zones",verifyToken,checkAdminRole, ZoneService.createZone);
stateRouter.get("/zones", ZoneService.getAllZones);
stateRouter.get("/zones/:id", ZoneService.getZoneById);
stateRouter.get("/zonesbystate", ZoneService.getZoneByStateId);
stateRouter.put("/zones/:id",verifyToken,checkAdminRole, ZoneService.updateZoneById);
stateRouter.delete("/zones/:id",verifyToken,checkAdminRole, ZoneService.deleteZoneById);

// ZoneState Routes
stateRouter.post("/zone-states",verifyToken,checkAdminRole, ZoneStateService.createZoneState);
stateRouter.get("/zone-states", ZoneStateService.getAllZoneStates);
stateRouter.get("/zone-states/:id", ZoneStateService.getZoneStateById);
stateRouter.put("/zone-states/:id",verifyToken,checkAdminRole, ZoneStateService.updateZoneStateById);
stateRouter.delete("/zone-states/:id",verifyToken,checkAdminRole, ZoneStateService.deleteZoneStateById);

export default stateRouter;
