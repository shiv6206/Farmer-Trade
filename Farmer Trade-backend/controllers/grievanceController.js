import tursoClient from "../config/turso.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create a grievance
// @route   POST /api/grievance/create
const createGrievance = async (req, res) => {
  try {
    const { transactionId, issueType, description, evidenceUrl } = req.body;

    if (!transactionId || !issueType || !description) {
      return res.status(400).json({
        message: "transactionId, issueType, and description are required",
      });
    }

    const validIssueTypes = ["QUALITY_DISPUTE", "PAYMENT_DELAY", "WEIGHT_DISCREPANCY", "LOGISTICS_DELAY"];
    if (!validIssueTypes.includes(issueType)) {
      return res.status(400).json({
        message: `Invalid issue type. Must be one of: ${validIssueTypes.join(", ")}`,
      });
    }

    // Verify the caller is a participant in this transaction.
    const txResult = await tursoClient.execute({
      sql: `SELECT t.id
            FROM transactions t
            LEFT JOIN fpo_bulk_lots fbl ON t.bulk_lot_id = fbl.id
            LEFT JOIN fpo_lot_mappings flm ON flm.bulk_lot_id = fbl.id
            LEFT JOIN farmer_lots fl ON fl.id = flm.farmer_lot_id
            WHERE t.id = ?
              AND (t.buyer_id = ? OR t.transporter_id = ? OR fbl.fpo_id = ? OR fl.farmer_id = ?)
            LIMIT 1`,
      args: [transactionId, req.user.id, req.user.id, req.user.id, req.user.id],
    });

    if (txResult.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const id = uuidv4();
    await tursoClient.execute({
      sql: `INSERT INTO grievances (id, transaction_id, raised_by, issue_type, description, evidence_url)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, transactionId, req.user.id, issueType, description, evidenceUrl || null],
    });

    res.status(201).json({
      success: true,
      message: "Grievance created successfully",
      grievance: {
        id,
        transactionId,
        raisedBy: req.user.id,
        issueType,
        description,
        evidenceUrl,
        status: "OPEN",
      },
    });
  } catch (error) {
    console.error("Create grievance error:", error);
    res.status(500).json({ message: "Failed to create grievance" });
  }
};

// @desc    Get grievances for a transaction
// @route   GET /api/grievance/:transactionId
const getGrievances = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const result = await tursoClient.execute({
      sql: `SELECT g.*, u.name as raised_by_name 
            FROM grievances g 
            JOIN transactions t ON t.id = g.transaction_id
            LEFT JOIN fpo_bulk_lots fbl ON fbl.id = t.bulk_lot_id
            LEFT JOIN fpo_lot_mappings flm ON flm.bulk_lot_id = fbl.id
            LEFT JOIN farmer_lots fl ON fl.id = flm.farmer_lot_id
            JOIN users u ON g.raised_by = u.id 
            WHERE g.transaction_id = ?
              AND (t.buyer_id = ? OR t.transporter_id = ? OR fbl.fpo_id = ? OR fl.farmer_id = ?)
            ORDER BY g.created_at DESC`,
      args: [transactionId, req.user.id, req.user.id, req.user.id, req.user.id],
    });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      grievances: result.rows,
    });
  } catch (error) {
    console.error("Get grievances error:", error);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

export { createGrievance, getGrievances };
