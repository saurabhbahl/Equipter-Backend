import { dbInstance } from "../config/dbConnection.cjs";
import { product, webQuote ,zone,shippingMethod} from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function webQuoteSeeder() {
  const productIds = await dbInstance
    .select({ id: product.id })
    .from(product);

  const zoneIds = await dbInstance
    .select({ id: zone.id })
    .from(zone);

  const shippingMethodIds = await dbInstance
    .select({ id: shippingMethod.id })
    .from(shippingMethod);

  const webQuotes = Array.from({ length: 3 }, () => ({
    webquote_url: faker.internet.url(),
    stage: faker.helpers.arrayElement(["Quote", "Saved", "Ordered"]),
    financing: faker.helpers.arrayElement(["cash", "financing"]),
    product_id: faker.helpers.arrayElement(productIds).id,
    product_name: faker.commerce.productName(),
    product_price: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
    product_qty: faker.number.int({ min: 1, max: 10 }),
    shipping_method_id: faker.helpers.arrayElement(shippingMethodIds).id,
    zone_id: faker.helpers.arrayElement(zoneIds).id,
    contact_first_name: faker.person.firstName(),
    contact_last_name: faker.person.lastName(),
    contact_company_name: faker.company.name(),
    contact_phone_number: faker.phone.number(),
    contact_email: faker.internet.email(),
    contact_industry: faker.commerce.department(),
    contact_job_title: faker.person.jobTitle(),
    billing_same_as_delivery: faker.datatype.boolean(),
    delivery_cost: faker.number.float({ min: 10, max: 50, precision: 0.01 }),
    estimated_delivery_date: faker.date.future(),
    payment_type: faker.helpers.arrayElement(["FullPayment", "EMI"]),
    product_total_cost: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(webQuote).values(webQuotes);
    console.log("WebQuotes seeded successfully.");
  } catch (error) {
    console.error("Error seeding WebQuotes:", error);
  }
}
