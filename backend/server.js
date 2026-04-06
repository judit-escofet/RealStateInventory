const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors()); 
app.use(express.json());

// 1. Obtenir totes les propietats
app.get('/api/properties', (req, res) => {
    db.all("SELECT * FROM properties", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// 2. Afegir una nova propietat (ACTUALITZAT)
app.post('/api/properties', (req, res) => {
    const { address, price, bedrooms, bathrooms, size, type, description, status } = req.body;
    const sql = `INSERT INTO properties (address, price, bedrooms, bathrooms, size, type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [address, price, bedrooms, bathrooms, size, type, description, status];

    db.run(sql, params, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, message: "Propietat afegida correctament!" });
    });
});

// 3. Eliminar una propietat
app.delete('/api/properties/:id', (req, res) => {
    const sql = 'DELETE FROM properties WHERE id = ?';
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Propietat eliminada correctament!" });
    });
});

// 4. Actualitzar l'estat
app.put('/api/properties/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE properties SET status = ? WHERE id = ?';
    db.run(sql, [status, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Estat actualitzat!" });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor funcionant a http://localhost:${PORT}`);
});