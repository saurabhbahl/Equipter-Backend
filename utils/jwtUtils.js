import bcryptjs from "bcryptjs";
// import fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_ENC_ALGO } from "../useENV.js";
import { console } from "inspector";

// const privateKey = fs.readFileSync("./private.key", "utf8");
// const publicKey = fs.readFileSync("./public.key", "utf8");

// Function to generate salt
export async function getSalt() {
  const salt = await bcryptjs.genSalt(12);
  return salt;
}

// Function to match passwords
export async function matchPassword(enteredPassword, savedPassword) {
  const isMatch = await bcryptjs.compare(enteredPassword, savedPassword);
  return isMatch;
}

// Function to hash passwords
export async function hashPassword(password, salt) {
  const hashedPassword = await bcryptjs.hash(password, salt);
  return hashedPassword;
}

// Function to generate JWT token
export async function generateToken(
  userData,
  secret = JWT_SECRET,
  expiry = "3h",
) {
  console.time()
  const token = jwt.sign(userData, secret, {
    algorithm: "HS256",
    expiresIn: expiry,
  });
  

  console.timeLog()
  return token
}

export async function decryptToken(token) {
  console.log("Token",token)
  const decryptedTokenBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: TOKEN_ENC_ALGO,
    },
    Buffer.from(token, "base64")
  );

  const decryptedToken = decryptedTokenBuffer.toString("utf8");
  return decryptedToken;
}

  // const encryptedData = crypto.publicEncrypt(
  //   {
  //     key: publicKey,
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     oaepHash: TOKEN_ENC_ALGO,
  //   },
  //   Buffer.from(token)
  // );

  // console.log("Encrypted Data: ", encryptedData.toString("base64"));
  // return encryptedData.toString("base64");