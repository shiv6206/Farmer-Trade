import { Router } from "express";
import { assignTransporterHandler, updateStatusHandler, getStatusHandler } from "../controllers/logisticsController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

// @route   POST /api/logistics/assign
// @desc    Assign transporter to transaction (FPO or TRANSPORTER only)
router.post("/assign", auth, roleCheck("FPO", "TRANSPORTER"), assignTransporterHandler);

// @route   PATCH /api/logistics/status
// @desc    Update delivery status (TRANSPORTER only)
router.patch("/status", auth, roleCheck("TRANSPORTER"), updateStatusHandler);

// @route   GET /api/logistics/status/:transactionId
// @desc    Get delivery status (any authenticated user)
router.get("/status/:transactionId", auth, getStatusHandler);

export default router;
