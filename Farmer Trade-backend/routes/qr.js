import { Router } from "express";
import { generateQR, verifyQRCode } from "../controllers/qrController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

// @route   POST /api/qr/generate/:bulkLotId
// @desc    Generate QR code for a bulk lot (FPO only)
router.post("/generate/:bulkLotId", auth, roleCheck("FPO"), generateQR);

// @route   GET /api/qr/verify/:bulkLotId
// @desc    Verify QR code (any authenticated user)
router.get("/verify/:bulkLotId", auth, verifyQRCode);

export default router;
