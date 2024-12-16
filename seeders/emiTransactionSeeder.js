// import { dbInstance } from "../config/dbConnection.cjs";
// import { emiTransaction } from "../models/tables.js";
// import { installmentsTracking } from "../models/tables.js";
// import { faker } from "@faker-js/faker";

// export async function emiTransactionSeeder() {
//   const installmentIds = await dbInstance
//     .select({ id: installmentsTracking.id })
//     .from(installmentsTracking);

//   const transactions = Array.from({ length: 3 }, () => ({
//     installment_tracking_id: faker.helpers.arrayElement(installmentIds).id,
//     transaction_reference: faker.finance.transactionDescription(),
//     transaction_amount: faker.datatype.float({ min: 50, max: 500, precision: 0.01 }),
//     transaction_status: faker.helpers.arrayElement([
//       "Pending",
//       "Completed",
//       "Failed",
//       "Refunded",
//     ]),
//     payment_method: "card",
//     processed_at: faker.date.recent(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(emiTransaction).values(transactions);
//     console.log("EMITransactions seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding EMITransactions:", error);
//   }
// }

import { dbInstance } from "../config/dbConnection.cjs";
import { emiTransaction, installmentsTracking } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function emiTransactionSeeder() {
  try {
    const installmentIds = await dbInstance
      .select({ id: installmentsTracking.id })
      .from(installmentsTracking);

    if (installmentIds.length === 0) {
      throw new Error('No installments found.');
    }

    const transactions = Array.from({ length: 3 }, () => ({
      installment_tracking_id: faker.helpers.arrayElement(installmentIds).id,
      transaction_reference: faker.finance.transactionDescription(),
      transaction_amount: faker.number.float({ min: 50, max: 500, precision: 0.01 }),
      transaction_status: faker.helpers.arrayElement([
        "Pending",
        "Completed",
        "Failed",
        "Refunded",
      ]),
      payment_method: "card",
      processed_at: faker.date.recent(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    }));

    await dbInstance.insert(emiTransaction).values(transactions);
    console.log("EMITransactions seeded successfully.");
  } catch (error) {
    console.error("Error seeding EMITransactions:", error);
  }
}
