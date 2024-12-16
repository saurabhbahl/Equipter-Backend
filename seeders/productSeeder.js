
import { dbInstance } from "../config/dbConnection.cjs";
import { product } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function productSeeder() {
  const products = Array.from({ length: 3 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    gvwr: faker.number.int({ min: 1000, max: 5000 }), 
    lift_capacity: faker.number.int({ min: 500, max: 2000 }), 
    lift_height: faker.number.int({ min: 5, max: 20 }), 
    product_title: faker.commerce.productAdjective(),
    product_url: faker.internet.url(),
    container_capacity: faker.number.int({ min: 50, max: 500 }), 
    price: faker.number.float({ min: 100, max: 1000, precision: 0.01 }),
    downpayment_cost: faker.number.float({ min: 50, max: 300, precision: 0.01 }),
    meta_title: faker.commerce.productName(),
    stock_quantity: faker.number.int({ min: 1, max: 100 }), 
  }));

  try {
    await dbInstance.insert(product).values(products);
    console.log("Products seeded successfully.");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
