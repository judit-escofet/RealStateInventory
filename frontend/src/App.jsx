import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [formData, setFormData] = useState({
    address: '', price: '', bedrooms: '', bathrooms: '', size: '', type: 'Pis', description: '', status: 'Disponible'
  });

  const fetchProperties = () => {
    fetch('http://localhost:3001/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data.data))
      .catch(err => console.error("Error loading data:", err));
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      fetchProperties();
      setFormData({ address: '', price: '', bedrooms: '', bathrooms: '', size: '', type: 'Pis', description: '', status: 'Disponible' });
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Estàs segur que vols eliminar aquesta propietat?")) {
      fetch(`http://localhost:3001/api/properties/${id}`, { method: 'DELETE' })
        .then(() => fetchProperties());
    }
  };

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:3001/api/properties/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetchProperties());
  };

  // NOU: Now accepts unpaid_months array
  const handleUpdateTenant = (id, name, contact, unpaidMonths) => {
    fetch(`http://localhost:3001/api/properties/${id}/tenant`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tenant_name: name, 
        tenant_contact: contact,
        unpaid_months: JSON.stringify(unpaidMonths) // Convert array to string for DB
      })
    }).then(() => {
      alert("Perfil i pagaments actualitzats!");
      fetchProperties();
    });
  };

  const handleExportCSV = () => {
    if (properties.length === 0) return;
    const headers = ["Tipus", "Adreça", "Mida", "Habitacions", "Banys", "Preu", "Estat", "Notes", "Llogater", "Mesos Pendents"];
    const rows = properties.map(prop => {
      // Clean up the JSON array for the CSV export
      let pending = '';
      try { pending = JSON.parse(prop.unpaid_months || '[]').join(' - '); } catch(e){}
      
      return [
        prop.type, `"${prop.address.replace(/"/g, '""')}"`, prop.size, prop.bedrooms, prop.bathrooms, 
        prop.price, prop.status, `"${prop.description ? prop.description.replace(/"/g, '""').replace(/\n/g, ' ') : ''}"`,
        `"${prop.tenant_name || ''}"`, `"${pending}"`
      ]
    });
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "inventari_immobiliari.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rentedProperties = properties.filter(p => p.status === 'Llogat');

  return (
    <div className="app-container">
      <h1 className="header-title">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '15px', verticalAlign: 'text-bottom' }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        INVENTARI IMMOBILIARI
      </h1>

      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          Llista de Propietats
        </button>
        <button className={`tab-button ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>
          Perfils de Llogaters ({rentedProperties.length})
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="form-container">
            {/* Same form as before... */}
            <h3>Afegeix una nova propietat</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <select name="type" value={formData.type} onChange={handleChange} className="form-input">
                  <option value="Pis">Pis</option>
                  <option value="Casa">Casa</option>
                  <option value="Local">Local Comercial</option>
                  <option value="Terreny">Terreny</option>
                </select>
                <input type="text" name="address" placeholder="Adreça" value={formData.address} onChange={handleChange} required className="form-input" style={{ flex: 1 }} />
                <input type="number" name="price" placeholder="Preu (€)" value={formData.price} onChange={handleChange} required className="form-input price-input-form" />
              </div>

              <div className="form-group">
                <input type="number" name="size" placeholder="Mida (m²)" value={formData.size} onChange={handleChange} required className="form-input small-input-form" />
                <input type="number" name="bedrooms" placeholder="Habitacions" value={formData.bedrooms} onChange={handleChange} required className="form-input small-input-form" />
                <input type="number" name="bathrooms" placeholder="Banys" value={formData.bathrooms} onChange={handleChange} required className="form-input small-input-form" />
                <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                  <option value="Disponible">Disponible</option>
                  <option value="Reservat">Reservat</option>
                  <option value="Venut">Venut</option>
                  <option value="Llogat">Llogat</option>
                </select>
              </div>

              <div className="form-group full-width">
                <textarea name="description" placeholder="Notes..." value={formData.description} onChange={handleChange} className="form-input" style={{ width: '100%', resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="btn-submit">Guardar Propietat</button>
            </form>
          </div>

          <div className="table-header-container">
            <h3>Inventari Actual</h3>
            <button onClick={handleExportCSV} className="btn-export">Exportar a CSV</button>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Tipus</th>
                <th>Adreça</th>
                <th>Detalls</th>
                <th>Preu</th>
                <th>Notes</th>
                <th>Estat</th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id}>
                  <td className="type-cell">{prop.type}</td>
                  <td>{prop.address}</td>
                  <td className="details-cell">{prop.size}m² | {prop.bedrooms} hab | {prop.bathrooms} b.</td>
                  <td className="price-text">{prop.price.toLocaleString()} €</td>
                  <td className="notes-cell" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prop.description}>
                    {prop.description}
                  </td>
                  <td>
                    <select value={prop.status} onChange={(e) => handleStatusChange(prop.id, e.target.value)} className="form-input table-select">
                      <option value="Disponible">Disponible</option>
                      <option value="Reservat">Reservat</option>
                      <option value="Venut">Venut</option>
                      <option value="Llogat">Llogat</option>
                    </select>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleDelete(prop.id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === 'profiles' && (
        <div>
          <h3>Base de Dades de Llogaters</h3>
          {rentedProperties.length === 0 ? (
            <p style={{ color: '#888', marginTop: '20px' }}>No hi ha cap propietat marcada com a "Llogat".</p>
          ) : (
            <div className="profiles-grid">
              {rentedProperties.map(prop => (
                <TenantProfileCard key={prop.id} property={prop} onSave={handleUpdateTenant} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// NOU: Tenant Profile Card with Payment Tracking
function TenantProfileCard({ property, onSave }) {
  const [name, setName] = useState(property.tenant_name || '');
  const [contact, setContact] = useState(property.tenant_contact || '');
  
  // Parse the saved JSON array of unpaid months (or default to empty array)
  const [unpaid, setUnpaid] = useState(() => {
    try { return JSON.parse(property.unpaid_months || '[]'); } 
    catch { return []; }
  });

  const monthNames = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];

  // Toggle a month between paid/unpaid
  const toggleMonth = (month) => {
    if (unpaid.includes(month)) {
      setUnpaid(unpaid.filter(m => m !== month)); // Remove it
    } else {
      setUnpaid([...unpaid, month]); // Add it
    }
  };

  return (
    <div className="profile-card">
      <h4>{property.type} Llogat</h4>
      <p className="address">{property.address}</p>
      
      <div className="profile-input-group">
        <label>Nom del Llogater</label>
        <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Joan Martí..." />
      </div>
      
      <div className="profile-input-group">
        <label>Contacte / Telèfon</label>
        <input type="text" className="form-input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Ex: +34 600 000 000" />
      </div>

      {/* TRACKER GRID */}
      <div className="tracker-container">
        <div className="tracker-title">
          <span>Mesos Pendents</span>
          {unpaid.length > 0 && <span className="pending-alert">{unpaid.length} Impagat</span>}
        </div>
        <div className="months-grid">
          {monthNames.map(month => (
            <button 
              key={month} 
              className={`month-toggle ${unpaid.includes(month) ? 'unpaid' : ''}`}
              onClick={() => toggleMonth(month)}
              title={unpaid.includes(month) ? "Marcar com a Pagat" : "Marcar com a Pendent"}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-save-profile" onClick={() => onSave(property.id, name, contact, unpaid)}>
        Guardar Perfil
      </button>
    </div>
  );
}

export default App