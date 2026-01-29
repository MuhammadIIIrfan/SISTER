import { User, Mail, Phone, MapPin, Shield, Edit, Activity, FileText } from 'lucide-react';
import '../styles/profile.css';

export default function Profile() {
  // Dummy User Data
  const user = {
    name: 'Muhammad Irfan',
    nrp: '19654321',
    rank: 'Sersan Satu',
    position: 'Babinsa Desa Braja Sakti',
    unit: 'Koramil 429-09 Way Jepara',
    email: 'irfan@koramil.mil.id',
    phone: '0812-3456-7890',
    address: 'Asrama Koramil Way Jepara',
    joinDate: '12 Januari 2015',
    avatar: 'https://i.pravatar.cc/300?u=irfan'
  };

  const activities = [
    { id: 1, title: 'Laporan Komsos', desc: 'Mengirim laporan kegiatan Komsos dengan warga Desa Braja Sakti', time: '2 jam yang lalu', icon: FileText },
    { id: 2, title: 'Update Data Wilayah', desc: 'Memperbarui data demografi Desa Braja Sakti', time: '1 hari yang lalu', icon: MapPin },
    { id: 3, title: 'Login Sistem', desc: 'Masuk ke sistem SISTER melalui perangkat mobile', time: '1 hari yang lalu', icon: Shield },
  ];

  return (
    <div className="profile-container">
      {/* Header Cover */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-actions">
            <button className="btn-edit-profile">
              <Edit size={16} /> Edit Cover
            </button>
          </div>
        </div>
        <div className="profile-avatar-wrapper">
          <img src={user.avatar} alt={user.name} className="profile-avatar" />
        </div>
      </div>

      <div className="profile-content">
        {/* Sidebar Info */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="user-identity">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-role">{user.rank}</p>
              <span className="user-nrp">NRP. {user.nrp}</span>
            </div>
            
            <div className="info-list">
              <div className="info-item">
                <Shield size={18} className="info-icon" />
                <span>{user.position}</span>
              </div>
              <div className="info-item">
                <MapPin size={18} className="info-icon" />
                <span>{user.unit}</span>
              </div>
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <Phone size={18} className="info-icon" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Stats */}
          <div className="stats-overview">
            <div className="stat-box">
              <span className="stat-number">142</span>
              <span className="stat-label">Laporan Dibuat</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">28</span>
              <span className="stat-label">Kegiatan Bulan Ini</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">12</span>
              <span className="stat-label">Wilayah Binaan</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-card">
            <div className="section-header">
              <h3 className="section-title">Aktivitas Terakhir</h3>
              <button style={{background:'none', border:'none', color:'#059669', cursor:'pointer', fontSize:'0.9rem', fontWeight:'600'}}>Lihat Semua</button>
            </div>
            <div className="activity-list">
              {activities.map(activity => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <Icon size={20} />
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.desc}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}