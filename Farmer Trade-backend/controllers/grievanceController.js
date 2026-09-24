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

    // Validate transaction exists
    const txResult = await tursoClient.execute({
      sql: "SELECT * FROM transactions WHERE id = ?",
      args: [transactionId],
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
            JOIN users u ON g.raised_by = u.id 
            WHERE g.transaction_id = ?
            ORDER BY g.created_at DESC`,
      args: [transactionId],
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
