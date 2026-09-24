import tursoClient from "../config/turso.js";
import { generateRecommendations } from "../services/recommendationEngine.js";

// @desc    Get recommendations for a bulk lot
// @route   GET /api/recommendations/:bulkId
const getRecommendations = async (req, res) => {
  try {
    const { bulkId } = req.params;

    // Fetch the bulk lot from Turso
    const result = await tursoClient.execute({
      sql: "SELECT * FROM fpo_bulk_lots WHERE id = ?",
      args: [bulkId],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bulk lot not found" });
    }

    const bulkLot = result.rows[0];

    // Fetch any bids for this lot from MongoDB (if available)
    let buyerOffers = [];
    try {
      const BidLog = (await import("../models/mongo/BidLog.js")).default;
      const bids = await BidLog.find({ bulkLotId: bulkId })
        .sort({ bidAmount: -1 })
        .limit(10);

      if (bids.length > 0) {
        buyerOffers = bids.map((bid) => ({
          buyerName: bid.buyerName,
          buyerId: bid.buyerId,
          pricePerQtl: bid.bidAmount,
          netPricePerQtl: bid.bidAmount - 130, // Assume standard deductions
          totalDeductions: 130 * bulkLot.total_quantity,
          paymentDays: 1,
          deliveryDays: 2,
          distanceKm: 50,
          buyerTrustScore: 85,
        }));
      }
    } catch (err) {
      // MongoDB not available, use default offers
      console.log("Using default offers (MongoDB not available)");
    }

    const recommendations = generateRecommendations(bulkLot, buyerOffers);

    res.status(200).json({
      success: true,
      ...recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
};

export { getRecommendations };
