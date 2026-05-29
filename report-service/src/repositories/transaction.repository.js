const { pool } = require('../../configs/db');

const insertTransaction = async (data) => {
  const result = await pool.query(
    `INSERT INTO transactions
      (user_id, account_number, type, amount, target_account_number, description, reverted, banking_transaction_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, NOW()))
     RETURNING *`,
    [
      data.userId,
      data.accountNumber,
      data.type,
      data.amount,
      data.targetAccountNumber || null,
      data.description || null,
      data.reverted || false,
      data.bankingTransactionId || null,
      data.createdAt || null,
    ]
  );
  return result.rows[0];
};

const findByUser = async (userId, { from, to, accountNumber, type, limit = 100, offset = 0 }) => {
  const params = [userId];
  const clauses = ['user_id = $1', 'reverted = false'];

  if (accountNumber) {
    params.push(accountNumber);
    clauses.push(`account_number = $${params.length}`);
  }
  if (type) {
    params.push(type);
    clauses.push(`type = $${params.length}`);
  }
  if (from) {
    params.push(from);
    clauses.push(`created_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    clauses.push(`created_at <= $${params.length}`);
  }

  params.push(limit, offset);
  const limitIdx = params.length - 1;
  const offsetIdx = params.length;

  const result = await pool.query(
    `SELECT * FROM transactions
     WHERE ${clauses.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM transactions WHERE ${clauses.join(' AND ')}`,
    params.slice(0, params.length - 2)
  );

  return { rows: result.rows, total: countResult.rows[0].total };
};

const findByAccount = async (accountNumber, userId, filters = {}) => {
  return findByUser(userId, { ...filters, accountNumber });
};

const aggregateByUser = async (userId, { from, to } = {}) => {
  const params = [userId];
  const clauses = ['user_id = $1', 'reverted = false'];

  if (from) {
    params.push(from);
    clauses.push(`created_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    clauses.push(`created_at <= $${params.length}`);
  }

  const where = clauses.join(' AND ');

  const result = await pool.query(
    `SELECT
       type,
       COUNT(*)::int AS count,
       COALESCE(SUM(amount), 0)::float AS total
     FROM transactions
     WHERE ${where}
     GROUP BY type`,
    params
  );

  return result.rows;
};

const aggregateGlobal = async () => {
  const result = await pool.query(
    `SELECT
       type,
       COUNT(*)::int AS count,
       COALESCE(SUM(amount), 0)::float AS total
     FROM transactions
     WHERE reverted = false
     GROUP BY type`
  );
  return result.rows;
};

const monthlyStats = async (userId, months = 6) => {
  const result = await pool.query(
    `SELECT
       TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS period,
       type,
       COUNT(*)::int AS count,
       COALESCE(SUM(amount), 0)::float AS total
     FROM transactions
     WHERE user_id = $1 AND reverted = false
       AND created_at >= NOW() - ($2 || ' months')::interval
     GROUP BY period, type
     ORDER BY period DESC`,
    [userId, String(months)]
  );
  return result.rows;
};

module.exports = {
  insertTransaction,
  findByUser,
  findByAccount,
  aggregateByUser,
  aggregateGlobal,
  monthlyStats,
};
