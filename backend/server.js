const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors()); 
app.use(express.json());

app.get('/api/properties', (req, res) => {
    db.all("SELECT * FROM properties", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/properties', (req, res) => {
    const { address, price, bedrooms, bathrooms, size, type, description, status } = req.body;
    const sql = `INSERT INTO properties (address, price, bedrooms, bathrooms, size, type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [address, price, bedrooms, bathrooms, size, type, description, status], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.delete('/api/properties/:id', (req, res) => {
    db.run('DELETE FROM properties WHERE id = ?', req.params.id, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Deleted!" });
    });
});

app.put('/api/properties/:id/status', (req, res) => {
    const { status } = req.body;
    db.run('UPDATE properties SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Status updated!" });
    });
});

// NEW: Update Tenant Profile
app.put('/api/properties/:id/tenant', (req, res) => {
    const { tenant_name, tenant_contact, unpaid_months } = req.body;
    db.run(
        'UPDATE properties SET tenant_name = ?, tenant_contact = ?, unpaid_months = ? WHERE id = ?', 
        [tenant_name, tenant_contact, unpaid_months, req.params.id], 
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Tenant and payments updated!" });
        }
    );
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));