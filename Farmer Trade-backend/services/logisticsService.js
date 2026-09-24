/**
 * Logistics Service
 * 
 * Delivery state machine for tracking lot movement:
 * SCHEDULED → PICKED_UP → DELIVERED
 * 
 * Each state transition is logged with timestamp.
 */

import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

// Valid state transitions
const STATE_MACHINE = {
  SCHEDULED: ["PICKED_UP"],
  PICKED_UP: ["DELIVERED"],
  DELIVERED: [], // Terminal state
};

/**
 * Assign a transporter to a transaction
 */
const assignTransporter = async (transactionId, transporterId, pickupTime) => {
  // Validate transaction exists
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];

  if (tx.delivery_status !== "SCHEDULED") {
    throw new Error(`Cannot assign transporter. Current status: ${tx.delivery_status}`);
  }

  // Update transaction with transporter
  await tursoClient.execute({
    sql: "UPDATE transactions SET transporter_id = ?, delivery_status = 'SCHEDULED' WHERE id = ?",
    args: [transporterId, transactionId],
  });

  return {
    transactionId,
    transporterId,
    pickupTime,
    status: "SCHEDULED",
    message: "Transporter assigned. Awaiting pickup.",
  };
};

/**
 * Update delivery status (state machine)
 */
const updateDeliveryStatus = async (transactionId, newStatus) => {
  // Validate transaction exists
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];
  const currentStatus = tx.delivery_status;

  // Validate state transition
  const allowedTransitions = STATE_MACHINE[currentStatus];
  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}. Allowed: ${allowedTransitions.join(", ") || "none (terminal state)"}`
    );
  }

  // Update status
  await tursoClient.execute({
    sql: "UPDATE transactions SET delivery_status = ? WHERE id = ?",
    args: [newStatus, transactionId],
  });

  return {
    transactionId,
    previousStatus: currentStatus,
    newStatus,
    updatedAt: new Date().toISOString(),
    message: `Delivery status updated: ${currentStatus} → ${newStatus}`,
  };
};

/**
 * Get delivery status for a transaction
 */
const getDeliveryStatus = async (transactionId) => {
  const result = await tursoClient.execute({
    sql: `SELECT t.*, u.name as transporter_name, u.phone as transporter_phone
          FROM transactions t
          LEFT JOIN users u ON t.transporter_id = u.id
          WHERE t.id = ?`,
    args: [transactionId],
  });

  if (result.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = result.rows[0];

  return {
    transactionId: tx.id,
    bulkLotId: tx.bulk_lot_id,
    buyerId: tx.buyer_id,
    transporter: {
      id: tx.transporter_id,
      name: tx.transporter_name,
      phone: tx.transporter_phone,
    },
    deliveryStatus: tx.delivery_status,
    paymentStatus: tx.payment_status,
    createdAt: tx.created_at,
  };
};

export { assignTransporter, updateDeliveryStatus, getDeliveryStatus };
