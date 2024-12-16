import { dbInstance } from "../config/dbConnection.cjs";
import { accessoryImage } from "../models/tables.js";
import { accessory } from "../models/tables.js";
import { faker } from "@faker-js/faker";

export async function accessoryImageSeeder() {
  const accessoryIds = await dbInstance
    .select({ id: accessory.id })
    .from(accessory);

  const images=["https://www.equipter.com/hubfs/tal-steering-1.jpg","https://www.equipter.com/hubfs/TAL_BigWheels-24EquipterOutdoorLivingMastery27.jpg","https://www.equipter.com/hubfs/3300_FrontWheel_24EquipterSycamoreMonuments81-2.jpg","https://www.equipter.com/hs-fs/hubfs/5400-crane-3.jpg?width=100&height=1000&name=5400-crane-3.jpg"]


  let len=images.length
  let rand=Math.ceil(Math.random()*len)


  const accessoryImages = Array.from({ length: 3 }, () => ({
    accessory_id: faker.helpers.arrayElement(accessoryIds).id,
    image_url: images[rand],
    image_description: faker.commerce.productDescription(),
    is_featured: faker.datatype.boolean(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  }));

  try {
    await dbInstance.insert(accessoryImage).values(accessoryImages);
    console.log("AccessoryImages seeded successfully.");
  } catch (error) {
    console.error("Error seeding AccessoryImages:", error);
  }
}
