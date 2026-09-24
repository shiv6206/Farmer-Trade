import { Router } from "express";
import { getMarketPrices, getNetRealization } from "../controllers/marketController.js";
import auth from "../middleware/auth.js";

const router = Router();

// @route   GET /api/market/prices
// @desc    Get market prices for district and commodity (public)
router.get("/prices", getMarketPrices);

// @route   GET /api/market/net-realization
// @desc    Calculate net realization comparison (public)
router.get("/net-realization", getNetRealization);

export default router;
