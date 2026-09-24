import { initiatePayment, holdEscrow, releasePayment, getPaymentStatus } from "../services/paymentService.js";

// @desc    Initiate a mock payment
// @route   POST /api/payments/mock-pay
const mockPayHandler = async (req, res) => {
  try {
    const { transactionId, amount } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({ message: "transactionId and amount are required" });
    }

    const result = await initiatePayment(transactionId, amount);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Mock pay error:", error);
    res.status(500).json({ message: error.message || "Payment initiation failed" });
  }
};

// @desc    Hold payment in escrow
// @route   POST /api/payments/hold-escrow
const holdEscrowHandler = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" });
    }

    const result = await holdEscrow(transactionId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Hold escrow error:", error);
    res.status(500).json({ message: error.message || "Failed to hold escrow" });
  }
};

// @desc    Release payment (mark as PAID)
// @route   POST /api/payments/release
const releasePaymentHandler = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "transactionId is required" });
    }

    const result = await releasePayment(transactionId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Release payment error:", error);
    res.status(500).json({ message: error.message || "Failed to release payment" });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:transactionId
const getStatusHandler = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await getPaymentStatus(transactionId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ message: error.message || "Failed to get payment status" });
  }
};

export { mockPayHandler, holdEscrowHandler, releasePaymentHandler, getStatusHandler };
