const { Pool, Client } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://IN6AV:In6avKnl!@localhost:5436/banco_33_reports';

const pool = new Pool({ connectionString });

const ensureDatabase = async () => {
  const dbUrl = new URL(connectionString);
  const targetDb = decodeURIComponent(dbUrl.pathname.replace(/^\

  const adminUrl = new URL(connectionString);
  adminUrl.pathname = '/postgres';

  const adminClient = new Client({ connectionString: adminUrl.toString() });
  await adminClient.connect();
  try {
    const { rowCount } = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );
    if (rowCount === 0) {
      await adminClient.query('CREATE DATABASE "' + targetDb + '"');
      console.log('PostgreSQL | base de datos "' + targetDb + '" creada');
    }
  } finally {
    await adminClient.end();
  }
};

const initSchema = async () => {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS transactions (' +
      'id SERIAL PRIMARY KEY,' +
      'user_id VARCHAR(64) NOT NULL,' +
      'account_number VARCHAR(32) NOT NULL,' +
      'type VARCHAR(32) NOT NULL,' +
      'amount DECIMAL(14, 2) NOT NULL CHECK (amount >= 0),' +
      'target_account_number VARCHAR(32),' +
      'description TEXT,' +
      'reverted BOOLEAN DEFAULT FALSE,' +
      'banking_transaction_id VARCHAR(64),' +
      'created_at TIMESTAMPTZ DEFAULT NOW()' +
      ');' +
      'CREATE INDEX IF NOT EXISTS idx_tx_user_created ON transactions(user_id, created_at DESC);' +
      'CREATE INDEX IF NOT EXISTS idx_tx_account_created ON transactions(account_number, created_at DESC);' +
      'CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(type);'
  );
};

const connectDb = async () => {
  await ensureDatabase();
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    await initSchema();
    console.log('PostgreSQL | conectado a banco_33_reports');
  } finally {
    client.release();
  }
};

module.exports = { pool, connectDb };