import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
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

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Farmer Trade Backend API" });
});

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
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect databases - continue even if one fails
  try {
    await connectMongo();
  } catch (error) {
    console.error("MongoDB connection failed (continuing without it):", error.message);
  }

  try {
    await initializeSchema();
  } catch (error) {
    console.error("Turso schema init failed (continuing without it):", error.message);
  }

  // Initialize Socket.io
  initSocket(httpServer);

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

startServer();
