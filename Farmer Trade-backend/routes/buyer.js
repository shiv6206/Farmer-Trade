import { Router } from "express";
import { getOpenLots, getMyTransactions, getBuyerSummary } from "../controllers/buyerController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

// All buyer routes require authentication and BUYER role
router.use(auth);
router.use(roleCheck("BUYER"));

// @route   GET /api/buyer/lots
// @desc    Get all open bulk lots for bidding
router.get("/lots", getOpenLots);

// @route   GET /api/buyer/transactions
// @desc    Get buyer's transactions
router.get("/transactions", getMyTransactions);

// @route   GET /api/buyer/summary
// @desc    Get buyer summary
router.get("/summary", getBuyerSummary);

export default router;
