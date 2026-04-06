import { useState, useEffect } from 'react'
import './App.css' // Import the minimalist styles!

function App() {
  const [properties, setProperties] = useState([]);
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
    if (window.confirm("Are you sure you want to delete this property?")) {
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

  return (
    <div className="app-container">
      {/* Playful emoji removed for high-fashion minimalist sophistication */}
      <h1 className="header-title">INVENTARI IMMOBILIARI</h1>
      
      <div className="form-container">
        <h3>Afegeix una nova propietat</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <select name="type" value={formData.type} onChange={handleChange} className="form-input">
              <option value="Pis">Pis</option>
              <option value="Casa">Casa</option>
              <option value="Local">Local Comercial</option>
              <option value="Terreny">Terreny</option>
            </select>
            {/* Added style={{ flex: 1 }} inline because it's purely a layout rule and easier than many distinct width classes */}
            <input type="text" name="address" placeholder="Adreça" value={formData.address} onChange={handleChange} required className="form-input" style={{ flex: 1 }} />
            {/* price-input-form class controls width from CSS */}
            <input type="number" name="price" placeholder="Preu (€)" value={formData.price} onChange={handleChange} required className="form-input price-input-form" />
          </div>

          <div className="form-group">
            {/* small-input-form class controls width from CSS */}
            <input type="number" name="size" placeholder="Mida (m²)" value={formData.size} onChange={handleChange} required className="form-input small-input-form" />
            <input type="number" name="bedrooms" placeholder="Habitacions" value={formData.bedrooms} onChange={handleChange} required className="form-input small-input-form" />
            <input type="number" name="bathrooms" placeholder="Banys" value={formData.bathrooms} onChange={handleChange} required className="form-input small-input-form" />
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              <option value="Disponible">Disponible</option>
              <option value="Reservat">Reservat</option>
              <option value="Venut">Venut</option>
            </select>
          </div>

          <div className="form-group full-width">
            {/* Replaced alignment inline style with full-width className; still keeping critical layout styles inline like width */}
            <textarea name="description" placeholder="Notes (Ex: Necessita reforma, té pàrquing, contacte del venedor...)" value={formData.description} onChange={handleChange} className="form-input" style={{ width: '100%', resize: 'vertical' }}></textarea>
          </div>

          <button type="submit" className="btn-submit">Guardar Propietat</button>
        </form>
      </div>

      <h3>Llista de Propietats</h3>
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
              <td className="notes-cell" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={prop.description}>
                {prop.description}
              </td>
              <td>
                <select 
                  value={prop.status} 
                  onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                  className="form-input table-select"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Reservat">Reservat</option>
                  <option value="Venut">Venut</option>
                </select>
              </td>
              <td className="actions-cell">
                <button onClick={() => handleDelete(prop.id)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App