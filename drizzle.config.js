// schema: [
//     './schema1.js',
//     './schema2.js'
//   ],
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { DB_URL } from "./useENV.js";
dotenv.config();
export default defineConfig({
  schema: "models/userModel.js",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: DB_URL,
  },
  dialect: "postgresql",
});
