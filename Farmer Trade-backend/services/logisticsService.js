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
const assignTransporter = async (transactionId, transporterId, pickupTime, fpoId) => {
  const txResult = await tursoClient.execute({
    sql: `SELECT t.*, fbl.fpo_id
          FROM transactions t
          LEFT JOIN fpo_bulk_lots fbl ON t.bulk_lot_id = fbl.id
          WHERE t.id = ?`,
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];
  if (tx.fpo_id !== fpoId) throw Object.assign(new Error("Access denied"), { statusCode: 403 });

  if (tx.delivery_status !== "SCHEDULED") {
    throw new Error(`Cannot assign transporter. Current status: ${tx.delivery_status}`);
  }

  const transporterResult = await tursoClient.execute({
    sql: "SELECT id FROM users WHERE id = ? AND role = 'TRANSPORTER'",
    args: [transporterId],
  });
  if (!transporterResult.rows.length) throw new Error("Transporter not found");

  const update = await tursoClient.execute({
    sql: "UPDATE transactions SET transporter_id = ? WHERE id = ? AND delivery_status = 'SCHEDULED' AND transporter_id IS NULL",
    args: [transporterId, transactionId],
  });
  if (!update.rowsAffected) throw new Error("Transporter is already assigned");

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
const updateDeliveryStatus = async (transactionId, newStatus, transporterId) => {
  // Validate transaction exists
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];
  if (tx.transporter_id !== transporterId) throw Object.assign(new Error("Access denied"), { statusCode: 403 });
  const currentStatus = tx.delivery_status;

  // Validate state transition
  const allowedTransitions = STATE_MACHINE[currentStatus];
  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}. Allowed: ${allowedTransitions.join(", ") || "none (terminal state)"}`
    );
  }

  // Update status
  const update = await tursoClient.execute({
    sql: "UPDATE transactions SET delivery_status = ? WHERE id = ? AND delivery_status = ? AND transporter_id = ?",
    args: [newStatus, transactionId, currentStatus, transporterId],
  });
  if (!update.rowsAffected) throw new Error("Delivery status changed; reload and retry");

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
const getDeliveryStatus = async (transactionId, userId) => {
  const result = await tursoClient.execute({
        sql: `SELECT t.*, fbl.fpo_id, u.name as transporter_name, u.phone as transporter_phone
          FROM transactions t
          LEFT JOIN fpo_bulk_lots fbl ON t.bulk_lot_id = fbl.id
          LEFT JOIN users u ON t.transporter_id = u.id
          WHERE t.id = ?`,
    args: [transactionId],
  });

  if (result.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = result.rows[0];
  if (![tx.buyer_id, tx.transporter_id, tx.fpo_id].includes(userId)) {
    throw Object.assign(new Error("Access denied"), { statusCode: 403 });
  }

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
