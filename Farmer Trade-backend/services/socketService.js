/**
 * Socket.io Real-Time Bidding Service
 * 
 * Room-based bidding where buyers join a lot room and place bids.
 * FPO can accept/reject deals in real-time.
 * 
 * Events:
 *   Client → Server: join_lot_room, place_bid, fpo_accept_deal
 *   Server → Client: bid_updated, deal_accepted, deal_rejected, error
 */

import { Server } from "socket.io";
import BidLog from "../models/mongo/BidLog.js";
import tursoClient from "../config/turso.js";
import { getUserById, verifyToken } from "./authService.js";

let io;

const initSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Authentication required");
      const decoded = verifyToken(token);
      const user = await getUserById(decoded.id);
      if (!user) throw new Error("Authentication required");
      socket.data.user = { id: user.id, name: user.name, role: user.role };
      next();
    } catch {
      next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a bidding room for a specific bulk lot
    socket.on("join_lot_room", async (data = {}) => {
      const { bulkLotId } = data;
      const { id: userId, name: userName, role } = socket.data.user;

      if (typeof bulkLotId !== "string" || !bulkLotId) {
        return socket.emit("error", { message: "bulkLotId is required" });
      }

      try {
        const result = await tursoClient.execute({
          sql: "SELECT id, fpo_id, status FROM fpo_bulk_lots WHERE id = ?",
          args: [bulkLotId],
        });
        const lot = result.rows[0];
        if (!lot || lot.status !== "OPEN_FOR_BIDS" || !["BUYER", "FPO"].includes(role)) {
          return socket.emit("error", { message: "Lot is unavailable" });
        }
        if (role === "FPO" && lot.fpo_id !== userId) {
          return socket.emit("error", { message: "Access denied" });
        }
      } catch {
        return socket.emit("error", { message: "Unable to join lot room" });
      }

      socket.join(`lot_${bulkLotId}`);
      socket.data.joinedLotId = bulkLotId;

      console.log(`👤 ${userName} (${role}) joined lot room: ${bulkLotId}`);

      // Notify others in the room
      socket.to(`lot_${bulkLotId}`).emit("user_joined", {
        userId,
        userName,
        role,
        message: `${userName} joined the bidding room`,
      });

      // Send current room info to joiner
      socket.emit("room_joined", {
        bulkLotId,
        message: `You joined bidding room for lot ${bulkLotId.slice(0, 8)}...`,
      });
    });

    // Place a bid
    socket.on("place_bid", async (data = {}) => {
      const { bulkLotId, bidAmount } = data;
      const { id: buyerId, name: buyerName, role } = socket.data.user;

      if (role !== "BUYER" || bulkLotId !== socket.data.joinedLotId) {
        return socket.emit("error", { message: "Not authorized to bid in this lot" });
      }
      if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
        return socket.emit("error", { message: "bidAmount must be a positive number" });
      }

      try {
        const lotResult = await tursoClient.execute({
          sql: "SELECT reserve_price, status FROM fpo_bulk_lots WHERE id = ?",
          args: [bulkLotId],
        });
        const lot = lotResult.rows[0];
        if (!lot || lot.status !== "OPEN_FOR_BIDS" || bidAmount < lot.reserve_price) {
          return socket.emit("error", { message: "Bid is below reserve or lot is closed" });
        }

        // Save bid to MongoDB
        const bidLog = new BidLog({
          bulkLotId,
          buyerId,
          buyerName,
          bidAmount,
        });
        await bidLog.save();

        // Broadcast bid to everyone in the room
        io.to(`lot_${bulkLotId}`).emit("bid_updated", {
          bidId: bidLog._id,
          bulkLotId,
          buyerId,
          buyerName,
          bidAmount,
          timestamp: bidLog.timestamp,
          message: `New bid: ₹${bidAmount}/quintal by ${buyerName}`,
        });

        console.log(`💰 Bid placed: ₹${bidAmount}/qtl by ${buyerName} on lot ${bulkLotId.slice(0, 8)}`);
      } catch (error) {
        console.error("Place bid error:", error);
        socket.emit("error", { message: "Failed to place bid" });
      }
    });

    // FPO accepts a deal
    socket.on("fpo_accept_deal", async (data = {}) => {
      const { bulkLotId, buyerId } = data;
      const { id: fpoId, role } = socket.data.user;

      if (role !== "FPO" || bulkLotId !== socket.data.joinedLotId || !buyerId) {
        return socket.emit("error", { message: "Not authorized to accept this deal" });
      }

      try {
        const lotResult = await tursoClient.execute({
          sql: "SELECT fpo_id, status FROM fpo_bulk_lots WHERE id = ?",
          args: [bulkLotId],
        });
        const lot = lotResult.rows[0];
        if (!lot || lot.fpo_id !== fpoId || lot.status !== "OPEN_FOR_BIDS") {
          return socket.emit("error", { message: "Lot is unavailable" });
        }
        const bid = await BidLog.findOne({ bulkLotId, buyerId }).sort({ bidAmount: -1 });
        if (!bid) return socket.emit("error", { message: "Bid not found" });

        const update = await tursoClient.execute({
          sql: "UPDATE fpo_bulk_lots SET status = 'MATCHED' WHERE id = ? AND fpo_id = ? AND status = 'OPEN_FOR_BIDS'",
          args: [bulkLotId, fpoId],
        });
        if (!update.rowsAffected) return socket.emit("error", { message: "Lot is no longer open" });

        io.to(`lot_${bulkLotId}`).emit("deal_accepted", {
          bulkLotId,
          fpoId,
          buyerId,
          buyerName: bid.buyerName,
          finalPrice: bid.bidAmount,
        });
      } catch {
        socket.emit("error", { message: "Failed to accept deal" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      const { name: userName } = socket.data.user || {};
      const { joinedLotId } = socket.data;
      if (userName && joinedLotId) {
        socket.to(`lot_${joinedLotId}`).emit("user_left", {
          userName,
          message: `${userName} left the bidding room`,
        });
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  console.log("🔌 Socket.io initialized");
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export { initSocket, getIO };
