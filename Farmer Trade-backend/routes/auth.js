import { Router } from "express";
import { sendOTP, verifyOTPHandler, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { rateLimit } from "express-rate-limit";

const router = Router();
const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: { message: "Too many authentication attempts. Try again later." },
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
router.post("/send-otp", authRateLimit, sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register
router.post("/verify-otp", authRateLimit, verifyOTPHandler);

// @route   GET /api/auth/me
// @desc    Get current user profile (protected)
router.get("/me", auth, getMe);

export default router;
