import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import { JWT_SECRET, TOKEN_ENC_ALGO } from "../useENV.js";
import { dbInstance } from "../config/dbConnection.cjs";
import { users } from "../models/userModel.js";
import { eq } from "drizzle-orm";

// const publicKey = fs.readFileSync("./public.key", "utf8");
// const privateKey = fs.readFileSync("./private.key", "utf8");

// Middleware to verify JWT token
export async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access!",
    });
  }
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: "HS256",
    });
    console.log("Decoded Payload:", decoded.role);
    const userExists = await dbInstance
      .select()
      .from(users)
      .where(eq(users.email, decoded.email));

    if (!userExists?.[0]) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access!", });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
}

export const checkAdminRole = (req, res, next) => {
  try {
    if (req.user.role != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access!" });
    }
    next();
  } catch (error) {
    console.error(error);
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
};
