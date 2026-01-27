import { FileText, Download, Calendar, Eye, Share2, Printer } from 'lucide-react';
import '../styles/reports.css';

export default function Reports() {
  const reports = [
    {
      id: 1,
      title: 'Laporan Bulanan Operasional',
      month: 'Januari 2026',
      date: '31 Januari 2026',
      type: 'Operasional',
      status: 'Completed',
      size: '2.4 MB',
      author: 'Kapten Ahmad Wijaya'
    },
    {
      id: 2,
      title: 'Laporan Keamanan Wilayah',
      month: 'Desember 2025',
      date: '28 Desember 2025',
      type: 'Keamanan',
      status: 'Completed',
      size: '1.8 MB',
      author: 'Kapten Budi Santoso'
    },
    {
      id: 3,
      title: 'Evaluasi Kinerja Personel',
      month: 'Desember 2025',
      date: '27 Desember 2025',
      type: 'Personel',
      status: 'Completed',
      size: '3.1 MB',
      author: 'Mayor Suhendra'
    },
    {
      id: 4,
      title: 'Laporan Potensi Wilayah',
      month: 'November 2025',
      date: '30 November 2025',
      type: 'Wilayah',
      status: 'Completed',
      size: '2.7 MB',
      author: 'Kapten Rudi Hermawan'
    },
    {
      id: 5,
      title: 'Analisis Ancaman Keamanan',
      month: 'November 2025',
      date: '25 November 2025',
      type: 'Intelijen',
      status: 'Completed',
      size: '4.2 MB',
      author: 'Mayor Santoso'
    },
    {
      id: 6,
      title: 'Laporan Audit Finansial',
      month: 'Oktober 2025',
      date: '31 Oktober 2025',
      type: 'Finansial',
      status: 'Completed',
      size: '1.5 MB',
      author: 'Kasir Koramil'
    }
  ];

  const typeColors = {
    'Operasional': '#059669',
    'Keamanan': '#dc2626',
    'Personel': '#2563eb',
    'Wilayah': '#f59e0b',
    'Intelijen': '#8b5cf6',
    'Finansial': '#10b981'
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="page-title">Laporan & Dokumentasi</h1>
          <p className="page-subtitle">Akses dan kelola semua laporan operasional Koramil 429-09</p>
        </div>
        <button className="btn-generate">
          <FileText size={20} />
          Generate Report
        </button>
      </div>

      {/* Filter Section */}
      <div className="reports-filters">
        <div className="filter-group">
          <label className="filter-label">Tipe Laporan</label>
          <select className="filter-select">
            <option value="all">Semua Tipe</option>
            <option value="operasional">Operasional</option>
            <option value="keamanan">Keamanan</option>
            <option value="personel">Personel</option>
            <option value="wilayah">Wilayah</option>
            <option value="intelijen">Intelijen</option>
            <option value="finansial">Finansial</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Periode</label>
          <select className="filter-select">
            <option value="all">Semua Periode</option>
            <option value="january">Januari 2026</option>
            <option value="december">Desember 2025</option>
            <option value="november">November 2025</option>
            <option value="october">Oktober 2025</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select className="filter-select">
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="draft">Draft</option>
            <option value="pending">Tertunda</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-content">
              <div className="report-icon">
                <FileText size={32} />
              </div>
              <div className="report-info">
                <div className="report-title-section">
                  <h3 className="report-title">{report.title}</h3>
                  <span 
                    className="report-type"
                    style={{ backgroundColor: typeColors[report.type] + '20', color: typeColors[report.type] }}
                  >
                    {report.type}
                  </span>
                </div>
                <p className="report-details">
                  <Calendar size={14} />
                  <span>{report.date}</span>
                  <span className="separator">•</span>
                  <span>{report.size}</span>
                  <span className="separator">•</span>
                  <span>Oleh {report.author}</span>
                </p>
              </div>
            </div>

            <div className="report-actions">
              <button className="action-btn view-btn" title="View">
                <Eye size={18} />
              </button>
              <button className="action-btn download-btn" title="Download">
                <Download size={18} />
              </button>
              <button className="action-btn print-btn" title="Print">
                <Printer size={18} />
              </button>
              <button className="action-btn share-btn" title="Share">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if needed) */}
      <div className="reports-stats">
        <div className="stat-box">
          <h3>Total Laporan</h3>
          <p className="stat-value">{reports.length}</p>
        </div>
        <div className="stat-box">
          <h3>Laporan Bulan Ini</h3>
          <p className="stat-value">1</p>
        </div>
        <div className="stat-box">
          <h3>Total Dokumen</h3>
          <p className="stat-value">24</p>
        </div>
        <div className="stat-box">
          <h3>Storage Terpakai</h3>
          <p className="stat-value">156 MB</p>
        </div>
      </div>
    </div>
  );
}
