const pool = require("../configs/db");

exports.getUserReport = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (req.user.sub !== userId && req.user.role !== "ADMIN_ROLE") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1`,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo reporte" });
  }
};

exports.getGlobalReport = async (req, res) => {
  try {
    const deposits = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE type = 'DEPOSIT'`
    );

    const withdraws = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total FROM transactions WHERE type = 'WITHDRAW'`
    );

    res.json({
      totalDeposits: deposits.rows[0].total,
      totalWithdraws: withdraws.rows[0].total,
      systemBalance:
        deposits.rows[0].total - withdraws.rows[0].total
    });

  } catch (error) {
    res.status(500).json({ message: "Error reporte global" });
  }
};