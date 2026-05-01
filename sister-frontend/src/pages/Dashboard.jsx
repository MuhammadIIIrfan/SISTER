import { useState, useEffect } from 'react';
import { Phone, Mail, BookOpen, Heart, Clock, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';
import backgroundAsset from '../assets/koramil09.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const [latestReports, setLatestReports] = useState([]);

  const koramil = {
    phone: '(021) 123-4567',
    email: 'koramil429-09@mil.id'
  };

  useEffect(() => {
    // Fetch 3 laporan terbaru dari backend
    fetch('http://localhost:5000/api/reports?limit=3')
      .then(res => res.json())
      .then(data => setLatestReports(data))
      .catch(err => console.error("Gagal mengambil laporan:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg-animate" style={{ backgroundImage: `url(${backgroundAsset})` }}></div>
      <div className="dashboard-bg-overlay"></div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logoAsset} alt="Logo Korem" className="dashboard-logo" />
          </div>
          <div className="hero-text">
            <h1 className="hero-title">SELAMAT DATANG DI KORAMIL 0429-09 WAY JEPARA</h1>
            <p className="hero-subtitle">LAMPUNG TIMUR</p>
          </div>

          <div className="hero-info-cards">
            <div className="hero-info-card">
              <Phone size={20} />
              <span>{koramil.phone}</span>
            </div>
            <div className="hero-info-card">
              <Mail size={20} />
              <span>{koramil.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mission-vision-grid">
        <div className="mission-card">
          <div className="mv-icon">
            <BookOpen size={32} />
          </div>
          <h3 className="mv-title">Misi Kami</h3>
          <p className="mv-description">
            Melaksanakan pembinaan teritorial, keamanan dan pertahanan, serta pemberdayaan masyarakat untuk menciptakan lingkungan yang aman, damai, dan sejahtera.
          </p>
        </div>
        <div className="vision-card">
          <div className="mv-icon">
            <Heart size={32} />
          </div>
          <h3 className="mv-title">Visi Kami</h3>
          <p className="mv-description">
            Menjadi institusi militer modern yang profesional, terpercaya, dan berdedikasi dalam melayani masyarakat dan negara dengan integritas tinggi.
          </p>
        </div>
      </div>

      {/* Section Laporan Giat Babinsa */}
      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Laporan Giat Babinsa Terkini</h2>
            <p>Update kegiatan terbaru dari lapangan</p>
          </div>
          <button onClick={() => navigate('/reports')}>
            Lihat Semua <ArrowRight size={18} />
          </button>
        </div>

        <div className="latest-reports-grid">
          {latestReports.length > 0 ? (
            latestReports.map(report => (
              <div key={report.id} className="report-card-mini" onClick={() => navigate('/reports')}>
                <div className="report-image-wrapper">
                  {report.image ? (
                    <img src={report.image} alt={report.title} />
                  ) : (
                    <div className="no-image-placeholder">
                      <ImageIcon size={48} />
                      <span>Tidak ada foto</span>
                    </div>
                  )}
                  <span className="report-category-badge">
                    {report.category}
                  </span>
                </div>
                <div className="report-content-wrapper">
                  <div className="report-meta-info">
                    <span><Clock size={14}/> {report.date}</span>
                    <span><MapPin size={14}/> {report.location}</span>
                  </div>
                  <h3 className="report-title-mini">{report.title}</h3>
                  <p className="report-desc-mini">
                    {report.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              Belum ada laporan kegiatan untuk ditampilkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}