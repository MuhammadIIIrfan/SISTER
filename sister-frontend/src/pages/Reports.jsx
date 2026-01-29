import { useState } from 'react';
import { FileText, Camera, MapPin, Clock, Plus, X, Save, Search, Image as ImageIcon } from 'lucide-react';
import '../styles/reports.css';

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Dummy Data History Laporan
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Komsos dengan Tokoh Masyarakat',
      category: 'Komsos',
      date: '26 Feb 2024',
      time: '09:00',
      location: 'Desa Braja Sakti',
      description: 'Melaksanakan komunikasi sosial dengan Bapak Haji Suparman membahas keamanan lingkungan menjelang panen raya.',
      image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1000',
      status: 'Terverifikasi'
    },
    {
      id: 2,
      title: 'Pendampingan Panen Padi',
      category: 'Pertanian',
      date: '25 Feb 2024',
      time: '08:30',
      location: 'Desa Labuhan Ratu',
      description: 'Mendampingi Kelompok Tani Makmur Jaya dalam kegiatan panen padi varietas Ciherang seluas 2 hektar.',
      image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26?auto=format&fit=crop&q=80&w=1000',
      status: 'Menunggu'
    },
    {
      id: 3,
      title: 'Patroli Wilayah Rawan',
      category: 'Monitoring',
      date: '24 Feb 2024',
      time: '22:00',
      location: 'Perbatasan Hutan',
      description: 'Melaksanakan patroli malam di titik rawan perlintasan satwa liar dan pencurian kayu.',
      image: null,
      status: 'Terverifikasi'
    }
  ]);

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
      // Create fake URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: reports.length + 1,
      ...formData,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Menunggu'
    };
    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Komsos', location: '', description: '', image: null });
  };

  const filteredReports = filterCategory === 'All' 
    ? reports 
    : reports.filter(r => r.category === filterCategory);

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
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
        <button className="btn-create" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Buat Laporan
        </button>
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
              <div className="report-footer">
                <span className={`status-text status-${report.status.toLowerCase()}`}>
                  {report.status === 'Terverifikasi' ? 'Verified' : 'Pending'}
                </span>
                <button className="btn-detail">Detail</button>
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
    </div>
  );
}
