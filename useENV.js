import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_ENC_ALGO = process.env.TOKEN_ENC_ALGO;
export const MAILER_EMAIL = process.env.MAILER_EMAIL;
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
export const SF_ACCESS_TOKEN_URL = process.env.SF_ACCESS_TOKEN_URL;
export const SF_INSTANCE_URL = process.env.SF_INSTANCE_URL;
export const SF_OBJECT_URL = process.env.SF_OBJECT_URL;
export const PORT=process.env.PORT 
export const FRONTEND_URL=process.env.FRONTEND_URL
export const DB_URL=process.env.DB_URL
export const DB_HOST=process.env.DB_HOST
export const DB_USER=process.env.DB_USER
export const DB_NAME=process.env.DB_NAME
export const DB_PASSWORD=process.env.DB_PASSWORD
export const DB_PORT=process.env.DB_PORT