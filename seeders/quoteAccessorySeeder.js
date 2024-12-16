import { dbInstance } from "../config/dbConnection.cjs";
import { accessory, quoteAccessory, webQuote } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function quoteAccessorySeeder() {
  const webQuoteIds = await dbInstance
    .select({ id: webQuote.id })
    .from(webQuote);

  const accessoryIds = await dbInstance
    .select({ id: accessory.id })
    .from(accessory);

  const quoteAccessories = Array.from({ length: 3 }, () => ({
    webquote_id: faker.helpers.arrayElement(webQuoteIds).id,
    accessory_id: faker.helpers.arrayElement(accessoryIds).id,
    accessory_name: faker.commerce.productName(),
    quantity: faker.number.float({ min: 1, max: 5 }),
    unit_price: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    total_price: faker.number.float({ min: 20, max: 500, precision: 0.01 }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(quoteAccessory).values(quoteAccessories);
    console.log("QuoteAccessories seeded successfully.");
  } catch (error) {
    console.error("Error seeding QuoteAccessories:", error);
  }
}
