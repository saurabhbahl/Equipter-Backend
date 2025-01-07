import { count, eq } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { zone, zoneState, state } from "../models/tables.js";
export class StateService {
  // CREATE a new State
  static async createState(req, res) {
    try {
      if (!req.body || !req.body.state_name) {
        return res.status(400).json({
          success: false,
          error: "'state_name' is required",
        });
      }

      const [createdState] = await dbInstance
        .insert(state)
        .values(req.body)
        .returning(); // returns an array of inserted rows

      return res.status(201).json({
        success: true,
        data: createdState,
        message: "State created successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET ALL States (with optional pagination)
  static async getAllStates1(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [statesRes, totalCountRes] = await Promise.all([
        dbInstance.select().from(state).orderBy(state.state_name),
      await dbInstance
        .select({
          id: zone.id,
          zone_name: zone.zone_name,
          shipping_rate: zone.shipping_rate,
          created_at: zone.created_at,
          updated_at: zone.updated_at,
          state_name: state.state_name,
          is_delivery_paused:state.is_delivery_paused,
          stateId:zoneState.state_id,
          zoneId:zoneState.zone_id
          
        })
        .from(zone)
        .innerJoin(zoneState, eq(zoneState.zone_id, zone.id))
        .rightJoin(state, eq(state.id, stateId))
        .where(eq(zoneState.state_id, stateId)),
        dbInstance.select({ count: count() }).from(state),
      ]);

      const totalCount = totalCountRes[0].count;

      return res.status(200).json({
        success: true,
        data: statesRes,
        length: statesRes.length,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }


  static async getAllStates(req, res) {
    try {
      // 1. Fetch all states ordered by state_name
      const states = await dbInstance
        .select({
          id: state.id,
          state_name: state.state_name,
          is_delivery_paused: state.is_delivery_paused,
          created_at: state.created_at,
          updated_at: state.updated_at,
        })
        .from(state)
        .orderBy(state.state_name);

      // 2. Fetch all zoneState and associated zones
      const zoneStates = await dbInstance
        .select({
          state_id: zoneState.state_id,
          zone_id: zone.id,
          zone_name: zone.zone_name,
          shipping_rate: zone.shipping_rate,
          zone_created_at: zone.created_at,
          zone_updated_at: zone.updated_at,
        })
        .from(zoneState)
        .innerJoin(zone, eq(zoneState.zone_id, zone.id));

      // 3. Map zones to their respective states
      const stateMap = states.reduce((acc, curr) => {
        acc[curr.id] = { ...curr, zone: [] };
        return acc;
      }, {});

      zoneStates.forEach((zs) => {
        if (stateMap[zs.state_id]) {
          stateMap[zs.state_id].zones.push({
            id: zs.zone_id,
            zone_name: zs.zone_name,
            shipping_rate: zs.shipping_rate,
            created_at: zs.zone_created_at,
            updated_at: zs.zone_updated_at,
          });
        }
      });

      // 4. Convert the stateMap back to an array
      const statesWithZones = Object.values(stateMap);

      // 5. Fetch total count of states
      const totalCountResult = await dbInstance
        .select({ count: count() })
        .from(state)
    

      const totalCount = totalCountResult?.count || 0;

      // 6. Return the response
      return res.status(200).json({
        success: true,
        data: statesWithZones,
        length: statesWithZones.length,
        totalCount,
      });
    } catch (error) {
      console.error("Error in getAllStates:", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }


  // GET SINGLE State by ID
  static async getStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing state ID" });
      }

      const [foundState] = await dbInstance
        .select()
        .from(state)
        .where(eq(state.id, id));

      if (!foundState) {
        return res
          .status(404)
          .json({ success: false, error: "State not found" });
      }

      return res.status(200).json({ success: true, data: foundState });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // UPDATE State
  static async updateStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing state ID" });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request body" });
      }

      const [updatedState] = await dbInstance
        .update(state)
        .set(req.body)
        .where(eq(state.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        data: updatedState,
        message: "State updated successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE State
  static async deleteStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing state ID" });
      }

      const [deletedState] = await dbInstance
        .delete(state)
        .where(eq(state.id, id))
        .returning();

      if (!deletedState) {
        return res.status(404).json({
          success: false,
          error: "State not found or already deleted",
        });
      }

      return res.status(200).json({
        success: true,
        data: deletedState,
        message: "State deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export class ZoneService {
  // CREATE a new Zone
  static async createZone(req, res) {
    try {
      if (!req.body || !req.body.zone_name) {
        return res.status(400).json({
          success: false,
          error: "'zone_name' is required",
        });
      }

      const [createdZone] = await dbInstance
        .insert(zone)
        .values(req.body)
        .returning();

      return res.status(201).json({
        success: true,
        data: createdZone,
        message: "Zone created successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET ALL Zones (with optional pagination)
  static async getAllZones(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [zonesRes, totalCountRes] = await Promise.all([
        dbInstance.select().from(zone).limit(limit).offset(offset),
        dbInstance.select({ count: count() }).from(zone),
      ]);

      const totalCount = totalCountRes[0].count;

      return res.status(200).json({
        success: true,
        data: zonesRes,
        length: zonesRes.length,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET SINGLE Zone by ID
  static async getZoneById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone ID" });
      }

      const [foundZone] = await dbInstance
        .select()
        .from(zone)
        .where(eq(zone.id, id));

      if (!foundZone) {
        return res
          .status(404)
          .json({ success: false, error: "Zone not found" });
      }

      return res.status(200).json({ success: true, data: foundZone });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  //   GET Zone by StateId
  static async getZoneByStateId(req, res) {
    try {
      const { stateId } = req.query;

      // 1. Validate presence of stateId
      if (!stateId) {
        return res.status(400).json({
          success: false,
          error: "Missing state ID",
        });
      }

      // 2. Query zones associated with the provided stateId via zoneState
      const zones = await dbInstance
        .select({
          id: zone.id,
          zone_name: zone.zone_name,
          shipping_rate: zone.shipping_rate,
          created_at: zone.created_at,
          updated_at: zone.updated_at,
          state_name: state.state_name,
          is_delivery_paused:state.is_delivery_paused,
          stateId:zoneState.state_id,
          zoneId:zoneState.zone_id
          
        })
        .from(zone)
        .innerJoin(zoneState, eq(zoneState.zone_id, zone.id))
        .rightJoin(state, eq(state.id, stateId))
        .where(eq(zoneState.state_id, stateId));

      // 3. Check if any zones were found
      if (zones.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No zones found for the provided state ID.",
        });
      }

      // 4. Return the fetched zones
      return res.status(200).json({
        success: true,
        data: zones,
      });
    } catch (error) {
      console.error("Error in getZoneByStateId:", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }

  // UPDATE Zone
  static async updateZoneById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone ID" });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request body" });
      }

      const [updatedZone] = await dbInstance
        .update(zone)
        .set(req.body)
        .where(eq(zone.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        data: updatedZone,
        message: "Zone updated successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE Zone
  static async deleteZoneById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone ID" });
      }

      const [deletedZone] = await dbInstance
        .delete(zone)
        .where(eq(zone.id, id))
        .returning();

      if (!deletedZone) {
        return res
          .status(404)
          .json({ success: false, error: "Zone not found or already deleted" });
      }

      return res.status(200).json({
        success: true,
        data: deletedZone,
        message: "Zone deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export class ZoneStateService {
  // CREATE a new zone_state entry
  static async createZoneState(req, res) {
    try {
      if (!req.body || !req.body.zone_id || !req.body.state_id) {
        return res.status(400).json({
          success: false,
          error: "'zone_id' and 'state_id' are required",
        });
      }

      const [createdZoneState] = await dbInstance
        .insert(zoneState)
        .values(req.body)
        .returning();

      return res.status(201).json({
        success: true,
        data: createdZoneState,
        message: "ZoneState created successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET ALL zone_state entries (with optional pagination)
  static async getAllZoneStates(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const [zoneStatesRes, totalCountRes] = await Promise.all([
        dbInstance.select().from(zoneState).limit(limit).offset(offset),
        dbInstance.select({ count: count() }).from(zoneState),
      ]);

      const totalCount = totalCountRes[0].count;

      return res.status(200).json({
        success: true,
        data: zoneStatesRes,
        length: zoneStatesRes.length,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET SINGLE zone_state by ID
  static async getZoneStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone_state ID" });
      }

      const [foundZoneState] = await dbInstance
        .select()
        .from(zoneState)
        .where(eq(zoneState.id, id));

      if (!foundZoneState) {
        return res.status(404).json({
          success: false,
          error: "ZoneState not found",
        });
      }

      return res.status(200).json({ success: true, data: foundZoneState });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // UPDATE zone_state entry
  static async updateZoneStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone_state ID" });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request body" });
      }

      const [updatedZoneState] = await dbInstance
        .update(zoneState)
        .set(req.body)
        .where(eq(zoneState.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        data: updatedZoneState,
        message: "ZoneState updated successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE zone_state
  static async deleteZoneStateById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: "Missing zone_state ID" });
      }

      const [deletedZoneState] = await dbInstance
        .delete(zoneState)
        .where(eq(zoneState.id, id))
        .returning();

      if (!deletedZoneState) {
        return res.status(404).json({
          success: false,
          error: "ZoneState not found or already deleted",
        });
      }

      return res.status(200).json({
        success: true,
        data: deletedZoneState,
        message: "ZoneState deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
