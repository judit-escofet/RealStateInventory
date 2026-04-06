const sqlite3 = require('sqlite3').verbose();

// Connect to your existing database
const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) console.error(err.message);
});

// Authentic fake data for Barcelona, including our new Tenant and Payment fields
const fakeProperties = [
    {
        type: 'Pis', address: 'Carrer de Balmes, 120, 3r 2a (Eixample)', price: 450000, 
        size: 95, bedrooms: 3, bathrooms: 2, status: 'Disponible',
        description: 'Pis senyorial amb molta llum natural. Finca règia amb ascensor i balcó.',
        tenant_name: '', tenant_contact: '', unpaid_months: '[]'
    },
    {
        type: 'Casa', address: 'Carrer Major de Sarrià, 45 (Sarrià)', price: 1250000, 
        size: 210, bedrooms: 4, bathrooms: 3, status: 'Disponible',
        description: 'Casa adossada al centre de Sarrià amb jardí privat de 80m2.',
        tenant_name: '', tenant_contact: '', unpaid_months: '[]'
    },
    {
        type: 'Pis', address: 'Rambla del Poblenou, 88, Àtic', price: 1800, 
        size: 110, bedrooms: 3, bathrooms: 2, status: 'Llogat',
        description: 'Àtic amb terrassa. Llogat a llarg termini.',
        tenant_name: 'Maria Garcia', tenant_contact: '+34 654 321 987', 
        unpaid_months: '[]' // All paid up!
    },
    {
        type: 'Local', address: 'Avinguda Diagonal, 450', price: 3200, 
        size: 150, bedrooms: 0, bathrooms: 1, status: 'Llogat',
        description: 'Local comercial a peu de carrer. Actualment és una cafeteria.',
        tenant_name: 'Cafeteria El Forn (Marc Vila)', tenant_contact: '93 123 45 67', 
        unpaid_months: '["Gen", "Feb", "Mar"]' // Owes 3 months!
    },
    {
        type: 'Pis', address: 'Carrer d\'Aragó, 215, 1r 1a', price: 1200, 
        size: 75, bedrooms: 2, bathrooms: 1, status: 'Llogat',
        description: 'Pis cèntric, ben comunicat amb metro i tren.',
        tenant_name: 'Joan Martí', tenant_contact: '+34 699 888 777', 
        unpaid_months: '["Abr"]' // Owes 1 month
    },
    {
        type: 'Terreny', address: 'Carretera de les Aigües, s/n (Collserola)', price: 450000, 
        size: 800, bedrooms: 0, bathrooms: 0, status: 'Disponible',
        description: 'Parcel·la edificable amb llicència. Vistes panoràmiques espectaculars.',
        tenant_name: '', tenant_contact: '', unpaid_months: '[]'
    },
    {
        type: 'Pis', address: 'Carrer de la Marina, 250 (Sagrada Família)', price: 410000, 
        size: 85, bedrooms: 2, bathrooms: 1, status: 'Reservat',
        description: 'Bones vistes a la Sagrada Família. Molt assolellat al matí.',
        tenant_name: '', tenant_contact: '', unpaid_months: '[]'
    }
];

// Insert the data into the updated schema
db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO properties (address, price, bedrooms, bathrooms, size, type, description, status, tenant_name, tenant_contact, unpaid_months) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    fakeProperties.forEach(p => {
        stmt.run(p.address, p.price, p.bedrooms, p.bathrooms, p.size, p.type, p.description, p.status, p.tenant_name, p.tenant_contact, p.unpaid_months);
    });
    
    stmt.finalize();
    console.log('Noves dades de Barcelona (amb llogaters) inserides correctament!');
});

db.close();