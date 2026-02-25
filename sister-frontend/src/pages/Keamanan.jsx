import { Shield, AlertTriangle, CheckCircle, Clock, MapPin, Calendar, Search, Filter, Target, Users, Plus, X, Save, Edit, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/keamanan.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Keamanan() {
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State untuk Laporan Baru
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Ideologi',
    description: '',
    reporter: ''
  });

  // Cek User Login dari LocalStorage untuk hak akses edit
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canEdit = user && (user.role === 'danramil' || user.role === 'babinsa');

  // Fetch Data dari Backend
  const fetchIncidents = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/incidents');
        const data = await res.json();
        setIncidents(data);
    } catch (err) {
        console.error("Error fetching incidents:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch('http://localhost:5000/api/incidents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            setNotification({ type: 'success', message: 'Laporan berhasil dikirim!' });
            setIsModalOpen(false);
            setFormData({ title: '', location: '', type: 'Ideologi', description: '', reporter: '' });
            fetchIncidents();
        } else {
            const errorData = await res.json().catch(() => ({}));
            setNotification({ type: 'error', message: errorData.message || 'Gagal mengirim laporan.' });
        }
    } catch (err) {
        console.error("Submit Error:", err);
        setNotification({ type: 'error', message: 'Gagal terhubung ke server.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, field, value) => {
    const currentItem = incidents.find(i => i.id === id);
    const payload = {
        severity: field === 'severity' ? value : currentItem.severity,
        status: field === 'status' ? value : currentItem.status
    };

    try {
        await fetch(`http://localhost:5000/api/incidents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        fetchIncidents(); // Refresh data
    } catch (err) {
        console.error("Gagal update:", err);
    }
  };

  const parseDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <div className="keamanan-container">
      {/* Header */}
      <div className="keamanan-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">SISTEM PERTAHANAN WILAYAH</h1>
          <p className="page-subtitle">Monitoring Geografi, Demografi, dan Kondisi Sosial (Ipoleksosbudhankam)</p>
        </div>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed', top: '90px', right: '20px', padding: '1rem 1.5rem',
          borderRadius: '12px', backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tombol Lapor Besar (Hanya untuk Masyarakat Umum / Belum Login) */}
      {!user && (
        <div className="report-action-container">
          <button className="btn-create-report-large" onClick={() => setIsModalOpen(true)}>
            <div className="btn-icon-large"><Plus size={32} /></div>
            <div className="btn-text-large">
              <span className="btn-title">LAPOR KEJADIAN</span>
              <span className="btn-subtitle">Laporkan hal mencurigakan atau ancaman di sekitar Anda</span>
            </div>
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="section-title">
        <Target size={24} color="#ef4444" />
        <span style={{flex: 1}}>Deteksi & Cegah Dini</span>
      </div>

      {/* Controls (Search/Filter) - Optional but good for UX */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={20} />
          <input type="text" placeholder="Cari data ancaman / kejadian..." />
        </div>
        <button className="btn-icon">
          <Filter size={20} /> Filter
        </button>
      </div>

      {/* Incident List */}
      <div className="incidents-list">
        {incidents.map((item) => {
          const { day, month } = parseDate(item.date);
          return (
          <div key={item.id} className="incident-card">
            <div className="incident-main">
              <div className="incident-date-box">
                <span className="date-day">{day}</span>
                <span className="date-month">{month}</span>
              </div>
              <div className="incident-info">
                <h3>{item.title}</h3>
                <div className="incident-meta">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{item.location}</span>
                  </div>
                  <div className="meta-item">
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: item.type === 'Ideologi' ? '#ef4444' : item.type === 'Bencana' ? '#f59e0b' : '#3b82f6'
                    }}></span>
                    <span>{item.type}</span>
                  </div>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                  {item.description}
                </p>
                <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                    Pelapor: {item.reporter || 'Anonim'}
                </div>
              </div>
            </div>

            <div className="incident-status">
              {canEdit ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'}}>
                    <select 
                        className={`badge-select ${item.severity === 'Siaga' ? 'bg-red' : item.severity === 'Waspada' ? 'bg-orange' : 'bg-green'}`}
                        value={item.severity}
                        onChange={(e) => handleUpdateStatus(item.id, 'severity', e.target.value)}
                    >
                        <option value="Aman">Aman</option>
                        <option value="Waspada">Waspada</option>
                        <option value="Siaga">Siaga</option>
                    </select>
                    
                    <select 
                        className="status-select"
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, 'status', e.target.value)}
                    >
                        <option value="Baru">Baru</option>
                        <option value="Proses">Proses</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
              ) : (
                <>
                  <span className={`badge ${
                    item.severity === 'Siaga' ? 'badge-high' : 
                    item.severity === 'Waspada' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {item.severity}
                  </span>
                  <span className={`status-text ${
                    item.status === 'Proses' ? 'status-process' : item.status === 'Selesai' ? 'status-closed' : 'status-open'
                  }`}>
                    • {item.status}
                  </span>
                </>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal Lapor */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Lapor Kejadian / Ancaman</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Judul Laporan</label>
                <input type="text" name="title" className="form-input" placeholder="Contoh: Orang Mencurigakan" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Lokasi</label>
                <input type="text" name="location" className="form-input" placeholder="Desa / Dusun" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Ancaman (Ipoleksosbudhankam)</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                  <option value="Ideologi">Ideologi (Radikalisme, dll)</option>
                  <option value="Politik">Politik</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Sosial">Sosial Budaya</option>
                  <option value="Pertahanan">Pertahanan</option>
                  <option value="Keamanan">Keamanan (Kriminal, dll)</option>
                  <option value="Bencana">Bencana Alam</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi Singkat</label>
                <textarea name="description" className="form-textarea" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Nama Pelapor (Boleh Kosong)</label>
                <input type="text" name="reporter" className="form-input" placeholder="Nama Anda" value={formData.reporter} onChange={handleInputChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {isSubmitting ? ' Mengirim...' : ' Kirim Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}