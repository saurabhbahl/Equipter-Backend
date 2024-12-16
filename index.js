import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connection } from "./config/dbConnection.cjs";
import salesForceRouter from "./routes/salesForce.routes.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import { checkAdminRole, verifyToken } from "./middlewares/verifyToken.js";
import adminRouter from "./routes/admin.routes.js";
import productRouter from "./routes/product.routes.js";
import accessoryRouter from "./routes/accessory.routes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("dev"));

// CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : [
        "http://localhost:4173",
        "http://localhost:5173",
        "http://192.168.152.1:5173",
      ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/v1/sf", verifyToken, checkAdminRole, salesForceRouter);
app.use("/api/v1/user", verifyToken, checkAdminRole, userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/accessory",  accessoryRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/api/test", (req, res) => {
  res.json({ message: "👍✅" });
});

// Invalid route handling
app.all("/api/*", async (req, res) => {
  return res.json({ success: false, data: "Invalid Route" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : error.message;
  res.status(status).json({ message });
});

// Connect to the database and start the server
connection.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:=>", err, err.stack);
  } else {
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://${client.host}:${PORT}`);
    });
  }
});
