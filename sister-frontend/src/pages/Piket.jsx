import { useState } from 'react';
import { Calendar, Clock, Shield, User, MapPin, Building2 } from 'lucide-react';
import '../styles/piket.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Piket() {
  const [activeTab, setActiveTab] = useState('koramil');

  // Dummy Data Jadwal
  const schedules = {
    koramil: [
      {
        id: 1,
        day: 'Senin',
        date: '26 Feb 2024',
        isToday: true,
        shift: '08:00 - 08:00 (24 Jam)',
        personnel: [
          { name: 'Serka Dedi Mulyadi', role: 'Ba Jaga', initial: 'DM' },
          { name: 'Kopda Rian Saputra', role: 'Ta Jaga', initial: 'RS' }
        ]
      },
      {
        id: 2,
        day: 'Selasa',
        date: '27 Feb 2024',
        isToday: false,
        shift: '08:00 - 08:00 (24 Jam)',
        personnel: [
          { name: 'Sertu Agus Pratama', role: 'Ba Jaga', initial: 'AP' },
          { name: 'Praka Dimas', role: 'Ta Jaga', initial: 'PD' }
        ]
      },
      {
        id: 3,
        day: 'Rabu',
        date: '28 Feb 2024',
        isToday: false,
        shift: '08:00 - 08:00 (24 Jam)',
        personnel: [
          { name: 'Serda Tono', role: 'Ba Jaga', initial: 'ST' },
          { name: 'Kopka Yudi', role: 'Ta Jaga', initial: 'KY' }
        ]
      }
    ],
    kodim: [
      {
        id: 1,
        day: 'Senin',
        date: '26 Feb 2024',
        isToday: true,
        shift: '08:00 - 20:00',
        location: 'Pos 1 - Gerbang Utama',
        personnel: [
          { name: 'Peltu Budi Santoso', role: 'Pa Jaga', initial: 'BS' },
          { name: 'Serma Hendra', role: 'Ba Jaga', initial: 'SH' },
          { name: 'Kopda Arif', role: 'Ta Jaga', initial: 'KA' }
        ]
      },
      {
        id: 2,
        day: 'Senin',
        date: '26 Feb 2024',
        isToday: true,
        shift: '20:00 - 08:00',
        location: 'Pos 1 - Gerbang Utama',
        personnel: [
          { name: 'Pelda Kurniawan', role: 'Pa Jaga', initial: 'PK' },
          { name: 'Sertu Bowo', role: 'Ba Jaga', initial: 'SB' },
          { name: 'Praka Eko', role: 'Ta Jaga', initial: 'PE' }
        ]
      }
    ],
    korem: [
      {
        id: 1,
        day: 'Senin',
        date: '26 Feb 2024',
        isToday: true,
        shift: 'Siaga 1',
        location: 'Makorem 043/Gatam',
        personnel: [
          { name: 'Mayor Inf Suhendra', role: 'Pawas', initial: 'MS' },
          { name: 'Kapten Inf Wijaya', role: 'Pa Jaga', initial: 'KW' },
          { name: 'Tim QRF Regu A', role: 'Siaga', initial: 'QA' }
        ]
      }
    ]
  };

  const getActiveData = () => {
    return schedules[activeTab] || [];
  };

  return (
    <div className="piket-container">
      {/* Header */}
      <div className="piket-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">JADWAL PIKET & SIAGA</h1>
          <p className="page-subtitle">Monitoring jadwal dinas jaga Koramil, Kodim, dan Korem</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="piket-tabs">
        <button 
          className={`tab-button ${activeTab === 'koramil' ? 'active' : ''}`}
          onClick={() => setActiveTab('koramil')}
        >
          <Shield size={18} /> Piket Koramil
        </button>
        <button 
          className={`tab-button ${activeTab === 'kodim' ? 'active' : ''}`}
          onClick={() => setActiveTab('kodim')}
        >
          <Building2 size={18} /> Piket Kodim
        </button>
        <button 
          className={`tab-button ${activeTab === 'korem' ? 'active' : ''}`}
          onClick={() => setActiveTab('korem')}
        >
          <MapPin size={18} /> Piket Korem
        </button>
      </div>

      {/* Content Grid */}
      <div className="schedule-grid">
        {getActiveData().map((item) => (
          <div key={item.id} className="schedule-card">
            <div className="card-header">
              <div className="date-info">
                <span className="day-name">{item.day}</span>
                <span className="full-date">{item.date}</span>
              </div>
              <span className={`status-badge ${item.isToday ? 'status-today' : 'status-upcoming'}`}>
                {item.isToday ? 'HARI INI' : 'AKAN DATANG'}
              </span>
            </div>

            <div className="personnel-list">
              {item.personnel.map((person, idx) => (
                <div key={idx} className="personnel-item">
                  <div className="personnel-avatar">
                    {person.initial}
                  </div>
                  <div className="personnel-info">
                    <span className="personnel-name">{person.name}</span>
                    <span className="personnel-role">{person.role}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="shift-info">
              <Clock size={16} />
              <span>{item.shift}</span>
              {item.location && (
                <>
                  <span style={{margin: '0 4px'}}>•</span>
                  <span>{item.location}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}