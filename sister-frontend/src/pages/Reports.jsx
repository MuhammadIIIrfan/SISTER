import { useState, useEffect } from 'react';
import { FileText, Camera, MapPin, Clock, Plus, X, Save, Search, Image as ImageIcon, Trash2 } from 'lucide-react';
import '../styles/reports.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  
  // State Data Laporan
  const [reports, setReports] = useState([]);

  // State untuk Modal Detail
  const [selectedReport, setSelectedReport] = useState(null);

  // Cek User Login dari LocalStorage untuk hak akses
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canEdit = user && (user.role === 'danramil' || user.role === 'babinsa');

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Gagal mengambil data laporan:", err));
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Komsos',
    location: '',
    description: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (Maksimal 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran foto terlalu besar! Harap pilih foto di bawah 10MB.");
        e.target.value = null; // Reset input file
        return;
      }

      // Convert to Base64 agar bisa dikirim ke backend JSON
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
        ...formData,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
        const response = await fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const newReport = await response.json();
        setReports([newReport, ...reports]);
        setIsModalOpen(false);
        setFormData({ title: '', category: 'Komsos', location: '', description: '', image: null });
    } catch (error) {
        console.error("Gagal mengirim laporan:", error);
        alert(`Gagal mengirim laporan: ${error.message}. Pastikan server berjalan dan foto tidak terlalu besar.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setReports(prev => prev.filter(report => report.id !== id));
        } else {
          alert('Gagal menghapus laporan');
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Gagal terhubung ke server');
      }
    }
  };

  const filteredReports = filterCategory === 'All' 
    ? reports 
    : reports.filter(r => r.category === filterCategory);

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">LAPORAN GIAT BABINSA</h1>
          <p className="page-subtitle">Digitalisasi pelaporan kegiatan harian Babinsa Koramil 429-09</p>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Cari laporan..." />
        </div>
        <div className="filter-tabs">
          {['All', 'Komsos', 'Pertanian', 'Monitoring', 'Karya Bakti'].map(cat => (
            <button 
              key={cat}
              className={`filter-tab ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {canEdit && (
          <button className="btn-create" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Buat Laporan
          </button>
        )}
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {filteredReports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-image-container">
              {report.image ? (
                <img src={report.image} alt={report.title} className="report-img" />
              ) : (
                <div className="no-image">
                  <ImageIcon size={40} color="#cbd5e1" />
                  <span>Tidak ada foto</span>
                </div>
              )}
              <span className={`category-badge cat-${report.category.toLowerCase()}`}>{report.category}</span>
            </div>
            <div className="report-content">
              <div className="report-meta">
                <span className="meta-item"><Clock size={14} /> {report.date}, {report.time}</span>
                <span className="meta-item"><MapPin size={14} /> {report.location}</span>
              </div>
              <h3 className="report-title">{report.title}</h3>
              <p className="report-desc">{report.description}</p>
              <div className="report-footer" style={{ justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn-detail" onClick={() => setSelectedReport(report)}>Detail</button>
                  {canEdit && (
                    <button className="btn-detail" style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }} onClick={() => handleDelete(report.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Input Laporan Kegiatan</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Jenis Kegiatan</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
                  <option value="Komsos">Komunikasi Sosial (Komsos)</option>
                  <option value="Pertanian">Pendampingan Pertanian</option>
                  <option value="Monitoring">Monitoring Wilayah</option>
                  <option value="Karya Bakti">Karya Bakti</option>
                  <option value="Wanwil">Perlawanan Wilayah (Wanwil)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Judul Laporan</label>
                <input type="text" name="title" className="form-input" placeholder="Contoh: Komsos dengan Tokoh Agama" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Lokasi Kegiatan</label>
                <input type="text" name="location" className="form-input" placeholder="Nama Desa / Dusun" value={formData.location} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Kegiatan</label>
                <textarea name="description" className="form-textarea" rows="4" placeholder="Jelaskan detail kegiatan..." value={formData.description} onChange={handleInputChange} required></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Bukti Foto</label>
                <div className="file-upload-wrapper">
                  <input type="file" id="file-upload" className="file-upload-input" accept="image/*" onChange={handleImageUpload} />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <Camera size={20} />
                    <span>{formData.image ? 'Ganti Foto' : 'Ambil / Upload Foto'}</span>
                  </label>
                  {formData.image && <span className="file-name">Foto terpilih</span>}
                </div>
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save"><Save size={18} /> Kirim Laporan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Laporan */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detail Laporan</h3>
              <button className="close-btn" onClick={() => setSelectedReport(null)}><X size={24} /></button>
            </div>
            
            <div className="detail-body">
              {selectedReport.image && (
                <div className="detail-image-wrapper">
                  <img src={selectedReport.image} alt={selectedReport.title} />
                </div>
              )}
              
              <div className="detail-header-info">
                <span className={`category-badge cat-${selectedReport.category.toLowerCase()}`}>
                  {selectedReport.category}
                </span>
                <div className="detail-meta">
                  <span><Clock size={14} /> {selectedReport.date}, {selectedReport.time}</span>
                  <span><MapPin size={14} /> {selectedReport.location}</span>
                </div>
              </div>

              <h2 className="detail-title-text">{selectedReport.title}</h2>
              
              <div className="detail-desc-text">
                <p>{selectedReport.description}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setSelectedReport(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
