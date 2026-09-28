import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import auth from "../middleware/auth.js";

const router = Router();
const realOffersOnly = (req, res, next) => {
	if (process.env.NODE_ENV === "production") {
		return res.status(503).json({ message: "Verified offer and market data are not configured" });
	}
	next();
};

// @route   GET /api/recommendations/:bulkId
// @desc    Get ranked recommendations for a bulk lot
router.get("/:bulkId", realOffersOnly, auth, getRecommendations);

export default router;
