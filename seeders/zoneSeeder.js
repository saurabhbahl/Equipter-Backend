import { dbInstance } from "../config/dbConnection.cjs";

import { faker } from "@faker-js/faker";
import { zone } from "../models/tables.js";

export async function zoneSeeder() {
  const zones = [
    { zone_name: 'Zone 1: Local Delivery', shipping_rate: 12.5 },
    { zone_name: 'Zone 2: Nearby Cities', shipping_rate: 17.5 },
    { zone_name: 'Zone 3: Adjacent States', shipping_rate: 22.5 },
    { zone_name: 'Zone 4: Regional Delivery', shipping_rate: 30.0 },
    { zone_name: 'Zone 5: National Delivery', shipping_rate: 42.5 },
    { zone_name: 'Zone 6: Remote Areas', shipping_rate: 60.0 },
    { zone_name: 'Zone 7: Remote States', shipping_rate: 70.0 },
    { zone_name: 'Zone 8: Extended Remote Areas', shipping_rate: 90.0 },
    { zone_name: 'Zone 9: Special Circumstances', shipping_rate: 125.0 },
  ];

  try {
    await dbInstance.insert(zone).values(zones);
    console.log("Zones seeded successfully.");
  } catch (error) {
    console.error("Error seeding zones:", error);
  }
}
