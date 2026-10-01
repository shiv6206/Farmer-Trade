import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { rateLimit } from "express-rate-limit";
import connectMongo from "./config/mongo.js";
import { initializeSchema } from "./config/turso.js";

// Routes
import authRoutes from "./routes/auth.js";
import farmerRoutes from "./routes/farmer.js";
import fpoRoutes from "./routes/fpo.js";
import marketRoutes from "./routes/market.js";
import recommendationRoutes from "./routes/recommendations.js";
import buyerRoutes from "./routes/buyer.js";
import logisticsRoutes from "./routes/logistics.js";
import paymentRoutes from "./routes/payments.js";
import qrRoutes from "./routes/qr.js";
import grievanceRoutes from "./routes/grievance.js";
import { initSocket } from "./services/socketService.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const frontendOrigins = (process.env.FRONTEND_URL || "https://farmer-trade-hld9.vercel.app")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const isLocalDevelopmentOrigin = process.env.NODE_ENV !== "production"
      && (origin === "null" || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
    callback(null, !origin || frontendOrigins.includes(origin.replace(/\/+$/, "")) || isLocalDevelopmentOrigin);
  },
}));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Farmer Trade Backend API" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

let vercelInitializationPromise;
if (process.env.VERCEL) {
  app.use("/api", async (_req, _res, next) => {
    try {
      vercelInitializationPromise ??= initializeDatabases();
      await vercelInitializationPromise;
      next();
    } catch (error) {
      vercelInitializationPromise = undefined;
      next(error);
    }
  });
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/fpo", fpoRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/grievance", grievanceRoutes);

// Start Server & Connect Databases
const PORT = process.env.PORT || 5500;

const validateProductionConfig = () => {
  if (process.env.NODE_ENV !== "production") return;

  const jwtSecret = process.env.JWT_SECRET || "";
  if (jwtSecret.length < 32 || /replace-with|hackathon/i.test(jwtSecret)) {
    throw new Error("Production requires a unique JWT_SECRET of at least 32 characters");
  }
  if (!process.env.FRONTEND_URL || frontendOrigins.includes("*")) {
    throw new Error("Production requires explicit FRONTEND_URL origins");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Production requires MONGO_URI for persistent bid history");
  }
  try {
    if (!new URL(process.env.MONGO_URI).pathname.replace(/^\//, "")) {
      throw new Error("Production MONGO_URI must include a database name");
    }
  } catch (error) {
    throw new Error(error.message.includes("database name")
      ? error.message
      : "Production MONGO_URI must be a valid MongoDB connection URI");
  }
  if (process.env.OTP_DEV_MODE === "true") {
    throw new Error("OTP_DEV_MODE must be disabled in production");
  }
};

const initializeDatabases = async () => {
  validateProductionConfig();

  try {
    await connectMongo();
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.error("MongoDB connection failed (continuing without it):", error.message);
  }

  await initializeSchema();
};

const startServer = async () => {
  await initializeDatabases();
  initSocket(httpServer, frontendOrigins);

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Farmer Trade Backend running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   API Base: http://localhost:${PORT}/api`);
    console.log("\n📡 Available Endpoints:");
    console.log("   POST /api/auth/send-otp");
    console.log("   POST /api/auth/verify-otp");
    console.log("   GET  /api/auth/me");
    console.log("   POST /api/farmer/lots");
    console.log("   GET  /api/farmer/lots/my-lots");
    console.log("   GET  /api/farmer/summary");
    console.log("   GET  /api/fpo/available-lots");
    console.log("   POST /api/fpo/aggregate");
    console.log("   GET  /api/fpo/bulk-lots");
    console.log("   GET  /api/market/prices");
    console.log("   GET  /api/market/net-realization");
    console.log("   GET  /api/recommendations/:bulkId");
    console.log("   GET  /api/buyer/lots");
    console.log("   POST /api/logistics/assign");
    console.log("   POST /api/payments/mock-pay");
    console.log("   POST /api/qr/generate/:bulkLotId");
    console.log("   POST /api/grievance/create\n");
    console.log("🔌 Socket.io: ws://localhost:${PORT}\n");
  });
};

export default app;

if (!process.env.VERCEL) {
  startServer().catch((error) => {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  });
}
