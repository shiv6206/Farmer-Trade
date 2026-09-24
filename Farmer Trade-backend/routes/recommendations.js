import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationController.js";
import auth from "../middleware/auth.js";

const router = Router();

// @route   GET /api/recommendations/:bulkId
// @desc    Get ranked recommendations for a bulk lot
router.get("/:bulkId", auth, getRecommendations);

export default router;
