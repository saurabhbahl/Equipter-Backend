// import { dbInstance } from "../config/dbConnection.cjs";
// import { emiPlan, installmentsTracking } from "../models/tables.js";
// import { faker } from "@faker-js/faker";

// export async function installmentsTrackingSeeder() {
//   const emiPlanIds = await dbInstance
//     .select({ id: emiPlan.id })
//     .from(emiPlan);

//   const installments = Array.from({ length: 3 }, () => ({
//     emi_plan_id: faker.helpers.arrayElement(emiPlanIds).id,
//     installment_number: faker.number.float({ min: 1, max: 12 }),
//     due_date: faker.date.future(),
//     amount: faker.number.float({ min: 100, max: 500, precision: 0.01 }),
//     payment_status: faker.helpers.arrayElement(["Pending", "Paid", "Overdue"]),
//     payment_date: faker.date.recent(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(installmentsTracking).values(installments);
//     console.log("InstallmentsTracking seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding InstallmentsTracking:", error);
//   }
// }

import { dbInstance } from "../config/dbConnection.cjs";
import { emiPlan, installmentsTracking } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function installmentsTrackingSeeder() {
  try {
    const emiPlanIds = await dbInstance
      .select({ id: emiPlan.id })
      .from(emiPlan);

    if (emiPlanIds.length === 0) {
      throw new Error('No EMI plans found.');
    }

    const installments = Array.from({ length: 3 }, () => ({
      emi_plan_id: faker.helpers.arrayElement(emiPlanIds).id,
      installment_number: faker.number.float({ min: 1, max: 12 }), // Ensure this is an integer
      due_date: faker.date.future(),
      amount: faker.number.float({ min: 100, max: 500, precision: 0.01 }),
      payment_status: faker.helpers.arrayElement(["Pending", "Paid", "Overdue"]),
      payment_date: faker.date.recent(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    }));

    await dbInstance.insert(installmentsTracking).values(installments);
    console.log("InstallmentsTracking seeded successfully.");
  } catch (error) {
    console.error("Error seeding InstallmentsTracking:", error);
  }
}


