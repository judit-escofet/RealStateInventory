const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connectat a la base de dades SQLite local.');
    }
});

// Taula actualitzada amb més detalls
db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    price REAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size REAL,
    type TEXT,
    description TEXT,
    status TEXT
)`);

module.exports = db;