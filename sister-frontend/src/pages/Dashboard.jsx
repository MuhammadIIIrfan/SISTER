import { Users, MapPin, Phone, Mail, Award, Building2, Zap, BookOpen, Heart } from 'lucide-react';
import '../styles/dashboard.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';
import backgroundAsset from '../assets/koramil09.jpg';

export default function Dashboard() {
  const koramil = {
    name: 'Koramil 429-09 Way Jepara',
    location: 'Way Jepara, Lampung',
    phone: '(021) 123-4567',
    email: 'koramil429-09@mil.id',
    established: '2010'
  };

  const stats = [
    {
      title: 'Total Anggota',
      value: '1,245',
      icon: Users,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      title: 'Wilayah Operasi',
      value: '48 Desa',
      icon: MapPin,
      color: '#10b981',
      bgColor: '#f0fdf4'
    },
    {
      title: 'Status Siaga',
      value: 'Siaga I',
      icon: Zap,
      color: '#f59e0b',
      bgColor: '#fffbf0'
    },
    {
      title: 'Tahun Berdiri',
      value: '2010',
      icon: Award,
      color: '#8b5cf6',
      bgColor: '#faf5ff'
    }
  ];

  const units = [
    {
      id: 1,
      name: 'Pimpinan Koramil',
      icon: Building2,
      description: 'Kepemimpinan dan koordinasi strategis',
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Ops & Intel',
      icon: Zap,
      description: 'Operasional dan intelijen wilayah',
      color: '#10b981'
    },
    {
      id: 3,
      name: 'Personel & Admin',
      icon: Users,
      description: 'Manajemen personel dan administrasi',
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'Logistik & Supply',
      icon: Building2,
      description: 'Pengelolaan logistik dan persediaan',
      color: '#8b5cf6'
    }
  ];

  const recentActivities = [
    { id: 1, activity: 'Patroli Rutin Wilayah Operasi', time: '2 jam lalu', status: 'completed' },
    { id: 2, activity: 'Briefing Koordinasi dengan Muspika', time: '5 jam lalu', status: 'completed' },
    { id: 3, activity: 'Inspeksi Kondisi Sarana & Prasarana', time: '8 jam lalu', status: 'completed' },
    { id: 4, activity: 'Rapat Evaluasi Bulanan', time: '1 hari lalu', status: 'completed' }
  ];

  const achievements = [
    { id: 1, title: 'Penghargaan Keamanan Nasional 2023', year: '2023' },
    { id: 2, title: 'Sertifikasi ISO 9001:2015', year: '2022' },
    { id: 3, title: 'Best Military Command 2021', year: '2021' },
    { id: 4, title: 'Prestasi Terpadu Institusi Pertahanan', year: '2020' }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `linear-gradient(135deg, rgba(6, 95, 70, 0.7) 0%, rgba(4, 120, 87, 0.7) 100%), url(${backgroundAsset})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logoAsset} alt="Logo Korem" className="dashboard-logo" />
          </div>
          <div className="hero-text">
            <h1 className="hero-title">SELAMAT DATANG DI KORAMIL 0429-09 WAY JEPARA</h1>
            <p className="hero-subtitle">LAMPUNG TIMUR</p>
            <p className="hero-description">
              Komando Rayon Militer yang berkomitmen untuk keamanan, ketentraman, dan kesejahteraan masyarakat dengan profesionalisme tinggi.
            </p>
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
        <div className="hero-decoration"></div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon-wrapper"
                style={{ backgroundColor: stat.bgColor }}
              >
                <IconComponent size={28} color={stat.color} />
              </div>
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Organizational Units */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Struktur Organisasi</h2>
          <p className="section-subtitle">Unit-unit operasional Koramil 429-09</p>
        </div>
        <div className="units-grid">
          {units.map((unit) => {
            const IconComponent = unit.icon;
            return (
              <div key={unit.id} className="unit-card">
                <div 
                  className="unit-icon"
                  style={{ backgroundColor: `${unit.color}20`, borderColor: unit.color }}
                >
                  <IconComponent size={32} color={unit.color} />
                </div>
                <h3 className="unit-name">{unit.name}</h3>
                <p className="unit-description">{unit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Activities */}
        <div className="card activity-card">
          <div className="card-header">
            <h2 className="card-title">Aktivitas Terbaru</h2>
            <a href="#" className="view-all">Lihat Semua</a>
          </div>
          <div className="activity-list">
            {recentActivities.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-info">
                  <p className="activity-text">{item.activity}</p>
                  <span className="activity-time">{item.time}</span>
                </div>
                <span className={`activity-badge ${item.status}`}>
                  ✓ Selesai
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card achievements-card">
          <div className="card-header">
            <h2 className="card-title">Prestasi & Penghargaan</h2>
            <a href="#" className="view-all">Lihat Semua</a>
          </div>
          <div className="achievements-list">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">
                  <Award size={20} />
                </div>
                <div className="achievement-info">
                  <p className="achievement-title">{achievement.title}</p>
                  <span className="achievement-year">{achievement.year}</span>
                </div>
              </div>
            ))}
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