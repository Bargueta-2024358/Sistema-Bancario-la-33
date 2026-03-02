const pool = require("../configs/db");

exports.createTransaction = async (req, res) => {
  try {
    const { userId, accountNumber, type, amount } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (user_id, account_number, type, amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, accountNumber, type, amount]
    );

    res.status(201).json({
      success: true,
      transaction: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando transacción" });
  }
};