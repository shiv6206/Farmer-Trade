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
const initiatePayment = async (transactionId, amount) => {
  // Validate transaction
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];

  if (tx.payment_status !== "PENDING") {
    throw new Error(`Cannot initiate payment. Current status: ${tx.payment_status}`);
  }

  // Generate mock Razorpay order ID
  const razorpayOrderId = `order_${uuidv4().slice(0, 14)}`;

  // Update transaction to INITIATED
  await tursoClient.execute({
    sql: "UPDATE transactions SET payment_status = 'INITIATED' WHERE id = ?",
    args: [transactionId],
  });

  return {
    transactionId,
    razorpayOrderId,
    amount,
    status: "INITIATED",
    message: "Payment initiated. Awaiting escrow hold.",
    // Mock Razorpay response
    razorpay: {
      order_id: razorpayOrderId,
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      status: "created",
    },
  };
};

/**
 * Hold payment in escrow (simulates Razorpay capture)
 */
const holdEscrow = async (transactionId) => {
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];

  if (tx.payment_status !== "INITIATED") {
    throw new Error(`Cannot hold escrow. Current status: ${tx.payment_status}`);
  }

  await tursoClient.execute({
    sql: "UPDATE transactions SET payment_status = 'ESCROW_HELD' WHERE id = ?",
    args: [transactionId],
  });

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
const releasePayment = async (transactionId) => {
  const txResult = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
    args: [transactionId],
  });

  if (txResult.rows.length === 0) {
    throw new Error("Transaction not found");
  }

  const tx = txResult.rows[0];

  if (tx.payment_status !== "ESCROW_HELD") {
    throw new Error(`Cannot release payment. Current status: ${tx.payment_status}`);
  }

  // Calculate split
  const grossAmount = tx.gross_amount;
  const logisticsCost = tx.logistics_cost;
  const handlingCost = tx.handling_cost;
  const netFpoAmount = tx.net_fpo_amount;
  const farmerShare = grossAmount - logisticsCost - handlingCost;

  // Update to PAID
  await tursoClient.execute({
    sql: "UPDATE transactions SET payment_status = 'PAID' WHERE id = ?",
    args: [transactionId],
  });

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
const getPaymentStatus = async (transactionId) => {
  const result = await tursoClient.execute({
    sql: "SELECT * FROM transactions WHERE id = ?",
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
