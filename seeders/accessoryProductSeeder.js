import { dbInstance } from "../config/dbConnection.cjs";
import { accessoryProduct } from "../models/tables.js";
import { accessory } from "../models/tables.js";
import { product } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function accessoryProductSeeder() {
  const accessoryIds = await dbInstance
    .select({ id: accessory.id })
    .from(accessory);

  const productIds = await dbInstance
    .select({ id: product.id })
    .from(product);

  const accessoryProducts = Array.from({ length: 3 }, () => ({
    accessory_id: faker.helpers.arrayElement(accessoryIds).id,
    product_id: faker.helpers.arrayElement(productIds).id,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(accessoryProduct).values(accessoryProducts);
    console.log("AccessoryProducts seeded successfully.");
  } catch (error) {
    console.error("Error seeding AccessoryProducts:", error);
  }
}

