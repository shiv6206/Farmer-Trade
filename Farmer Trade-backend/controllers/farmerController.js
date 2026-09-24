import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create a new farmer lot
// @route   POST /api/farmer/lots
const createLot = async (req, res) => {
  try {
    const { commodity, variety, quantity_quintals, quality_grade, harvest_date, urgency_days, expected_price } = req.body;

    // Validate required fields
    if (!commodity || !variety || !quantity_quintals || !quality_grade) {
      return res.status(400).json({
        message: "commodity, variety, quantity_quintals, and quality_grade are required",
      });
    }

    // Validate quality grade
    const validGrades = ["Grade-A", "Grade-B", "Grade-C"];
    if (!validGrades.includes(quality_grade)) {
      return res.status(400).json({
        message: `Invalid quality grade. Must be one of: ${validGrades.join(", ")}`,
      });
    }

    const id = uuidv4();
    await tursoClient.execute({
      sql: `INSERT INTO farmer_lots (id, farmer_id, commodity, variety, quantity_quintals, quality_grade, harvest_date, urgency_days, expected_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        req.user.id,
        commodity,
        variety,
        quantity_quintals,
        quality_grade,
        harvest_date || null,
        urgency_days || 3,
        expected_price || null,
      ],
    });

    res.status(201).json({
      success: true,
      message: "Lot created successfully",
      lot: {
        id,
        farmer_id: req.user.id,
        commodity,
        variety,
        quantity_quintals,
        quality_grade,
        harvest_date,
        urgency_days: urgency_days || 3,
        expected_price,
        status: "LISTED",
      },
    });
  } catch (error) {
    console.error("Create lot error:", error);
    res.status(500).json({ message: "Failed to create lot" });
  }
};

// @desc    Get all lots for the logged-in farmer
// @route   GET /api/farmer/lots/my-lots
const getMyLots = async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: "SELECT * FROM farmer_lots WHERE farmer_id = ? ORDER BY created_at DESC",
      args: [req.user.id],
    });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      lots: result.rows,
    });
  } catch (error) {
    console.error("Get my lots error:", error);
    res.status(500).json({ message: "Failed to fetch lots" });
  }
};

// @desc    Get farmer summary (total lots, total quantity, avg price)
// @route   GET /api/farmer/summary
const getFarmerSummary = async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT 
              COUNT(*) as total_lots,
              SUM(quantity_quintals) as total_quantity,
              AVG(expected_price) as avg_expected_price
            FROM farmer_lots 
            WHERE farmer_id = ?`,
      args: [req.user.id],
    });

    const summary = result.rows[0];

    // Get lots by status
    const statusResult = await tursoClient.execute({
      sql: `SELECT status, COUNT(*) as count 
            FROM farmer_lots 
            WHERE farmer_id = ? 
            GROUP BY status`,
      args: [req.user.id],
    });

    res.status(200).json({
      success: true,
      summary: {
        total_lots: summary.total_lots || 0,
        total_quantity_quintals: summary.total_quantity || 0,
        avg_expected_price: summary.avg_expected_price || 0,
        lots_by_status: statusResult.rows,
      },
    });
  } catch (error) {
    console.error("Get farmer summary error:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

export { createLot, getMyLots, getFarmerSummary };
