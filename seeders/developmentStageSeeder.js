import { dbInstance } from "../config/dbConnection.cjs";
import { developmentStage } from "../models/tables.js";
import { order } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function developmentStageSeeder() {
  const orderIds = await dbInstance
    .select({ id: order.id })
    .from(order);

  const developmentStages = Array.from({ length: 2 }, () => ({
    product_order_id: faker.helpers.arrayElement(orderIds).id,
    stage_name: faker.helpers.arrayElement([
      "Design",
      "Manufacturing",
      "Assembly",
      "Testing",
    ]),
    stage_status: faker.helpers.arrayElement([
      "Pending",
      "InProgress",
      "Completed",
      "Delayed",
    ]),
    started_at: faker.date.recent(),
    completed_at: faker.datatype.boolean() ? faker.date.future() : null,
    remarks: faker.lorem.sentence(),
    delay_reason: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    estimated_completion_date: faker.date.future(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(developmentStage).values(developmentStages);
    console.log("DevelopmentStages seeded successfully.");
  } catch (error) {
    console.error("Error seeding DevelopmentStages:", error);
  }
}
