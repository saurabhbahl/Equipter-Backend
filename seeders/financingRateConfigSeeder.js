import { dbInstance } from "../config/dbConnection.cjs";
import { financingRateConfig } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function financingRateConfigSeeder() {
  const configs = Array.from({ length: 1 }, () => ({
    interest_rate: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(financingRateConfig).values(configs);
    console.log("FinancingRateConfigs seeded successfully.");
  } catch (error) {
    console.error("Error seeding FinancingRateConfigs:", error);
  }
}
