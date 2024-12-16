import { dbInstance } from "../config/dbConnection.cjs";
import { shippingMethod } from "../models/tables.js";

export async function shippingMethodSeeder() {
  const methods = [
    { method_type: "pickup", name: "Store Pickup", description: "Pick up at store" },
    { method_type: "delivery", name: "Home Delivery", description: "Delivery to your address" },
  ];

  try {
    await dbInstance.insert(shippingMethod).values(methods);
    console.log("Shipping methods seeded successfully.");
  } catch (error) {
    console.error("Error seeding shipping methods:", error);
  }
}
