// import { sql } from "drizzle-orm";
// import { dbInstance } from "../config/dbConnection.cjs";
// import { emiPlan, webQuote } from "../models/tables.js";
// import { faker } from "@faker-js/faker";

// export async function emiPlanSeeder() {
//   const webQuoteIds = await dbInstance
//     .select({ id: webQuote.id })
//     .from(webQuote);

//   const financingRateConfigIds = await dbInstance
//     .select({ id: financingRateConfig.id })
//     .from(financingRateConfig);

//   const emiPlans = Array.from({ length: 3 }, () => ({
//     webquote_id: faker.helpers.arrayElement(webQuoteIds).id,
//     financing_rate_config_id: faker.helpers.arrayElement(financingRateConfigIds).id,
//     total_financed_amount: faker.datatype.float({ min: 1000, max: 5000, precision: 0.01 }),
//     monthly_emi_amount: faker.datatype.float({ min: 100, max: 500, precision: 0.01 }),
//     number_of_installments: faker.datatype.number({ min: 6, max: 36 }),
//     start_date: faker.date.future(),
//     end_date: faker.date.future(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(emiPlan).values(emiPlans);
//     console.log("EMIPlans seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding EMIPlans:", error);
//   }
// }

// export async function emiPlanSeeder() {
//   const webQuoteIds = await dbInstance
//     .select({ id: webQuote.id })
//     .from(webQuote)
//     .where(sql`financing = 'financing'`);
//     // .where(sql`${webQuote.financing} = 'financing'`);
// console.log(webQuoteIds)
//   const emiPlans = webQuoteIds.map((webQuote) => ({
//     webquote_id: webQuote.id,
//     financing_rate_config_id: faker.helpers.arrayElement(financingRateConfigs).id,
//     total_financed_amount: faker.datatype.number({ min: 1000, max: 10000 }),
//     monthly_emi_amount: faker.datatype.number({ min: 100, max: 1000 }),
//     number_of_installments: faker.datatype.number({ min: 6, max: 24 }),
//     start_date: faker.date.recent(),
//     end_date: faker.date.future(),
//     created_at: faker.date.recent(),
//     updated_at: faker.date.recent(),
//   }));

//   try {
//     await dbInstance.insert(emiPlan).values(emiPlans);
//     console.log("EMI Plans seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding EMI Plans:", error);
//   }
// }


// import { sql } from 'drizzle-orm';
// import { faker } from '@faker-js/faker';

import { sql } from "drizzle-orm";
import { dbInstance } from "../config/dbConnection.cjs";
import { emiPlan, webQuote, financingRateConfig } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function emiPlanSeeder() {
  try {
    // Fetch WebQuote IDs where financing is 'financing'
    const webQuoteIds = await dbInstance
      .select({ id: webQuote.id })
      .from(webQuote)
      .where(sql`${webQuote.financing} = 'financing'`);

    console.log('Web Quote IDs:', webQuoteIds);

    // Fetch FinancingRateConfigs
    const financingRateConfigs = await dbInstance
      .select({ id: financingRateConfig.id })
      .from(financingRateConfig);

    // Check if financingRateConfigs is defined
    if (financingRateConfigs.length === 0) {
      throw new Error('No financing rate configs found.');
    }

    // Generate EMI Plans based on WebQuote IDs
    const emiPlans = webQuoteIds.map((webQuote) => ({
      webquote_id: webQuote.id,
      financing_rate_config_id: faker.helpers.arrayElement(financingRateConfigs).id,
      total_financed_amount: faker.number.int({ min: 1000, max: 10000 }),
      monthly_emi_amount: faker.number.int({ min: 100, max: 1000 }),
      number_of_installments: faker.number.int({ min: 6, max: 24 }),
      start_date: faker.date.recent(),
      end_date: faker.date.future(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    }));

    // Insert EMI Plans into the database
    await dbInstance.insert(emiPlan).values(emiPlans);
    console.log('EMI Plans seeded successfully.');
  } catch (error) {
    console.error('Error seeding EMI Plans:', error);
  }
}
