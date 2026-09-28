/**
 * Payment Service
 * 
 * Razorpay sandbox mock for hackathon demo.
 * Payment flow: PENDING → INITIATED → ESCROW_HELD → PAID
 * 
 * In production, this would use real Razorpay API.
 * For demo, we simulate the entire flow.
 */

import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

// Valid payment state transitions
const PAYMENT_STATE_MACHINE = {
  PENDING: ["INITIATED"],
  INITIATED: ["ESCROW_HELD", "PENDING"], // Can retry or hold
  ESCROW_HELD: ["PAID", "OVERDUE"],
  PAID: [], // Terminal state
  OVERDUE: ["PENDING"], // Can retry
};

/**
 * Initiate a mock payment
 */
const getTransaction = async (transactionId) => {
  const txResult = await tursoClient.execute({
    sql: `SELECT t.*, fbl.fpo_id
          FROM transactions t
          LEFT JOIN fpo_bulk_lots fbl ON t.bulk_lot_id = fbl.id
          WHERE t.id = ?`,
    args: [transactionId],
  });

  if (!txResult.rows.length) throw Object.assign(new Error("Transaction not found"), { statusCode: 404 });
  return txResult.rows[0];
};

const requireFpoOwner = (tx, userId) => {
  if (tx.fpo_id !== userId) throw Object.assign(new Error("Access denied"), { statusCode: 403 });
};

const requireParticipant = (tx, userId) => {
  if (![tx.buyer_id, tx.transporter_id, tx.fpo_id].includes(userId)) {
    throw Object.assign(new Error("Access denied"), { statusCode: 403 });
  }
};

const updatePaymentStatus = async (transactionId, currentStatus, nextStatus) => {
  const result = await tursoClient.execute({
    sql: "UPDATE transactions SET payment_status = ? WHERE id = ? AND payment_status = ?",
    args: [nextStatus, transactionId, currentStatus],
  });
  if (!result.rowsAffected) throw Object.assign(new Error("Payment status changed; reload and retry"), { statusCode: 409 });
};

const initiatePayment = async (transactionId, buyerId) => {
  const tx = await getTransaction(transactionId);
  if (tx.buyer_id !== buyerId) throw Object.assign(new Error("Access denied"), { statusCode: 403 });

  if (tx.payment_status !== "PENDING") {
    throw Object.assign(new Error(`Cannot initiate payment. Current status: ${tx.payment_status}`), { statusCode: 409 });
  }

  // Generate mock Razorpay order ID
  const razorpayOrderId = `order_${uuidv4().slice(0, 14)}`;

  // Update transaction to INITIATED
  await updatePaymentStatus(transactionId, "PENDING", "INITIATED");

  return {
    transactionId,
    razorpayOrderId,
    amount: tx.gross_amount,
    status: "INITIATED",
    message: "Payment initiated. Awaiting escrow hold.",
    // Mock Razorpay response
    razorpay: {
      order_id: razorpayOrderId,
      amount: tx.gross_amount * 100, // Razorpay uses paise
      currency: "INR",
      status: "created",
    },
  };
};

/**
 * Hold payment in escrow (simulates Razorpay capture)
 */
const holdEscrow = async (transactionId, fpoId) => {
  const tx = await getTransaction(transactionId);
  requireFpoOwner(tx, fpoId);

  if (tx.payment_status !== "INITIATED") {
    throw Object.assign(new Error(`Cannot hold escrow. Current status: ${tx.payment_status}`), { statusCode: 409 });
  }

  await updatePaymentStatus(transactionId, "INITIATED", "ESCROW_HELD");

  return {
    transactionId,
    status: "ESCROW_HELD",
    grossAmount: tx.gross_amount,
    message: "Payment held in escrow. Will be released after delivery confirmation.",
  };
};

/**
 * Release payment (mark as PAID)
 * Splits: logistics_cost to transporter, handling_cost to FPO, rest to farmers
 */
const releasePayment = async (transactionId, fpoId) => {
  const tx = await getTransaction(transactionId);
  requireFpoOwner(tx, fpoId);

  if (tx.payment_status !== "ESCROW_HELD") {
    throw Object.assign(new Error(`Cannot release payment. Current status: ${tx.payment_status}`), { statusCode: 409 });
  }
  if (tx.delivery_status !== "DELIVERED") {
    throw Object.assign(new Error("Payment cannot be released before delivery is confirmed"), { statusCode: 409 });
  }

  // Calculate split
  const grossAmount = tx.gross_amount;
  const logisticsCost = tx.logistics_cost;
  const handlingCost = tx.handling_cost;
  const netFpoAmount = tx.net_fpo_amount;
  const farmerShare = grossAmount - logisticsCost - handlingCost;

  // Update to PAID
  await updatePaymentStatus(transactionId, "ESCROW_HELD", "PAID");

  return {
    transactionId,
    status: "PAID",
    split: {
      grossAmount,
      logisticsCost: `₹${logisticsCost} → Transporter`,
      handlingCost: `₹${handlingCost} → FPO`,
      farmerShare: `₹${farmerShare} → Farmers (split proportionally)`,
      netFpoAmount: `₹${netFpoAmount} → FPO account`,
    },
    paidAt: new Date().toISOString(),
    message: "Payment released! Farmers will receive share within 24 hours.",
  };
};

/**
 * Get payment status
 */
const getPaymentStatus = async (transactionId, userId) => {
  const tx = await getTransaction(transactionId);
  requireParticipant(tx, userId);

  return {
    transactionId: tx.id,
    bulkLotId: tx.bulk_lot_id,
    buyerId: tx.buyer_id,
    grossAmount: tx.gross_amount,
    logisticsCost: tx.logistics_cost,
    handlingCost: tx.handling_cost,
    netFpoAmount: tx.net_fpo_amount,
    farmerShare: tx.gross_amount - tx.logistics_cost - tx.handling_cost,
    paymentStatus: tx.payment_status,
    deliveryStatus: tx.delivery_status,
    createdAt: tx.created_at,
  };
};

export { initiatePayment, holdEscrow, releasePayment, getPaymentStatus };
