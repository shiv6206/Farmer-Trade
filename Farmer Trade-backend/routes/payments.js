import { Router } from "express";
import { mockPayHandler, holdEscrowHandler, releasePaymentHandler, getStatusHandler } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

// @route   POST /api/payments/mock-pay
// @desc    Initiate mock payment (BUYER only)
router.post("/mock-pay", auth, roleCheck("BUYER"), mockPayHandler);

// @route   POST /api/payments/hold-escrow
// @desc    Hold payment in escrow (system/admin)
router.post("/hold-escrow", auth, holdEscrowHandler);

// @route   POST /api/payments/release
// @desc    Release payment after delivery (system/FPO)
router.post("/release", auth, roleCheck("FPO"), releasePaymentHandler);

// @route   GET /api/payments/status/:transactionId
// @desc    Get payment status (any authenticated user)
router.get("/status/:transactionId", auth, getStatusHandler);

export default router;
