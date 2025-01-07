import express from "express";
import { StateService, ZoneService, ZoneStateService } from "../controllers/state.controller.js";

const stateRouter = express.Router();

// State Routes
stateRouter.post("/states", StateService.createState);
stateRouter.get("/states", StateService.getAllStates);
stateRouter.get("/states/:id", StateService.getStateById);
stateRouter.put("/states/:id", StateService.updateStateById);
stateRouter.delete("/states/:id", StateService.deleteStateById);

// Zone Routes
stateRouter.post("/zones", ZoneService.createZone);
stateRouter.get("/zones", ZoneService.getAllZones);
stateRouter.get("/zones/:id", ZoneService.getZoneById);
stateRouter.get("/zonesbystate", ZoneService.getZoneByStateId);
stateRouter.put("/zones/:id", ZoneService.updateZoneById);
stateRouter.delete("/zones/:id", ZoneService.deleteZoneById);

// ZoneState Routes
stateRouter.post("/zone-states", ZoneStateService.createZoneState);
stateRouter.get("/zone-states", ZoneStateService.getAllZoneStates);
stateRouter.get("/zone-states/:id", ZoneStateService.getZoneStateById);
stateRouter.put("/zone-states/:id", ZoneStateService.updateZoneStateById);
stateRouter.delete("/zone-states/:id", ZoneStateService.deleteZoneStateById);

export default stateRouter;
