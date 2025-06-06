import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";


// connection
import { connection } from "./config/dbConnection.cjs";

// middlewares
import { checkAdminRole, verifyToken } from "./middlewares/verifyToken.js";

// routes
import salesForceRouter from "./routes/salesForce.routes.js";
import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import accessoryRouter from "./routes/accessory.routes.js";
import orderRouter from "./routes/order.routes.js";
import webQuoteRouter from "./routes/webQuote.routes.js";
import stateRouter from "./routes/state.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import { paymentService } from "./controllers/payment.controller.js";
import salesForceHooksRouter from "./routes/salesForceHooks.routes.js";
import { SalesForceService } from "./services/salesForceService.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Logging
// app.use(morgan("common"));

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
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production"
        ? {
            directives: {
              defaultSrc: ["'self'"],
            },
          }
        : false,
    referrerPolicy: { policy: "no-referrer" },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    ieNoOpen: true,
    noSniff: true,
    xssFilter: false,
  })
);

// Enforce HSTS in production
if (process.env.NODE_ENV === "production") {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    })
  );

  // Redirect HTTP to HTTPS
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ip logger
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(`IP address of incoming request: ${ip}`);
  next();
});

const sfService=new SalesForceService();


  
app.post("/api/v1/payment/webhook", express.raw({ type: 'application/json' }), paymentService.handleWebhook);
// // Body parsing with size limits
app.use(express.json({ limit: "1000kb" }));
app.use(express.urlencoded({ limit: "1000kb", extended: true }));


// Routes
app.use("/api/v1/sf/hooks",salesForceHooksRouter);
app.use("/api/v1/sf", verifyToken, checkAdminRole, salesForceRouter);
app.use("/api/v1/user", verifyToken, checkAdminRole, userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", verifyToken,checkAdminRole,  orderRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/webquote", webQuoteRouter);
app.use("/api/v1/accessory", accessoryRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/api/test", async(req, res) => {
  res.json({ message: "👍✅" });
});

// Invalid route handling
app.all("/api/*", async (req, res) => {
  return res.json({ success: false, data: "Invalid Route" });
})

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