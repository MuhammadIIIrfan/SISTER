import { Mail, Phone, MapPin, Shield, Hash, Award, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/profile.css';

export default function Profile() {
  // State untuk data user
  const [user, setUser] = useState({
    name: 'Tamu',
    nrp: '-',
    rank: '-',
    position: 'Pengunjung',
    unit: 'Koramil 429-09 Way Jepara',
    email: '-',
    phone: '-',
    address: '-',
    avatar: 'https://i.pravatar.cc/300?u=guest'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.nama || 'User',
        nrp: parsedUser.nrp || '-',
        rank: parsedUser.role === 'danramil' ? 'Kapten' : 'Sersan', // Logika sederhana mapping role ke pangkat
        position: parsedUser.jabatan || 'Anggota',
        unit: 'Koramil 429-09 Way Jepara',
        email: `${parsedUser.username}@koramil.mil.id`,
        phone: '0812-3456-7890', // Data dummy statis
        address: 'Asrama Koramil Way Jepara', // Data dummy statis
        avatar: `https://i.pravatar.cc/300?u=${parsedUser.username}`
      });
    }
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card-modern">
        {/* Decorative Header Accent */}
        <div className="card-header-accent"></div>
        
        <div className="profile-main-info">
          <div className="avatar-container">
            <img src={user.avatar} alt={user.name} className="avatar-img" />
            <div className="rank-badge-icon">
              <Award size={20} />
            </div>
          </div>
          
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-rank-text">{user.rank}</p>
          
          <div className="nrp-pill">
            <Hash size={14} /> <span>{user.nrp}</span>
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-bio-grid">
          <div className="bio-item">
            <div className="bio-icon"><Shield size={18} /></div>
            <div className="bio-content">
              <span className="bio-label">Jabatan</span>
              <span className="bio-value">{user.position}</span>
            </div>
          </div>
          <div className="bio-item">
            <div className="bio-icon"><MapPin size={18} /></div>
            <div className="bio-content">
              <span className="bio-label">Kesatuan</span>
              <span className="bio-value">{user.unit}</span>
            </div>
          </div>
          <div className="bio-item">
            <div className="bio-icon"><Mail size={18} /></div>
            <div className="bio-content">
              <span className="bio-label">Email</span>
              <span className="bio-value">{user.email}</span>
            </div>
          </div>
          <div className="bio-item">
            <div className="bio-icon"><Phone size={18} /></div>
            <div className="bio-content">
              <span className="bio-label">Telepon</span>
              <span className="bio-value">{user.phone}</span>
            </div>
          </div>
        </div>

        <div className="profile-footer-status">
          <CheckCircle2 size={16} /> <span>Status Personel: <strong>AKTIF</strong></span>
        </div>
      </div>
    </div>
  );
}