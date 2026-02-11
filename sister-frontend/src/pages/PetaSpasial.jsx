import { Map, Layers, Info, MapPin, Users, X, Filter, Shield, AlertTriangle, Navigation } from 'lucide-react';
import { useState } from 'react';
import '../styles/peta-spasial.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function PetaSpasial() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Data Dummy untuk Marker Peta
  const mapMarkers = [
    { id: 1, name: 'Makoramil 429-09', type: 'base', top: '50%', left: '50%', status: 'Operasional', coords: '-5.1234, 105.4321', desc: 'Pusat Komando Rayon Militer Way Jepara.' },
    { id: 2, name: 'Desa Braja Sakti', type: 'safe', top: '35%', left: '65%', status: 'Aman', coords: '-5.1240, 105.4350', desc: 'Kondisi wilayah kondusif, giat siskamling aktif.' },
    { id: 3, name: 'Desa Labuhan Ratu', type: 'safe', top: '65%', left: '40%', status: 'Aman', coords: '-5.1210, 105.4290', desc: 'Wilayah pertanian produktif, situasi aman.' },
    { id: 4, name: 'Titik Rawan Banjir', type: 'danger', top: '25%', left: '35%', status: 'Waspada', coords: '-5.1190, 105.4250', desc: 'Area bantaran sungai, waspada saat curah hujan tinggi.' },
    { id: 5, name: 'Poskamling Utama', type: 'post', top: '58%', left: '75%', status: 'Aktif', coords: '-5.1250, 105.4380', desc: 'Pos ronda induk Desa Braja Sakti.' },
    { id: 6, name: 'Perbatasan Hutan', type: 'danger', top: '75%', left: '80%', status: 'Rawan', coords: '-5.1300, 105.4400', desc: 'Rawan perlintasan satwa liar dan illegal logging.' },
  ];

  // Data Statistik Penduduk
  const populationStats = [
    { label: 'Braja Sakti', value: 4500, max: 6000, color: '#10b981' },
    { label: 'Labuhan Ratu', value: 5200, max: 6000, color: '#3b82f6' },
    { label: 'Braja Asri', value: 3800, max: 6000, color: '#f59e0b' },
    { label: 'Sumber Marga', value: 4150, max: 6000, color: '#6366f1' },
  ];

  const getMarkerColor = (type) => {
    switch(type) {
      case 'base': return '#059669'; // Hijau (Markas)
      case 'danger': return '#ef4444'; // Merah (Bahaya)
      case 'post': return '#3b82f6'; // Biru (Pos)
      default: return '#10b981'; // Emerald (Aman)
    }
  };

  const getMarkerIcon = (type) => {
    switch(type) {
      case 'base': return <Shield size={24} fill="#059669" color="white" />;
      case 'danger': return <AlertTriangle size={24} fill="#ef4444" color="white" />;
      case 'post': return <MapPin size={24} fill="#3b82f6" color="white" />;
      default: return <div style={{width: 16, height: 16, background: '#10b981', borderRadius: '50%', border: '2px solid white'}}></div>;
    }
  };

  const filteredMarkers = activeFilter === 'all' 
    ? mapMarkers 
    : mapMarkers.filter(m => m.type === activeFilter);

  return (
    <div className="peta-container">
      {/* Header */}
      <div className="peta-header">
        <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
        <h1 className="page-title">PETA SPASIAL (GIS)</h1>
        <p className="page-subtitle">
          Visualisasi kondisi wilayah Way Jepara secara real-time untuk analisis pertahanan dan keamanan.
        </p>
      </div>

      <div className="map-interface">
        {/* Map Viewer Area */}
        <div className="map-viewer">
          {/* Controls Overlay */}
          <div className="map-overlay-controls">
            <div className="filter-group">
              <button className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Semua</button>
              <button className={`filter-chip ${activeFilter === 'base' ? 'active' : ''}`} onClick={() => setActiveFilter('base')}>Posko</button>
              <button className={`filter-chip ${activeFilter === 'danger' ? 'active' : ''}`} onClick={() => setActiveFilter('danger')}>Rawan</button>
              <button className={`filter-chip ${activeFilter === 'safe' ? 'active' : ''}`} onClick={() => setActiveFilter('safe')}>Aman</button>
            </div>
          </div>

          {/* Simulated Markers */}
          {filteredMarkers.map((marker) => (
            <div 
              key={marker.id} 
              className={`map-marker ${selectedLocation?.id === marker.id ? 'selected' : ''} ${marker.type === 'danger' ? 'pulse-animation' : ''}`}
              style={{ top: marker.top, left: marker.left }}
              onClick={() => setSelectedLocation(marker)}
            >
              <div className="marker-tooltip">
                {marker.name} <br/>
                <span style={{fontSize: '0.75rem', color: '#64748b'}}>{marker.status}</span>
              </div>
              <div className="marker-icon-wrapper" style={{borderColor: getMarkerColor(marker.type)}}>
                {getMarkerIcon(marker.type)}
              </div>
            </div>
          ))}

          {/* Watermark / Attribution */}
          <div style={{position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.7rem', color: '#64748b', background: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: '4px'}}>
            © OpenStreetMap contributors
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="map-sidebar">
          
          {/* Detail Lokasi Terpilih */}
          {selectedLocation ? (
            <div className="sidebar-card detail-card">
              <div className="card-header-row">
                <h3 className="sidebar-title" style={{marginBottom: 0}}>{selectedLocation.name}</h3>
                <button className="close-detail-btn" onClick={() => setSelectedLocation(null)}><X size={18}/></button>
              </div>
              <div className="detail-content">
                <div className="detail-row">
                  <Navigation size={16} color="#64748b" />
                  <span>{selectedLocation.coords}</span>
                </div>
                <div className="detail-row">
                  <Info size={16} color="#64748b" />
                  <span className={`status-badge status-${selectedLocation.type}`}>{selectedLocation.status}</span>
                </div>
                <p className="detail-desc">{selectedLocation.desc}</p>
                <button className="btn-action-map">Lihat Laporan Lengkap</button>
              </div>
            </div>
          ) : (
            <div className="sidebar-card">
              <div className="sidebar-title">
                <Map size={20} color="#059669" />
                <span>Ringkasan Wilayah</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Luas Total</span>
                <span className="stat-val">101 km²</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Jumlah Desa</span>
                <span className="stat-val">14 Desa</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Titik Rawan</span>
                <span className="stat-val" style={{color: '#ef4444'}}>2 Titik</span>
              </div>
            </div>
          )}

          {/* Ringkasan Wilayah */}

          {/* Statistik Penduduk */}
          <div className="sidebar-card">
            <div className="sidebar-title">
              <Users size={20} color="#3b82f6" />
              <span>Kepadatan Penduduk</span>
            </div>
            {populationStats.map((stat, idx) => (
              <div key={idx} className="chart-bar-container">
                <div className="chart-bar-header">
                  <span>{stat.label}</span>
                  <span style={{fontWeight: '600'}}>{stat.value}</span>
                </div>
                <div className="chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ width: `${(stat.value / stat.max) * 100}%`, background: stat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="sidebar-card">
            <div className="sidebar-title">
              <Info size={20} color="#64748b" />
              <span>Legenda Peta</span>
            </div>
            <div className="map-legend">
              <div className="legend-item"><div className="legend-dot" style={{background: '#059669'}}></div> Markas</div>
              <div className="legend-item"><div className="legend-dot" style={{background: '#10b981'}}></div> Wilayah Aman</div>
              <div className="legend-item"><div className="legend-dot" style={{background: '#ef4444'}}></div> Rawan</div>
              <div className="legend-item"><div className="legend-dot" style={{background: '#3b82f6'}}></div> Pos Jaga</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}