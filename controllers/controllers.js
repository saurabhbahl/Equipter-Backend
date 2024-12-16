import { dbInstance } from "../config/dbConnection.cjs";
import { users } from "../models/userModel.js";

export const getUsers = async (req, res) => {
  console.log("Fetching users...");
  try {
    const response = await dbInstance.select().from(users);
    return res.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const response = await dbInstance
      .insert(users)
      .values(req.body)
      .returning({ id: users.id });
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "User already exists." });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
