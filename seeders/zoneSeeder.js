import { dbInstance } from "../config/dbConnection.cjs";

import { faker } from "@faker-js/faker";
import { zone } from "../models/tables.js";

export async function zoneSeeder() {
  const zones = Array.from({ length: 3 }, () => ({
    zone_name: faker.location.state(),
    shipping_rate: faker.number.float({ min: 10, max: 50, precision: 0.01 }),
  }));

  try {
    await dbInstance.insert(zone).values(zones);
    console.log("Zones seeded successfully.");
  } catch (error) {
    console.error("Error seeding zones:", error);
  }
}
