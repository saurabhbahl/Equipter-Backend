import { dbInstance } from "../config/dbConnection.cjs";
import { productImage, product } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function productImageSeeder() {
  const productIds = await dbInstance.select({ id: product.id }).from(product);

  const images = [
    "https://www.equipter.com/hubfs/tal-steering-1.jpg",
    "https://www.equipter.com/hubfs/TAL_BigWheels-24EquipterOutdoorLivingMastery27.jpg",
    "https://www.equipter.com/hubfs/3300_FrontWheel_24EquipterSycamoreMonuments81-2.jpg",
    "https://www.equipter.com/hs-fs/hubfs/5400-crane-3.jpg?width=100&height=1000&name=5400-crane-3.jpg",
  ];

  const productImages = Array.from({ length: 3 }, () => ({
    product_id: faker.helpers.arrayElement(productIds).id,
    image_url: faker.helpers.arrayElement(images), // Random image for each entry
    image_description: faker.commerce.productDescription(),
    is_featured: faker.datatype.boolean(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(productImage).values(productImages);
    console.log("ProductImages seeded successfully.");
  } catch (error) {
    console.error("Error seeding ProductImages:", error);
  }
}
