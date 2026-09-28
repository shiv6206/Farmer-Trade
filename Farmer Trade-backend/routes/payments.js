import { Router } from "express";
import { mockPayHandler, holdEscrowHandler, releasePaymentHandler, getStatusHandler } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();
const mockPaymentsOnly = (req, res, next) => {
	if (process.env.NODE_ENV === "production") {
		return res.status(503).json({ message: "Payment provider integration is not configured" });
	}
	next();
};

// @route   POST /api/payments/mock-pay
// @desc    Initiate mock payment (BUYER only)
router.post("/mock-pay", mockPaymentsOnly, auth, roleCheck("BUYER"), mockPayHandler);

// @route   POST /api/payments/hold-escrow
// @desc    Hold payment in escrow (system/admin)
router.post("/hold-escrow", mockPaymentsOnly, auth, roleCheck("FPO"), holdEscrowHandler);

// @route   POST /api/payments/release
// @desc    Release payment after delivery (system/FPO)
router.post("/release", mockPaymentsOnly, auth, roleCheck("FPO"), releasePaymentHandler);

// @route   GET /api/payments/status/:transactionId
// @desc    Get payment status (any authenticated user)
router.get("/status/:transactionId", auth, getStatusHandler);

export default router;
