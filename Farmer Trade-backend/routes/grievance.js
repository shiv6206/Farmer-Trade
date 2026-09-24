import { Router } from "express";
import { createGrievance, getGrievances } from "../controllers/grievanceController.js";
import auth from "../middleware/auth.js";

const router = Router();

// @route   POST /api/grievance/create
// @desc    Create a grievance (any authenticated user)
router.post("/create", auth, createGrievance);

// @route   GET /api/grievance/:transactionId
// @desc    Get grievances for a transaction
router.get("/:transactionId", auth, getGrievances);

export default router;
