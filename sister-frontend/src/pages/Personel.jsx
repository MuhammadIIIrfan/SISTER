import { Hash, Plus, Edit, Trash2, X, Save, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/personel.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Personel() {
  const [personelData, setPersonelData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    nrp: '',
    jabatan: 'Babinsa',
    pangkat: '',
    wilayah: '',
    status: 'Aktif',
    kontak: '',
    foto: null
  });
  const [notification, setNotification] = useState(null);

  // Cek User Login dari LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isDanramil = user && user.role === 'danramil';

  useEffect(() => {
    fetchPersonel();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchPersonel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/personel');
      const data = await response.json();
      setPersonelData(data);
    } catch (error) {
      console.error("Gagal mengambil data personel:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setNotification({ type: 'error', message: "Ukuran foto terlalu besar! Maksimal 5MB." });
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setFormData({
      id: null,
      nama: '',
      nrp: '',
      jabatan: 'Babinsa',
      pangkat: '',
      wilayah: '',
      status: 'Aktif',
      kontak: '',
      foto: null
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (person) => {
    setFormData(person);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode 
      ? `http://localhost:5000/api/personel/${formData.id}`
      : 'http://localhost:5000/api/personel';
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPersonel();
        setIsModalOpen(false);
        setNotification({ type: 'success', message: isEditMode ? 'Data berhasil diperbarui!' : 'Personel berhasil ditambahkan!' });
      } else {
        const errorData = await response.json();
        setNotification({ type: 'error', message: `Gagal menyimpan: ${errorData.message || 'Terjadi kesalahan'}` });
      }
    } catch (error) {
      console.error("Error saving personel:", error);
      setNotification({ type: 'error', message: 'Gagal terhubung ke server.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus personel ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/personel/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPersonel();
          setNotification({ type: 'success', message: 'Personel berhasil dihapus!' });
        }
      } catch (error) {
        console.error("Error deleting personel:", error);
        setNotification({ type: 'error', message: 'Gagal menghapus personel.' });
      }
    }
  };

  const danramil = personelData.find(p => p.jabatan === 'Danramil');
  const batuud = personelData.find(p => p.jabatan === 'Batuud');
  const babinsaData = personelData.filter(p => p.jabatan === 'Babinsa');

  // Judul dinamis
  const pageTitle = 'STRUKTUR ORGANISASI PERSONEL';
  const pageSubtitle = 'Struktur pimpinan dan daftar Babinsa Koramil 429-09';

  return (
    <div className="personel-container">
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
          top: '90px',
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
      <div className="personel-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="personel-controls">
        <div className="control-buttons">
          {isDanramil && (
            <button className="btn-create" onClick={openAddModal}><Plus size={18} /> Tambah Personel</button>
          )}
        </div>
      </div>

      {/* Organogram View */}
      <div className="organogram-view">
        <div className="leadership-section">
          <h2 className="organogram-section-title">PIMPINAN</h2>
          
          {/* Danramil */}
          {danramil && (
            <div className="personel-card-modern">
              <div className="card-header-accent"></div>
              <div className="personel-main-info">
                {isDanramil && (
                  <div className="card-actions">
                    <button className="btn-icon-action edit" onClick={() => openEditModal(danramil)}><Edit size={14} /></button>
                    {/* Danramil biasanya tidak dihapus sembarangan, tapi jika perlu: 
                    <button className="btn-icon-action delete" onClick={() => handleDelete(danramil.id)}><Trash2 size={14} /></button> 
                    */}
                  </div>
                )}
                <div className="avatar-container">
                  <img src={danramil.foto} alt={danramil.nama} className="avatar-img" />
                </div>
                <h3 className="personel-name">{danramil.nama}</h3>
                <p className="personel-rank-text">{danramil.pangkat}</p>
                <div className="nrp-pill">
                  <Hash size={12} /> <span>{danramil.nrp}</span>
                </div>
                <div className="personel-divider"></div>
                <p className="personel-jabatan">{danramil.jabatan}</p>
              </div>
            </div>
          )}

          {/* Batuud */}
          {batuud && (
            <div className="personel-card-modern">
              <div className="card-header-accent"></div>
              <div className="personel-main-info">
                {isDanramil && (
                  <div className="card-actions">
                    <button className="btn-icon-action edit" onClick={() => openEditModal(batuud)}><Edit size={14} /></button>
                    <button className="btn-icon-action delete" onClick={() => handleDelete(batuud.id)}><Trash2 size={14} /></button>
                  </div>
                )}
                <div className="avatar-container">
                  <img src={batuud.foto} alt={batuud.nama} className="avatar-img" />
                </div>
                <h3 className="personel-name">{batuud.nama}</h3>
                <p className="personel-rank-text">{batuud.pangkat}</p>
                <div className="nrp-pill">
                  <Hash size={12} /> <span>{batuud.nrp}</span>
                </div>
                <div className="personel-divider"></div>
                <p className="personel-jabatan">{batuud.jabatan}</p>
              </div>
            </div>
          )}
        </div>

        <div className="babinsa-section">
          <h2 className="organogram-section-title">BABINSA</h2>
          <div className="babinsa-grid">
            {babinsaData.map(person => (
              <div key={person.id} className="personel-card-modern">
                <div className="card-header-accent"></div>
                <div className="personel-main-info">
                  {isDanramil && (
                    <div className="card-actions">
                      <button className="btn-icon-action edit" onClick={() => openEditModal(person)}><Edit size={14} /></button>
                      <button className="btn-icon-action delete" onClick={() => handleDelete(person.id)}><Trash2 size={14} /></button>
                    </div>
                  )}
                  <div className="avatar-container">
                    <img src={person.foto} alt={person.nama} className="avatar-img" />
                  </div>
                  <h3 className="personel-name">{person.nama}</h3>
                  <p className="personel-rank-text">{person.pangkat}</p>
                  <div className="nrp-pill">
                    <Hash size={12} /> <span>{person.nrp}</span>
                  </div>
                  <div className="personel-divider"></div>
                  <p className="personel-jabatan">Babinsa {person.wilayah}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditMode ? 'Edit Personel' : 'Tambah Personel'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" name="nama" className="form-input" value={formData.nama} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="form-label">NRP</label>
                  <input type="text" name="nrp" className="form-input" value={formData.nrp} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="form-label">Pangkat</label>
                  <input type="text" name="pangkat" className="form-input" value={formData.pangkat} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Jabatan</label>
                <select name="jabatan" className="form-select" value={formData.jabatan} onChange={handleInputChange}>
                  <option value="Danramil">Danramil</option>
                  <option value="Batuud">Batuud</option>
                  <option value="Babinsa">Babinsa</option>
                  <option value="Staf">Staf</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Wilayah Binaan (Desa)</label>
                <input type="text" name="wilayah" className="form-input" value={formData.wilayah} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Kontak (HP/WA)</label>
                <input type="text" name="kontak" className="form-input" value={formData.kontak} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Foto Profil</label>
                <div className="file-upload-wrapper">
                  <input type="file" id="foto-upload" className="file-upload-input" accept="image/*" onChange={handleImageUpload} />
                  <label htmlFor="foto-upload" className="file-upload-label">
                    <Camera size={20} />
                    <span>{formData.foto ? 'Ganti Foto' : 'Upload Foto'}</span>
                  </label>
                </div>
                {formData.foto && (
                  <div className="image-preview" style={{width: '180px', height: '240px', margin: '1rem auto', borderRadius: '12px', padding: '4px', border: '1px solid #e5e7eb', background: 'white'}}>
                    <img src={formData.foto} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save"><Save size={18} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
