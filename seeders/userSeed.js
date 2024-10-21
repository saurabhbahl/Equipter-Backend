import { faker } from "@faker-js/faker";
import { dbInstance } from "../config/dbConnection.cjs";
import { users } from "../models/userModel.js";
import { getSalt, hashPassword } from "../utils/jwtUtils.js";

export async function userSeed() {
  const salt = await getSalt();
  const hashedPassword = await hashPassword("123456", salt);
  const dummyUsers = [
    {
      name: "Admin User",
      email: "vigoroustesla5@typingsquirrel.com",
      password: hashedPassword,
      role: "admin",
    },
  ];
  for (let i = 0; i < 15; i++) {
    dummyUsers.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "123456",
      // password: faker.internet.password(),
      role: faker.helpers.arrayElement(["user", "admin"]),
    });
  }
  try {
    await dbInstance.insert(users).values(dummyUsers);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
