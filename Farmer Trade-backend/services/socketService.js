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

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a bidding room for a specific bulk lot
    socket.on("join_lot_room", (data) => {
      const { bulkLotId, userId, userName, role } = data;

      if (!bulkLotId || !userId) {
        return socket.emit("error", { message: "bulkLotId and userId required" });
      }

      // Join the room
      socket.join(`lot_${bulkLotId}`);
      socket.data = { bulkLotId, userId, userName, role };

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
    socket.on("place_bid", async (data) => {
      const { bulkLotId, buyerId, buyerName, bidAmount } = data;

      if (!bulkLotId || !buyerId || !bidAmount) {
        return socket.emit("error", { message: "bulkLotId, buyerId, and bidAmount required" });
      }

      try {
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
    socket.on("fpo_accept_deal", (data) => {
      const { bulkLotId, fpoId, buyerId, buyerName, finalPrice } = data;

      if (!bulkLotId || !fpoId || !buyerId) {
        return socket.emit("error", { message: "bulkLotId, fpoId, and buyerId required" });
      }

      // Broadcast deal accepted to everyone in the room
      io.to(`lot_${bulkLotId}`).emit("deal_accepted", {
        bulkLotId,
        fpoId,
        buyerId,
        buyerName,
        finalPrice,
        message: `Deal accepted! ${buyerName} won the lot at ₹${finalPrice}/quintal`,
      });

      console.log(`✅ Deal accepted: lot ${bulkLotId.slice(0, 8)} → ${buyerName} at ₹${finalPrice}/qtl`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      const { userName, bulkLotId } = socket.data || {};
      if (userName && bulkLotId) {
        socket.to(`lot_${bulkLotId}`).emit("user_left", {
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
