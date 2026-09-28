import { Router } from "express";
import { getMarketPrices, getNetRealization } from "../controllers/marketController.js";
import auth from "../middleware/auth.js";

const router = Router();
const demoPricesOnly = (req, res, next) => {
	if (process.env.NODE_ENV === "production") {
		return res.status(503).json({ message: "Verified market-price provider is not configured" });
	}
	next();
};

// @route   GET /api/market/prices
// @desc    Get market prices for district and commodity (public)
router.get("/prices", demoPricesOnly, getMarketPrices);

// @route   GET /api/market/net-realization
// @desc    Calculate net realization comparison (public)
router.get("/net-realization", demoPricesOnly, getNetRealization);

export default router;
