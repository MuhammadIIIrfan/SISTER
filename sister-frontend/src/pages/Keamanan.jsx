import { Shield, AlertTriangle, CheckCircle, Clock, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import '../styles/keamanan.css';

export default function Keamanan() {
  const [filter, setFilter] = useState('all');

  // Dummy Data Kejadian
  const incidents = [
    {
      id: 1,
      title: 'Pencurian Hewan Ternak',
      location: 'Desa Braja Sakti',
      date: '26 Feb 2024',
      day: '26',
      month: 'FEB',
      type: 'Kriminalitas',
      severity: 'High',
      status: 'Proses',
      description: 'Laporan kehilangan 2 ekor sapi milik warga RT 03.'
    },
    {
      id: 2,
      title: 'Konflik Batas Tanah',
      location: 'Desa Labuhan Ratu',
      date: '24 Feb 2024',
      day: '24',
      month: 'FEB',
      type: 'Sosial',
      severity: 'Medium',
      status: 'Selesai',
      description: 'Mediasi sengketa batas tanah antar tetangga berhasil didamaikan.'
    },
    {
      id: 3,
      title: 'Pohon Tumbang Menutup Jalan',
      location: 'Jalan Poros Way Jepara',
      date: '22 Feb 2024',
      day: '22',
      month: 'FEB',
      type: 'Bencana',
      severity: 'Low',
      status: 'Selesai',
      description: 'Pembersihan pohon tumbang akibat angin kencang bersama warga.'
    },
    {
      id: 4,
      title: 'Laporan Orang Asing Mencurigakan',
      location: 'Desa Braja Asri',
      date: '20 Feb 2024',
      day: '20',
      month: 'FEB',
      type: 'Keamanan',
      severity: 'Medium',
      status: 'Proses',
      description: 'Pemantauan terhadap 2 orang tidak dikenal yang menginap di kontrakan.'
    }
  ];

  const stats = [
    { title: 'Total Kejadian', value: '12', icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2' },
    { title: 'Dalam Proses', value: '3', icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Selesai', value: '9', icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
    { title: 'Patroli Rutin', value: '28', icon: Shield, color: '#3b82f6', bg: '#dbeafe' },
  ];

  return (
    <div className="keamanan-container">
      {/* Header */}
      <div className="keamanan-header">
        <div>
          <h1 className="page-title">MONITORING KEAMANAN</h1>
          <p className="page-subtitle">Laporan situasi keamanan dan ketertiban masyarakat (Kamtibmas)</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: stat.bg, color: stat.color }}>
                <Icon size={28} />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Section */}
      <div className="section-title">
        <AlertTriangle size={24} color="#ef4444" />
        <span>Laporan Kejadian Terkini</span>
      </div>

      {/* Controls (Search/Filter) - Optional but good for UX */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={20} />
          <input type="text" placeholder="Cari laporan kejadian..." />
        </div>
        <button className="btn-icon">
          <Filter size={20} /> Filter
        </button>
      </div>

      {/* Incident List */}
      <div className="incidents-list">
        {incidents.map((item) => (
          <div key={item.id} className="incident-card">
            <div className="incident-main">
              <div className="incident-date-box">
                <span className="date-day">{item.day}</span>
                <span className="date-month">{item.month}</span>
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
                      background: item.type === 'Kriminalitas' ? '#ef4444' : item.type === 'Bencana' ? '#f59e0b' : '#3b82f6'
                    }}></span>
                    <span>{item.type}</span>
                  </div>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
                  {item.description}
                </p>
              </div>
            </div>

            <div className="incident-status">
              <span className={`badge ${
                item.severity === 'High' ? 'badge-high' : 
                item.severity === 'Medium' ? 'badge-medium' : 'badge-low'
              }`}>
                {item.severity === 'High' ? 'Tingkat Tinggi' : item.severity === 'Medium' ? 'Menengah' : 'Rendah'}
              </span>
              <span className={`status-text ${
                item.status === 'Proses' ? 'status-process' : 'status-closed'
              }`}>
                {item.status === 'Proses' ? '• Sedang Ditangani' : '• Selesai'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}