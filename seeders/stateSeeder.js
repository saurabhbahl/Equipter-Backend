import { dbInstance } from "../config/dbConnection.cjs";
import { state } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function stateSeeder() {
  const usStates = [
    { state_name: 'Alabama', is_delivery_paused: false },
    { state_name: 'Alaska', is_delivery_paused: false },
    { state_name: 'Arizona', is_delivery_paused: false },
    { state_name: 'Arkansas', is_delivery_paused: false },
    { state_name: 'California', is_delivery_paused: false },
    { state_name: 'Colorado', is_delivery_paused: false },
    { state_name: 'Connecticut', is_delivery_paused: false },
    { state_name: 'Delaware', is_delivery_paused: false },
    { state_name: 'Florida', is_delivery_paused: false },
    { state_name: 'Georgia', is_delivery_paused: false },
    { state_name: 'Hawaii', is_delivery_paused: false },
    { state_name: 'Idaho', is_delivery_paused: false },
    { state_name: 'Illinois', is_delivery_paused: false },
    { state_name: 'Indiana', is_delivery_paused: false },
    { state_name: 'Iowa', is_delivery_paused: false },
    { state_name: 'Kansas', is_delivery_paused: false },
    { state_name: 'Kentucky', is_delivery_paused: false },
    { state_name: 'Louisiana', is_delivery_paused: false },
    { state_name: 'Maine', is_delivery_paused: false },
    { state_name: 'Maryland', is_delivery_paused: false },
    { state_name: 'Massachusetts', is_delivery_paused: false },
    { state_name: 'Michigan', is_delivery_paused: false },
    { state_name: 'Minnesota', is_delivery_paused: false },
    { state_name: 'Mississippi', is_delivery_paused: false },
    { state_name: 'Missouri', is_delivery_paused: false },
    { state_name: 'Montana', is_delivery_paused: false },
    { state_name: 'Nebraska', is_delivery_paused: false },
    { state_name: 'Nevada', is_delivery_paused: false },
    { state_name: 'New Hampshire', is_delivery_paused: false },
    { state_name: 'New Jersey', is_delivery_paused: false },
    { state_name: 'New Mexico', is_delivery_paused: false },
    { state_name: 'New York', is_delivery_paused: false },
    { state_name: 'North Carolina', is_delivery_paused: false },
    { state_name: 'North Dakota', is_delivery_paused: false },
    { state_name: 'Ohio', is_delivery_paused: false },
    { state_name: 'Oklahoma', is_delivery_paused: false },
    { state_name: 'Oregon', is_delivery_paused: false },
    { state_name: 'Pennsylvania', is_delivery_paused: false },
    { state_name: 'Rhode Island', is_delivery_paused: false },
    { state_name: 'South Carolina', is_delivery_paused: false },
    { state_name: 'South Dakota', is_delivery_paused: false },
    { state_name: 'Tennessee', is_delivery_paused: false },
    { state_name: 'Texas', is_delivery_paused: false },
    { state_name: 'Utah', is_delivery_paused: false },
    { state_name: 'Vermont', is_delivery_paused: false },
    { state_name: 'Virginia', is_delivery_paused: false },
    { state_name: 'Washington', is_delivery_paused: false },
    { state_name: 'West Virginia', is_delivery_paused: false },
    { state_name: 'Wisconsin', is_delivery_paused: false },
    { state_name: 'Wyoming', is_delivery_paused: false },
  ];
  try {
    await dbInstance.insert(state).values(usStates);
    console.log("States seeded successfully.");
  } catch (error) {
    console.error("Error seeding states:", error);
  }
}
