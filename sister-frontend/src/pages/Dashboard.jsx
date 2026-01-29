import { Phone, Mail, BookOpen, Heart } from 'lucide-react';
import '../styles/dashboard.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';
import backgroundAsset from '../assets/koramil09.jpg';

export default function Dashboard() {
  const koramil = {
    phone: '(021) 123-4567',
    email: 'koramil429-09@mil.id'
  };

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
    </div>
  );
}