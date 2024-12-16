import { dbInstance } from "../config/dbConnection.cjs";
import { zoneState } from "../models/tables.js";
import { zone } from "../models/tables.js";
import { state } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function zoneStateSeeder() {
  const zoneIds = await dbInstance
    .select({ id: zone.id })
    .from(zone);

  const stateIds = await dbInstance
    .select({ id: state.id })
    .from(state);

  const zoneStates = Array.from({ length: 3 }, () => ({
    zone_id: faker.helpers.arrayElement(zoneIds).id,
    state_id: faker.helpers.arrayElement(stateIds).id,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(zoneState).values(zoneStates);
    console.log("ZoneStates seeded successfully.");
  } catch (error) {
    console.error("Error seeding ZoneStates:", error);
  }
}
