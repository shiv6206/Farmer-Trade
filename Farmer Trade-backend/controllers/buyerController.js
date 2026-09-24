import tursoClient from "../config/turso.js";

// @desc    Get all open bulk lots for bidding
// @route   GET /api/buyer/lots
const getOpenLots = async (req, res) => {
  try {
    const { commodity, district } = req.query;

    let sql = `SELECT fbl.*, u.name as fpo_name, u.district as fpo_district
               FROM fpo_bulk_lots fbl
               JOIN users u ON fbl.fpo_id = u.id
               WHERE fbl.status = 'OPEN_FOR_BIDS'`;
    const args = [];

    if (commodity) {
      sql += " AND fbl.commodity = ?";
      args.push(commodity);
    }

    if (district) {
      sql += " AND u.district = ?";
      args.push(district);
    }

    sql += " ORDER BY fbl.created_at DESC";

    const result = await tursoClient.execute({ sql, args });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      lots: result.rows,
    });
  } catch (error) {
    console.error("Get open lots error:", error);
    res.status(500).json({ message: "Failed to fetch open lots" });
  }
};

// @desc    Get buyer's transactions
// @route   GET /api/buyer/transactions
const getMyTransactions = async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT t.*, fbl.commodity, fbl.variety, fbl.total_quantity, u.name as fpo_name
            FROM transactions t
            JOIN fpo_bulk_lots fbl ON t.bulk_lot_id = fbl.id
            JOIN users u ON fbl.fpo_id = u.id
            WHERE t.buyer_id = ?
            ORDER BY t.created_at DESC`,
      args: [req.user.id],
    });

    res.status(200).json({
      success: true,
      count: result.rows.length,
      transactions: result.rows,
    });
  } catch (error) {
    console.error("Get my transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// @desc    Get buyer summary (total purchases, total spent, reliability)
// @route   GET /api/buyer/summary
const getBuyerSummary = async (req, res) => {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT 
              COUNT(*) as total_transactions,
              SUM(gross_amount) as total_spent,
              SUM(CASE WHEN payment_status = 'PAID' THEN 1 ELSE 0 END) as paid_count,
              SUM(CASE WHEN delivery_status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_count
            FROM transactions
            WHERE buyer_id = ?`,
      args: [req.user.id],
    });

    const summary = result.rows[0];
    const totalTx = summary.total_transactions || 0;
    const paidCount = summary.paid_count || 0;
    const deliveredCount = summary.delivered_count || 0;

    res.status(200).json({
      success: true,
      summary: {
        totalTransactions: totalTx,
        totalSpent: summary.total_spent || 0,
        paymentReliability: totalTx > 0 ? Math.round((paidCount / totalTx) * 100) : 0,
        deliveryCompletion: totalTx > 0 ? Math.round((deliveredCount / totalTx) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Get buyer summary error:", error);
    res.status(500).json({ message: "Failed to fetch buyer summary" });
  }
};

export { getOpenLots, getMyTransactions, getBuyerSummary };
