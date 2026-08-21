import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js"; // Database connection
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import paymentRoutes from "./routes/payment.js";

const app = express();

// Connect to MongoDB
connectDB();

// Security Headers
app.use(helmet());

// Dynamic Cross-Origin Resource Sharing
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl or postman) or local development
    if (!origin || origin.includes("localhost")) {
      return callback(null, true);
    }

    // Allow configured CLIENT_URL or ANY Vercel deployment domain (*.vercel.app)
    if (origin === process.env.CLIENT_URL || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Blocked by CORS policy"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS globally (handles both standard requests AND preflight OPTIONS)
app.use(cors(corsOptions));

// Logging Middleware
app.use(morgan("dev"));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route & Health Checks
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Mock Interview API Running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server Healthy",
  });
});

// API Routes (Mounted for both singular and plural paths to match frontend calls)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/payment", paymentRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;