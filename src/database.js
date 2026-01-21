const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./bot.db");

db.run(`
  CREATE TABLE IF NOT EXISTS messaged_users (
    phone TEXT PRIMARY KEY,
    last_messaged INTEGER
  )
`);

function recentlyMessaged(phone) {
  return new Promise(resolve => {
    db.get(
      "SELECT last_messaged FROM messaged_users WHERE phone = ?",
      [phone],
      (err, row) => {
        if (!row) return resolve(false);
        resolve(Date.now() - row.last_messaged < 24 * 60 * 60 * 1000);
      }
    );
  });
}

function logMessage(phone) {
  db.run(
    "INSERT OR REPLACE INTO messaged_users VALUES (?, ?)",
    [phone, Date.now()]
  );
}

module.exports = { recentlyMessaged, logMessage };
