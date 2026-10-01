import { generateOTP, storeOTP, verifyOTP } from "../services/otpService.js";

import { createOrUpdateUser, findUserByPhone, generateToken, getUserById } from "../services/authService.js";

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate Indian phone number format
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid Indian phone number" });
    }

    if (process.env.NODE_ENV === "production" || process.env.OTP_DEV_MODE !== "true") {
      return res.status(503).json({ message: "OTP delivery is not configured" });
    }

    const otp = generateOTP();
    await storeOTP(phone, otp);
    console.log(`[OTP DEV] ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "Development OTP generated",
      otp,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// @desc    Verify OTP and login/register
// @route   POST /api/auth/verify-otp
const verifyOTPHandler = async (req, res) => {
  try {
    const { phone, otp, role, district, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    // Verify OTP
    const otpResult = await verifyOTP(phone, otp);
    if (!otpResult.success) {
      return res.status(400).json({ message: otpResult.message });
    }

    const existingUser = await findUserByPhone(phone);

    if (!existingUser && (!name || !role || !district)) {
      return res.status(400).json({
        message: "Name, role, and district are required for registration",
      });
    }

    if (!existingUser && !["FARMER", "BUYER"].includes(role)) {
      return res.status(400).json({ message: "New accounts can register only as FARMER or BUYER" });
    }

    // Create or update user
    const user = await createOrUpdateUser({ phone, name, role, district });

    // Generate JWT
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        district: user.district,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        district: user.district,
        state: user.state,
        is_verified: user.is_verified,
        trust_score: user.trust_score,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export { sendOTP, verifyOTPHandler, getMe };
