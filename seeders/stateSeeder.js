import { dbInstance } from "../config/dbConnection.cjs";
import { state } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function stateSeeder() {
  const states = Array.from({ length: 3 }, () => ({
    state_name: faker.location.state(),
    is_delivery_paused: faker.datatype.boolean(),
  }));

  try {
    await dbInstance.insert(state).values(states);
    console.log("States seeded successfully.");
  } catch (error) {
    console.error("Error seeding states:", error);
  }
}
