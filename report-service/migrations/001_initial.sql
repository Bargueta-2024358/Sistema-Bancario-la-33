CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  account_number VARCHAR(32) NOT NULL,
  type VARCHAR(32) NOT NULL,
  amount DECIMAL(14, 2) NOT NULL CHECK (amount >= 0),
  target_account_number VARCHAR(32),
  description TEXT,
  reverted BOOLEAN DEFAULT FALSE,
  banking_transaction_id VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_user_created ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account_created ON transactions(account_number, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_type ON transactions(type);
