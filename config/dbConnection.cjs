const dotenv = require("dotenv");
const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const connection = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const dbInstance = drizzle(connection);

module.exports = { connection, dbInstance };
