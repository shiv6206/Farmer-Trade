import { assignTransporter, updateDeliveryStatus, getDeliveryStatus } from "../services/logisticsService.js";

// @desc    Assign transporter to a transaction
// @route   POST /api/logistics/assign
const assignTransporterHandler = async (req, res) => {
  try {
    const { transactionId, transporterId, pickupTime } = req.body;

    if (!transactionId || !transporterId) {
      return res.status(400).json({ message: "transactionId and transporterId are required" });
    }

    const result = await assignTransporter(transactionId, transporterId, pickupTime);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Assign transporter error:", error);
    res.status(500).json({ message: error.message || "Failed to assign transporter" });
  }
};

// @desc    Update delivery status
// @route   PATCH /api/logistics/status
const updateStatusHandler = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    if (!transactionId || !status) {
      return res.status(400).json({ message: "transactionId and status are required" });
    }

    const validStatuses = ["PICKED_UP", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be: ${validStatuses.join(", ")}` });
    }

    const result = await updateDeliveryStatus(transactionId, status);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: error.message || "Failed to update status" });
  }
};

// @desc    Get delivery status
// @route   GET /api/logistics/status/:transactionId
const getStatusHandler = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await getDeliveryStatus(transactionId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get status error:", error);
    res.status(500).json({ message: error.message || "Failed to get delivery status" });
  }
};

export { assignTransporterHandler, updateStatusHandler, getStatusHandler };
