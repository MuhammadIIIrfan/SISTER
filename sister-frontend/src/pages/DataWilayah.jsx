import { MapPin, Users, Home, Search, Filter, Download, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import '../styles/personel.css'; // Menggunakan style yang sama agar konsisten

export default function DataWilayah() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const filter = searchParams.get('filter');

  // Data Dummy Wilayah
  const wilayahData = [
    { id: 1, desa: 'Braja Sakti', kecamatan: 'Way Jepara', luas: '12.5 km²', penduduk: '4,500', kades: 'Budi Santoso', status: 'Aman' },
    { id: 2, desa: 'Labuhan Ratu', kecamatan: 'Way Jepara', luas: '15.2 km²', penduduk: '5,200', kades: 'Hendra Wijaya', status: 'Aman' },
    { id: 3, desa: 'Braja Asri', kecamatan: 'Way Jepara', luas: '10.8 km²', penduduk: '3,800', kades: 'Slamet Riyadi', status: 'Waspada' },
    { id: 4, desa: 'Sumber Marga', kecamatan: 'Way Jepara', luas: '11.5 km²', penduduk: '4,150', kades: 'Joko Susilo', status: 'Aman' },
    { id: 5, desa: 'Braja Yekti', kecamatan: 'Braja Selebah', luas: '14.1 km²', penduduk: '4,100', kades: 'Wawan Setiawan', status: 'Aman' },
    { id: 6, desa: 'Braja Harjosari', kecamatan: 'Braja Selebah', luas: '11.3 km²', penduduk: '3,900', kades: 'Agus Pratama', status: 'Aman' },
    { id: 7, desa: 'Braja Gemilang', kecamatan: 'Braja Selebah', luas: '13.7 km²', penduduk: '4,300', kades: 'Rudi Hartono', status: 'Aman' },
    { id: 8, desa: 'Braja Indah', kecamatan: 'Braja Selebah', luas: '12.0 km²', penduduk: '3,500', kades: 'Dedi Mulyadi', status: 'Rawan' },
  ];

  // Filter Logic
  const filteredData = wilayahData.filter(item => {
    if (filter === 'way-jepara') return item.kecamatan === 'Way Jepara';
    if (filter === 'braja-selebah') return item.kecamatan === 'Braja Selebah';
    return true;
  });

  // Judul Dinamis
  const pageTitle = filter === 'way-jepara' ? 'Data Wilayah Kec. Way Jepara' : filter === 'braja-selebah' ? 'Data Wilayah Kec. Braja Selebah' : 'Data Teritorial Wilayah';
  const pageSubtitle = filter ? `Daftar desa dan kondisi wilayah di Kecamatan ${filter === 'way-jepara' ? 'Way Jepara' : 'Braja Selebah'}` : 'Data lengkap seluruh wilayah teritorial Koramil 429-09';

  const statistics = [
    {
      title: 'Total Desa',
      value: filteredData.length,
      icon: Home,
      color: '#059669'
    },
    {
      title: 'Total Penduduk',
      value: '29,450', // Static for demo
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'Luas Wilayah',
      value: '101 km²',
      icon: MapPin,
      color: '#f59e0b'
    },
    {
      title: 'Titik Rawan',
      value: filteredData.filter(d => d.status !== 'Aman').length,
      icon: AlertTriangle,
      color: '#ef4444'
    }
  ];

  return (
    <div className="personel-container">
      {/* Header */}
      <div className="personel-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card-personel">
              <div className="stat-icon" style={{ color: stat.color }}>
                <IconComponent size={28} />
              </div>
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="personel-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Cari nama desa..." />
        </div>
        <div className="control-buttons">
          <button className="btn-icon">
            <Filter size={20} />
            Filter
          </button>
          <button className="btn-icon">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="personel-table-wrapper">
        <table className="personel-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Desa</th>
              <th>Kecamatan</th>
              <th>Luas Wilayah</th>
              <th>Jumlah Penduduk</th>
              <th>Kepala Desa</th>
              <th>Status Keamanan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="cell-nama" style={{fontWeight: '600'}}>{item.desa}</td>
                <td>{item.kecamatan}</td>
                <td>{item.luas}</td>
                <td>{item.penduduk} Jiwa</td>
                <td>{item.kades}</td>
                <td>
                  <span className={`badge ${item.status === 'Aman' ? 'badge-success' : 'badge-primary'}`} style={item.status !== 'Aman' ? {backgroundColor: '#fee2e2', color: '#dc2626'} : {}}>{item.status}</span>
                </td>
                <td>
                  <button className="btn-action">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="personel-summary">
        <p>Total: <strong>{filteredData.length}</strong> desa ditampilkan</p>
      </div>
    </div>
  );
}