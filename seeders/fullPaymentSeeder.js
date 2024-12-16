
// export async function fullPaymentSeeder() {
//   const webQuoteIds = await dbInstance
//     .select({ id: webQuote.id })
//     .from(webQuote);

//   const fullPayments = Array.from({ length: 3 }, () => ({
//     webquote_id: faker.helpers.arrayElement(webQuoteIds).id,
//     payment_method: "card",
//     payment_status: faker.helpers.arrayElement(["Pending", "Completed", "Failed", "Refunded"]),
//     total_payment_amount: faker.datatype.float({ min: 100, max: 500, precision: 0.01 }),
//     transaction_reference: faker.finance.transactionDescription(),
//     processed_at: faker.date.recent(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(fullPayment).values(fullPayments);
//     console.log("FullPayments seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding FullPayments:", error);
//   }
// }


// export async function fullPaymentSeeder() {
//   { const webQuoteIds = await dbInstance('webQuote').select('id') .where('financing', 'cash');

//   const fullPayments = webQuoteIds.map((webQuote) => ({
//     webquote_id: webQuote.id,
//     payment_method: "card",
//     payment_status: faker.helpers.arrayElement(["Pending", "Completed"]),
//     total_payment_amount: faker.datatype.number({ min: 500, max: 5000 }),
//     transaction_reference: faker.datatype.uuid(),
//     processed_at: faker.date.recent(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(fullPayment).values(fullPayments);
//     console.log("Full Payments seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding Full Payments:", error);
//   }
// }


// }



// import { sql } from "drizzle-orm";
// import { dbInstance } from "../config/dbConnection.cjs";
// import { webQuote, fullPayment } from "../models/tables.js";
// import { faker } from "@faker-js/faker";

// export async function fullPaymentSeeder() {
//   try {
//     // Fetch WebQuotes where financing is 'cash'
//     const webQuoteIds = await dbInstance
//       .select({ id: webQuote.id })
//       .from(webQuote)
//       .where(sql`${webQuote.financing} = 'cash'`); 

//     const fullPayments = webQuoteIds.map((webQuote) => ({
//       webquote_id: webQuote.id,
//       payment_method: "card",
//       payment_status: faker.helpers.arrayElement(["Pending", "Completed"]),
//       total_payment_amount: faker.number.float({ min: 500, max: 5000, precision: 0.01 }),
//       transaction_reference: faker.string.uuid(),
//       processed_at: faker.date.recent(),
//       created_at: faker.date.recent(),
//       updated_at: faker.date.recent(),
//     }));

//     // Insert the generated data into the full_payment table
//     await dbInstance.insert(fullPayment).values(fullPayments);
//     console.log("Full Payments seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding Full Payments:", error);
//   }
// }

import { sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { webQuote, fullPayment } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function fullPaymentSeeder() {
  try {
    // Fetch WebQuotes where financing is 'cash'
    const webQuoteIds = await dbInstance
      .select({ id: webQuote.id })
      .from(webQuote)
      .where(sql`${webQuote.financing} = 'cash'`);

    for (const webQuote of webQuoteIds) {

      const existingPayment = await dbInstance
        .select({ id: fullPayment.id })
        .from(fullPayment)
        .where(sql`${fullPayment.webquote_id} = ${webQuote.id}`)
        // .first();

      if (existingPayment) {
        console.log(`Full payment already exists for WebQuote ID: ${webQuote.id}`);
        continue;
      }

      // Insert new fullPayment record
      const fullPaymentRecord = {
        webquote_id: webQuote.id,
        payment_method: "card",
        payment_status: faker.helpers.arrayElement(["Pending", "Completed"]),
        total_payment_amount: faker.number.float({ min: 500, max: 5000, precision: 0.01 }),
        transaction_reference: faker.string.uuid(),
        processed_at: faker.date.recent(),
        created_at: faker.date.recent(),
        updated_at: faker.date.recent(),
      };
      await dbInstance.insert(fullPayment).values(fullPaymentRecord);
      console.log(`Inserted full payment for WebQuote ID: ${webQuote.id}`);
    }

    console.log("Full Payments seeded successfully.");
  } catch (error) {
    console.error("Error seeding Full Payments:", error);
  }
}
