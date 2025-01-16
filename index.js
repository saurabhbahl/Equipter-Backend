// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";
// // connection
// import { connection } from "./config/dbConnection.cjs";

// // middlewares
// import { checkAdminRole, verifyToken } from "./middlewares/verifyToken.js";

// // routes
// import salesForceRouter from "./routes/salesForce.routes.js";
// import adminRouter from "./routes/admin.routes.js";
// import authRouter from "./routes/auth.routes.js";
// import userRouter from "./routes/user.routes.js";
// import productRouter from "./routes/product.routes.js";
// import accessoryRouter from "./routes/accessory.routes.js";
// import webQuoteRouter from "./routes/webQuote.routes.js";
// import stateRouter from "./routes/state.routes.js";
// import rateLimit from "express-rate-limit";

// dotenv.config();
// const PORT = process.env.PORT || 3000;
// const app = express();

// // using middlewares
// app.use(morgan("dev"));

// // CORS configuration
// const allowedOrigins =  process.env.NODE_ENV === "production"    ? [process.env.FRONTEND_URL]    : [
//         "http://localhost:4173",
//         "http://localhost:5173",
//         "http://192.168.152.1:5173",
//       ];
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
// // Helmet configuration
// app.use(helmet())
// app.use(helmet.hidePoweredBy()); // Hide the X-Powered-By header
// app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
// app.use(helmet.xssFilter()); // Enable XSS protection
// app.use(helmet.noSniff()); // Prevent MIME type sniffing
// app.use(helmet.ieNoOpen()); // Prevent IE from executing downloads in your site's context

// // rate limiting

// const apiLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 15 minutes
//   max: 6, // Limit each IP to 100 requests per window
//   standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false,
//   message: 'Too many requests from this IP, please try again later.',
// });

// app.use('/api/', apiLimiter);

// app.use(express.json());

// // Routes
// app.use("/api/v1/sf", verifyToken, checkAdminRole, salesForceRouter);
// app.use("/api/v1/user", verifyToken, checkAdminRole, userRouter);
// app.use("/api/v1/product", productRouter);
// app.use("/api/v1/state", stateRouter);
// app.use("/api/v1/webquote", webQuoteRouter);
// app.use("/api/v1/accessory",  accessoryRouter);
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/admin", adminRouter);

// app.get("/api/test", (req, res) => {
//   res.json({ message: "👍✅" });
// });

// // Invalid route handling
// app.all("/api/*", async (req, res) => {
//   return res.json({ success: false, data: "Invalid Route" });
// });

// // Global error handler
// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message =
//     process.env.NODE_ENV === "production"
//       ? "Internal Server Error"
//       : error.message;
//   res.status(status).json({ message });
// });

// // Connect to the database and start the server
// connection.connect((err, client, release) => {
//   if (err) {
//     console.error("Error connecting to the database:=>", err, err.stack);
//   } else {
//     console.log("Connected to database successfully");
//     app.listen(PORT, () => {
//       console.log(`Server running on http://${client.host}:${PORT}`);
//     });
//   }
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import compression from "compression";
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
import webQuoteRouter from "./routes/webQuote.routes.js";
import stateRouter from "./routes/state.routes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Use compression middleware
// app.use(compression());

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
              // Add other directives as needed
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
  console.log('Request coming from IP:', req.ip);  
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

// // Rate limiting
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // each IP to 100 requests per window
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: customRateLimitHandler,
// });

// // Specific rate limiting for auth routes
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // Limit each IP to 10 requests per window
//   message: "Too many login attempts from this IP, please try again later.",
// });
// app.use("/api/v1/auth", authLimiter, authRouter);

// // Body parsing with size limits
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ limit: "10kb", extended: true }));

// app.use("/api/*", generalLimiter);
// Routes
app.use("/api/v1/sf", verifyToken, checkAdminRole, salesForceRouter);
app.use("/api/v1/user", verifyToken, checkAdminRole, userRouter);
app.use("/api/v1/product", productRouter);
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
