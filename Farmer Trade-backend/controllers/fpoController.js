import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Get available farmer lots for aggregation
// @route   GET /api/fpo/available-lots
const getAvailableLots = async (req, res) => {
  try {
    const { district, commodity } = req.query;

    let sql = `SELECT fl.*, u.name as farmer_name, u.phone as farmer_phone 
               FROM farmer_lots fl 
               JOIN users u ON fl.farmer_id = u.id 
               WHERE fl.status = 'LISTED'`;
    const args = [];

    if (district) {
      sql += " AND u.district = ?";
      args.push(district);
    }

    if (commodity) {
      sql += " AND fl.commodity = ?";
      args.push(commodity);
    }

    sql += " ORDER BY fl.created_at DESC";

    const result = await tursoClient.execute({ sql, args });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      lots: result.rows,
    });
  } catch (error) {
    console.error("Get available lots error:", error);
    res.status(500).json({ message: "Failed to fetch available lots" });
  }
};

// @desc    Aggregate farmer lots into a bulk lot
// @route   POST /api/fpo/aggregate
const aggregateLots = async (req, res) => {
  try {
    const { farmerLotIds, reservePrice, pickupLocation, qualityGrade } = req.body;

    if (!farmerLotIds || farmerLotIds.length === 0) {
      return res.status(400).json({ message: "farmerLotIds array is required" });
    }

    if (!reservePrice || !pickupLocation || !qualityGrade) {
      return res.status(400).json({
        message: "reservePrice, pickupLocation, and qualityGrade are required",
      });
    }

    // Fetch all farmer lots to validate they exist and are LISTED
    const placeholders = farmerLotIds.map(() => "?").join(",");
    const lotsResult = await tursoClient.execute({
      sql: `SELECT * FROM farmer_lots WHERE id IN (${placeholders}) AND status = 'LISTED'`,
      args: farmerLotIds,
    });

    if (lotsResult.rows.length !== farmerLotIds.length) {
      return res.status(400).json({
        message: "Some lots are not available or don't exist",
      });
    }

    const lots = lotsResult.rows;

    // All lots must be the same commodity and variety
    const commodity = lots[0].commodity;
    const variety = lots[0].variety;

    const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity_quintals, 0);

    // Create the bulk lot
    const bulkLotId = uuidv4();
    await tursoClient.execute({
      sql: `INSERT INTO fpo_bulk_lots (id, fpo_id, commodity, variety, total_quantity, quality_grade, reserve_price, pickup_location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        bulkLotId,
        req.user.id,
        commodity,
        variety,
        totalQuantity,
        qualityGrade,
        reservePrice,
        pickupLocation,
      ],
    });

    // Create mapping entries and update lot statuses
    for (const lotId of farmerLotIds) {
      await tursoClient.execute({
        sql: "INSERT INTO fpo_lot_mappings (bulk_lot_id, farmer_lot_id) VALUES (?, ?)",
        args: [bulkLotId, lotId],
      });

      await tursoClient.execute({
        sql: "UPDATE farmer_lots SET status = 'AGGREGATED' WHERE id = ?",
        args: [lotId],
      });
    }

    res.status(201).json({
      success: true,
      message: "Lots aggregated into bulk lot successfully",
      bulkLot: {
        id: bulkLotId,
        fpo_id: req.user.id,
        commodity,
        variety,
        total_quantity: totalQuantity,
        quality_grade: qualityGrade,
        reserve_price: reservePrice,
        pickup_location: pickupLocation,
        status: "COLLECTING",
        farmer_lots_included: farmerLotIds.length,
      },
    });
  } catch (error) {
    console.error("Aggregate lots error:", error);
    res.status(500).json({ message: "Failed to aggregate lots" });
  }
};

// @desc    Get all bulk lots for the logged-in FPO
// @route   GET /api/fpo/bulk-lots
const getBulkLots = async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: "SELECT * FROM fpo_bulk_lots WHERE fpo_id = ? ORDER BY created_at DESC",
      args: [req.user.id],
    });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      bulkLots: result.rows,
    });
  } catch (error) {
    console.error("Get bulk lots error:", error);
    res.status(500).json({ message: "Failed to fetch bulk lots" });
  }
};

export { getAvailableLots, aggregateLots, getBulkLots };
