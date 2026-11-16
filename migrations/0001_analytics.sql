CREATE TABLE IF NOT EXISTS link_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_link_clicks_created_at ON link_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_link_clicks_slug ON link_clicks(link_slug);
