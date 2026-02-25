import { Search, Filter, Download, AlertTriangle, Edit, X, Save, CheckCircle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/data-wilayah.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function DataWilayah() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter');

  // Cek User Login dari LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canEdit = user && (user.role === 'danramil' || user.role === 'babinsa');

  // State untuk Data Wilayah (Agar bisa diedit)
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/wilayah')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // State untuk Modal Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentDetailData, setCurrentDetailData] = useState(null);
  const [notification, setNotification] = useState(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fungsi membuka modal edit
  const handleEditClick = (item) => {
    setCurrentEditData({ ...item }); // Copy object agar tidak merubah state langsung
    setIsEditModalOpen(true);
  };

  // Fungsi membuka modal tambah
  const handleAddClick = () => {
    setCurrentEditData({
      desa: '',
      kecamatan: 'Way Jepara',
      luas: '',
      penduduk: '',
      kades: '', // Babinsa
      status: 'Aman'
    });
    setIsEditModalOpen(true);
  };

  // Fungsi membuka modal detail
  const handleDetailClick = (item) => {
    setCurrentDetailData(item);
    setIsDetailModalOpen(true);
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
    const isEdit = currentEditData.id;
    const url = isEdit 
      ? `http://localhost:5000/api/wilayah/${currentEditData.id}`
      : 'http://localhost:5000/api/wilayah';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEditData)
      });
      if (response.ok) {
        const savedItem = await response.json();
        if (isEdit) {
          setData(prevData => prevData.map(item => item.id === savedItem.id ? savedItem : item));
        } else {
          setData(prevData => [...prevData, savedItem]);
        }
        setIsEditModalOpen(false);
        setNotification({ type: 'success', message: isEdit ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!' });
      } else {
        setNotification({ type: 'error', message: `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} data.` });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setNotification({ type: 'error', message: 'Gagal terhubung ke server.' });
    }
  };

  // Filter Logic
  const filteredData = data.filter(item => {
    const matchesSearch = item.desa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'way-jepara' ? item.kecamatan === 'Way Jepara' :
      filter === 'braja-selebah' ? item.kecamatan === 'Braja Selebah' :
      true;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "No,Nama Desa,Kecamatan,Luas Wilayah,Jumlah Penduduk,Babinsa,Status Keamanan\n"
      + filteredData.map((item, index) => 
          `${index + 1},"${item.desa}","${item.kecamatan}","${item.luas}","${item.penduduk}","${item.kades}","${item.status}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_wilayah.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Judul Dinamis
  const pageTitle = filter === 'way-jepara' ? 'Data Wilayah Kec. Way Jepara' : filter === 'braja-selebah' ? 'Data Wilayah Kec. Braja Selebah' : 'DATA TERITORIAL KORAMIL 429-09';
  const pageSubtitle = filter ? `Daftar desa dan kondisi wilayah di Kecamatan ${filter === 'way-jepara' ? 'Way Jepara' : 'Braja Selebah'}` : 'Data lengkap seluruh wilayah teritorial Koramil 429-09';

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
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '90px', /* Disesuaikan agar di bawah navbar */
          right: '20px',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'slideIn 0.3s ease-out',
          fontWeight: '500'
        }}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <span>{notification.message}</span>
        </div>
      )}
      {/* Header */}
      <div className="data-wilayah-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="wilayah-controls">
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Cari nama desa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="control-buttons">
          {canEdit && (
            <button className="btn-icon" onClick={handleAddClick} style={{ color: '#059669', borderColor: '#059669', backgroundColor: '#f0fdf4' }}>
              <Plus size={20} />
              Tambah
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button className="btn-icon" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <Filter size={20} />
              Filter
            </button>
            {showFilterMenu && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 50,
                minWidth: '180px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>Filter Kecamatan</div>
                <button onClick={() => { navigate('/wilayah'); setShowFilterMenu(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: !filter ? '#f0fdf4' : 'white', border: 'none', cursor: 'pointer', color: !filter ? '#059669' : '#374151' }}>Semua Wilayah</button>
                <button onClick={() => { navigate('/wilayah?filter=way-jepara'); setShowFilterMenu(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: filter === 'way-jepara' ? '#f0fdf4' : 'white', border: 'none', cursor: 'pointer', color: filter === 'way-jepara' ? '#059669' : '#374151' }}>Kec. Way Jepara</button>
                <button onClick={() => { navigate('/wilayah?filter=braja-selebah'); setShowFilterMenu(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: filter === 'braja-selebah' ? '#f0fdf4' : 'white', border: 'none', cursor: 'pointer', color: filter === 'braja-selebah' ? '#059669' : '#374151' }}>Kec. Braja Selebah</button>
              </div>
            )}
          </div>
          <button className="btn-icon" onClick={handleExport}>
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
              <th>Babinsa</th>
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
                  <button className="btn-action" onClick={() => handleDetailClick(item)}>Detail</button>
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
              <h3 className="modal-title">{currentEditData.id ? 'Edit Data Wilayah' : 'Tambah Data Wilayah'}</h3>
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
                <label className="form-label">Babinsa</label>
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

      {/* Modal Detail */}
      {isDetailModalOpen && currentDetailData && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detail Wilayah</h3>
              <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="detail-body">
              <div className="form-group">
                <label className="form-label">Peta Lokasi</label>
                <div style={{ 
                    height: '250px', 
                    width: '100%', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: '1px solid #e5e7eb',
                    background: '#e9ecef'
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(currentDetailData.desa + ', ' + currentDetailData.kecamatan + ', Lampung Timur')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}>
                    </iframe>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nama Desa</label>
                <div className="form-input" style={{backgroundColor: '#f3f4f6'}}>{currentDetailData.desa}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Kecamatan</label>
                <div className="form-input" style={{backgroundColor: '#f3f4f6'}}>{currentDetailData.kecamatan}</div>
              </div>
              <div className="form-group" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="form-label">Luas Wilayah</label>
                  <div className="form-input" style={{backgroundColor: '#f3f4f6'}}>{currentDetailData.luas}</div>
                </div>
                <div>
                  <label className="form-label">Jumlah Penduduk</label>
                  <div className="form-input" style={{backgroundColor: '#f3f4f6'}}>{currentDetailData.penduduk} Jiwa</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Babinsa</label>
                <div className="form-input" style={{backgroundColor: '#f3f4f6'}}>{currentDetailData.kades}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Status Keamanan</label>
                <div className="form-input" style={{backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center'}}>
                   <span className={`badge ${getStatusBadgeClass(currentDetailData.status)}`}>{currentDetailData.status}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsDetailModalOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}