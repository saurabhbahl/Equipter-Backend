import { dbInstance } from "../config/dbConnection.cjs";
import { accessory } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function accessorySeeder() {
  const accessories = Array.from({ length: 3 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    meta_title: faker.lorem.words(3),
    accessory_title: faker.commerce.productAdjective(),
    accessory_url: faker.internet.url(),
    price: faker.number.float({ min: 20, max: 200, precision: 0.01 }),
    stock_quantity: faker.number.int({ min: 1, max: 50 }),
  }));

  try {
    await dbInstance.insert(accessory).values(accessories);
    console.log("Accessories seeded successfully.");
  } catch (error) {
    console.error("Error seeding accessories:", error);
  }
}
