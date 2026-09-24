import { generateQRForLot, verifyQR } from "../services/qrService.js";

// @desc    Generate QR code for a bulk lot
// @route   POST /api/qr/generate/:bulkLotId
const generateQR = async (req, res) => {
  try {
    const { bulkLotId } = req.params;

    const result = await generateQRForLot(bulkLotId);

    res.status(200).json({
      success: true,
      message: "QR code generated successfully",
      ...result,
    });
  } catch (error) {
    console.error("Generate QR error:", error);
    res.status(500).json({ message: error.message || "Failed to generate QR code" });
  }
};

// @desc    Verify QR code for a bulk lot
// @route   GET /api/qr/verify/:bulkLotId
const verifyQRCode = async (req, res) => {
  try {
    const { bulkLotId } = req.params;

    const result = await verifyQR(bulkLotId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Verify QR error:", error);
    res.status(500).json({ message: error.message || "Failed to verify QR code" });
  }
};

export { generateQR, verifyQRCode };
