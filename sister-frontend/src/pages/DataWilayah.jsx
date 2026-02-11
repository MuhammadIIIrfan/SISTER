import { MapPin, Users, Home, Search, Filter, Download, AlertTriangle, Edit, X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/data-wilayah.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function DataWilayah() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter');

  // Cek User Login dari LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canEdit = user && (user.role === 'danramil' || user.role === 'babinsa');

  // State untuk Data Wilayah (Agar bisa diedit)
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/wilayah')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // State untuk Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);

  // Fungsi membuka modal edit
  const handleEditClick = (item) => {
    setCurrentEditData({ ...item }); // Copy object agar tidak merubah state langsung
    setIsEditModalOpen(true);
  };

  // Fungsi menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi menyimpan perubahan
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/wilayah/${currentEditData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEditData)
      });
      if (response.ok) {
        const updatedItem = await response.json();
        setData(prevData => prevData.map(item => item.id === updatedItem.id ? updatedItem : item));
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Filter Logic
  const filteredData = data.filter(item => {
    if (filter === 'way-jepara') return item.kecamatan === 'Way Jepara';
    if (filter === 'braja-selebah') return item.kecamatan === 'Braja Selebah';
    return true;
  });

  // Judul Dinamis
  const pageTitle = filter === 'way-jepara' ? 'Data Wilayah Kec. Way Jepara' : filter === 'braja-selebah' ? 'Data Wilayah Kec. Braja Selebah' : 'DATA TERITORIAL KORAMIL 429-09';
  const pageSubtitle = filter ? `Daftar desa dan kondisi wilayah di Kecamatan ${filter === 'way-jepara' ? 'Way Jepara' : 'Braja Selebah'}` : 'Data lengkap seluruh wilayah teritorial Koramil 429-09';

  const statistics = [
    {
      title: 'Total Desa',
      value: filteredData.length,
      icon: Home,
      color: '#059669'
    },
    {
      title: 'Total Penduduk',
      value: '29,450', // Static for demo
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'Luas Wilayah',
      value: '101 km²',
      icon: MapPin,
      color: '#f59e0b'
    },
    {
      title: 'Titik Rawan',
      value: filteredData.filter(d => d.status !== 'Aman').length,
      icon: AlertTriangle,
      color: '#ef4444'
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Aman': return 'badge-success';
      case 'Waspada': return 'badge-warning';
      case 'Rawan': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="data-wilayah-container">
      {/* Header */}
      <div className="data-wilayah-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                <IconComponent size={28} />
              </div>
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="wilayah-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Cari nama desa..." />
        </div>
        <div className="control-buttons">
          <button className="btn-icon">
            <Filter size={20} />
            Filter
          </button>
          <button className="btn-icon">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="wilayah-table-wrapper">
        <table className="wilayah-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Desa</th>
              <th>Kecamatan</th>
              <th>Luas Wilayah</th>
              <th>Jumlah Penduduk</th>
              <th>Kepala Desa</th>
              <th>Status Keamanan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="cell-nama" style={{fontWeight: '600'}}>{item.desa}</td>
                <td>{item.kecamatan}</td>
                <td>{item.luas}</td>
                <td>{item.penduduk} Jiwa</td>
                <td>{item.kades}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                </td>
                <td style={{display: 'flex', gap: '0.5rem'}}>
                  <button className="btn-action" onClick={() => alert(`Detail ${item.desa}`)}>Detail</button>
                  {canEdit && (
                    <button className="btn-action btn-edit" onClick={() => handleEditClick(item)}>
                      <Edit size={14} /> Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="wilayah-summary">
        <p>Total: <strong>{filteredData.length}</strong> desa ditampilkan</p>
      </div>

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Data Wilayah</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nama Desa</label>
                <input type="text" name="desa" className="form-input" value={currentEditData.desa} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Kecamatan</label>
                <select name="kecamatan" className="form-select" value={currentEditData.kecamatan} onChange={handleInputChange}>
                  <option value="Way Jepara">Way Jepara</option>
                  <option value="Braja Selebah">Braja Selebah</option>
                </select>
              </div>

              <div className="form-group" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="form-label">Luas Wilayah</label>
                  <input type="text" name="luas" className="form-input" value={currentEditData.luas} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label">Jumlah Penduduk</label>
                  <input type="text" name="penduduk" className="form-input" value={currentEditData.penduduk} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kepala Desa</label>
                <input type="text" name="kades" className="form-input" value={currentEditData.kades} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Status Keamanan</label>
                <select name="status" className="form-select" value={currentEditData.status} onChange={handleInputChange}>
                  <option value="Aman">Aman</option>
                  <option value="Waspada">Waspada</option>
                  <option value="Rawan">Rawan</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save"><Save size={18} /> Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}