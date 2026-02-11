{/* Section Laporan Giat Babinsa */}
<div className="dashboard-section" style={{ marginTop: '3rem' }}>
  <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>Laporan Giat Babinsa Terkini</h2>
      <p style={{ color: '#6b7280' }}>Update kegiatan terbaru dari lapangan</p>
    </div>
    <button 
      onClick={() => navigate('/reports')} 
      style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '0.95rem' }}
    >
      Lihat Semua <ArrowRight size={18} />
    </button>
  </div>

  <div className="latest-reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
    {latestReports.length > 0 ? (
      latestReports.map(report => (
        <div key={report.id} className="report-card-mini" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.2s' }}>
          <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
            {report.image ? (
              <img src={report.image} alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexDirection: 'column', gap: '8px' }}>
                <span>Tidak ada foto</span>
              </div>
            )}
            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {report.category}
            </span>
          </div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {report.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {report.location}</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>{report.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
              {report.description}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280', background: '#f9fafb', borderRadius: '12px' }}>
        Belum ada laporan kegiatan.
      </div>
    )}
  </div>
</div>
import { useState, useEffect } from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ... di dalam komponen Dashboard ...
const navigate = useNavigate();
const [latestReports, setLatestReports] = useState([]);

useEffect(() => {
  // Fetch 3 laporan terbaru dari backend
  fetch('http://localhost:5000/api/reports?limit=3')
    .then(res => res.json())
    .then(data => setLatestReports(data))
    .catch(err => console.error("Gagal mengambil laporan:", err));
}, []);
