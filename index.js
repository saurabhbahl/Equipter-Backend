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

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Logging
app.use(morgan("combined"));

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
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
// app.use(helmet())
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

app.use((req, res, next) => {
  console.log("Request coming from IP:", req.ip);
  next();
});

// Prevent HTTP Parameter Pollution
app.use(hpp());
const customRateLimitHandler = (req, res /*next*/) => {
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again after 15 minutes.",
  });
};
// app.use((req, res, next) => {
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   console.log(`IP address of incoming request: ${ip}`);
//   next();
// });


// // Middleware function to log IP address
// app.use((req, res, next) => {
//   let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   if (ip.startsWith("::ffff:")) {
//     ip = ip.replace("::ffff:", "");
//   }
  
//   console.log(`IP address of incoming request: ${ip}`);
//   next();
// });

  
  
// // Body parsing with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Routes
app.use("/api/v1/sf", verifyToken, checkAdminRole, salesForceRouter);
app.use("/api/v1/user", verifyToken, checkAdminRole, userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/accessory",  accessoryRouter);
app.use("/api/v1/order", verifyToken,checkAdminRole,  orderRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/webquote", webQuoteRouter);
app.use("/api/v1/accessory", accessoryRouter);
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
