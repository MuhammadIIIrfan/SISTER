import { Map, Layers, Info, MapPin, Users, X, Filter, Shield, AlertTriangle, Navigation, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/peta-spasial.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

// --- Konfigurasi Ikon Kustom untuk Peta ---
const createIcon = (iconUrl) => new L.Icon({
  iconUrl,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconBase = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png');
const iconDanger = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png');
const iconWarning = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png');
const iconSafe = createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png');

// Fallback default icon jika diperlukan
const defaultIcon = createIcon('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png');

const getMarkerIcon = (type) => {
  switch (type) {
    case 'base':
      return iconBase;
    case 'danger':
      return iconDanger;
    case 'warning':
      return iconWarning;
    case 'safe':
      return iconSafe;
    default:
      return defaultIcon;
  }
};
// --- Akhir Konfigurasi Ikon ---

// Komponen untuk mengontrol view peta (animasi flyTo) saat lokasi dipilih
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function PetaSpasial() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);

  // Cek User Login dari LocalStorage untuk hak akses
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canView = user && (user.role === 'danramil' || user.role === 'babinsa');

  if (!canView) {
    return (
      <div className="peta-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', textAlign: 'center' }}>
        <Shield size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Akses Dibatasi</h2>
        <p style={{ color: '#6b7280' }}>Halaman ini hanya dapat diakses oleh Danramil dan Babinsa.</p>
      </div>
    );
  }

  // Fetch Data Incidents dari Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Error fetching incidents:", err));
  }, []);

  // Mapping Lokasi ke Koordinat Lat/Lng (Way Jepara & Braja Selebah)
  const locationMap = {
    'Desa Braja Sakti': [-5.1820, 105.6820],
    'Desa Labuhan Ratu': [-5.1920, 105.6720],
    'Desa Braja Asri': [-5.1750, 105.6900],
    'Desa Sumber Marga': [-5.2000, 105.6800],
    'Desa Braja Yekti': [-5.2100, 105.7200],
    'Desa Braja Harjosari': [-5.2150, 105.7300],
    'Desa Braja Gemilang': [-5.2200, 105.7400],
    'Desa Braja Indah': [-5.2250, 105.7500],
    'Jalan Poros Way Jepara': [-5.1850, 105.6850]
  };

  // Gabungkan Marker Statis dan Incident
  const staticMarkers = [
    { id: 'base-1', name: 'Makoramil 429-09', type: 'base', position: [-5.177049279848184, 105.7047175231431], status: 'Operasional', coords: '-5.1770, 105.7047', desc: 'Pusat Komando Rayon Militer Way Jepara.' },
  ];

  const incidentMarkers = incidents
    .filter(i => i.status !== 'Selesai') // Hanya tampilkan kejadian aktif
    .map(inc => {
      // Prioritaskan koordinat GPS jika ada
      let pos;
      if (inc.latitude && inc.longitude) {
          pos = [inc.latitude, inc.longitude];
      } else {
          // Fallback ke random offset sekitar Way Jepara jika lokasi tidak dikenal
          pos = locationMap[inc.location] || [-5.1844 + (Math.random() - 0.5) * 0.02, 105.6836 + (Math.random() - 0.5) * 0.02];
      }
      
      let type = 'safe';
      if (inc.severity === 'Siaga') type = 'danger';
      if (inc.severity === 'Waspada') type = 'warning';
      
      return {
        id: `inc-${inc.id}`,
        name: inc.title,
        type: type,
        position: pos,
        status: inc.severity,
        coords: inc.location,
        desc: inc.description
      };
    });

  const mapMarkers = [...staticMarkers, ...incidentMarkers];

  // Data Statistik Penduduk
  const populationStats = [
    { label: 'Braja Sakti', value: 4500, max: 6000, color: '#10b981' },
    { label: 'Labuhan Ratu', value: 5200, max: 6000, color: '#3b82f6' },
    { label: 'Braja Asri', value: 3800, max: 6000, color: '#f59e0b' },
    { label: 'Sumber Marga', value: 4150, max: 6000, color: '#6366f1' },
  ];

  const getMarkerColor = (type) => {
    switch(type) {
      case 'base': return '#3b82f6'; // Biru (Markas)
      case 'danger': return '#ef4444'; // Merah (Bahaya)
      case 'warning': return '#f59e0b'; // Orange (Waspada)
      case 'safe': return '#10b981'; // Hijau (Aman)
      default: return '#64748b'; // Abu-abu
    }
  };

  const filteredMarkers = activeFilter === 'all' 
    ? mapMarkers 
    : mapMarkers.filter(m => m.type === activeFilter);

  // Tentukan pusat peta dan zoom level berdasarkan lokasi yang dipilih
  const mapCenter = selectedLocation ? selectedLocation.position : [-5.177049279848184, 105.7047175231431]; // Default: Makoramil
  const mapZoom = selectedLocation ? 15 : 13;

  return (
    <div className="peta-container">
      {/* Header */}
      <div className="peta-header">
        <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
        <h1 className="page-title">PETA SPASIAL (GIS)</h1>
        <p className="page-subtitle">
          Visualisasi kondisi wilayah Way Jepara dan Braja Selebah secara real-time untuk analisis pertahanan Wilayah.
        </p>
      </div>

      <div className="map-interface">
        {/* Map Viewer Area */}
        <div className="map-viewer">
          {/* Controls Overlay */}
          <div className="map-overlay-controls" style={{ zIndex: 1000 }}>
            <div className="filter-group">
              <button className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Semua</button>
              <button className={`filter-chip ${activeFilter === 'base' ? 'active' : ''}`} onClick={() => setActiveFilter('base')}>Posko</button>
              <button className={`filter-chip ${activeFilter === 'danger' ? 'active' : ''}`} onClick={() => setActiveFilter('danger')}>Rawan</button>
              <button className={`filter-chip ${activeFilter === 'warning' ? 'active' : ''}`} onClick={() => setActiveFilter('warning')}>Waspada</button>
              <button className={`filter-chip ${activeFilter === 'safe' ? 'active' : ''}`} onClick={() => setActiveFilter('safe')}>Aman</button>
            </div>
          </div>

          {/* OpenStreetMap via React-Leaflet */}
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render Marker pada Peta */}
            {filteredMarkers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={marker.position}
                icon={getMarkerIcon(marker.type)}
                eventHandlers={{
                  click: () => setSelectedLocation(marker),
                }}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>{marker.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{marker.type === 'base' ? 'Posko' : marker.status}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.position[0]},${selectedLocation.position[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action-map"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', marginTop: '10px' }}
                >
                  <MapPin size={16} /> Buka di Google Maps
                </a>
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

          {/* Daftar Titik Pantau (Pengganti Marker Interaktif) */}
          <div className="sidebar-card">
            <div className="sidebar-title">
              <List size={20} color="#64748b" />
              <span>Daftar Titik Pantau</span>
            </div>
            <div className="marker-list" style={{maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px'}}>
              {filteredMarkers.map(marker => (
                <div 
                  key={marker.id} 
                  className={`marker-list-item ${selectedLocation?.id === marker.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(marker)}
                  style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', background: selectedLocation?.id === marker.id ? '#f0fdf4' : 'transparent', border: selectedLocation?.id === marker.id ? '1px solid #059669' : '1px solid transparent'}}
                >
                   <div style={{color: getMarkerColor(marker.type), display: 'flex'}}>
                      {marker.type === 'base' ? <Shield size={18} /> : marker.type === 'danger' || marker.type === 'warning' ? <AlertTriangle size={18} /> : <MapPin size={18} />}
                   </div>
                   <div style={{fontSize: '0.9rem', fontWeight: '500', color: '#334155'}}>{marker.name}</div>
                </div>
              ))}
            </div>
          </div>

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
              <div className="legend-item"><div className="legend-dot" style={{background: getMarkerColor('base')}}></div> Markas</div>
              <div className="legend-item"><div className="legend-dot" style={{background: getMarkerColor('danger')}}></div> Rawan (Siaga)</div>
              <div className="legend-item"><div className="legend-dot" style={{background: getMarkerColor('warning')}}></div> Waspada</div>
              <div className="legend-item"><div className="legend-dot" style={{background: getMarkerColor('safe')}}></div> Aman</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}