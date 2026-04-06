const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) console.error(err.message);
});

// Added unpaid_months column (stores data as a text array)
db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    price REAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size REAL,
    type TEXT,
    description TEXT,
    status TEXT,
    tenant_name TEXT DEFAULT '',
    tenant_contact TEXT DEFAULT '',
    unpaid_months TEXT DEFAULT '[]'
)`);

module.exports = db;