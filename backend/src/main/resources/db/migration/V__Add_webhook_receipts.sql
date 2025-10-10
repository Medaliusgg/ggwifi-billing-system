-- Create webhook receipts table for idempotent webhooks
CREATE TABLE IF NOT EXISTS webhook_receipts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,
  endpoint VARCHAR(128) NOT NULL,
  dedupe_key VARCHAR(256) NOT NULL UNIQUE,
  payload TEXT NULL,
  received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_receipts_dedupe ON webhook_receipts(dedupe_key);


