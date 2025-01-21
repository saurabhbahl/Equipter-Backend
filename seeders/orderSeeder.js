import { dbInstance } from "../config/dbConnection.cjs";
import { order } from "../models/tables.js";
import { webQuote } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function orderSeeder() {
  const webQuoteIds = await dbInstance
    .select({ id: webQuote.id })
    .from(webQuote);

  const orders = Array.from({ length: 3 }, () => ({
    webquote_id: faker.helpers.arrayElement(webQuoteIds).id,
    order_status: faker.helpers.arrayElement([
      "Approved",
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
    ]),
    estimated_completion_date: faker.date.future(),
    actual_completion_date: faker.datatype.boolean() ? faker.date.future() : null,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(order).values(orders);
    console.log("Orders seeded successfully.");
  } catch (error) {
    console.error("Error seeding Orders:", error);
  }
}


orderSeeder();