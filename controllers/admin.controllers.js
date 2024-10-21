import { dbInstance } from "../config/dbConnection.cjs";
import { users } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../useENV.js";
import { eq } from "drizzle-orm";

export async function confirmAdmin(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: "HS256",
    });

    console.log("Decoded", decoded);

    // Fetch user from database
    let user = await dbInstance
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    user = user[0];  
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the user is not an admin
    if (user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({ message: "Access granted", success: true });

  } catch (error) {
    // error is due to an expired token
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
        expiredAt: error.expiredAt,
      });
    }
    
    //  other JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    console.error("Error in confirmAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", success: false, error });
  }
}