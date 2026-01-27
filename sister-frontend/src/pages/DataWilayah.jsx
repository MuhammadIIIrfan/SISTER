import { MapPin, Users, Home, Activity, Search, Filter, Download } from 'lucide-react';
import '../styles/data-wilayah.css';

export default function DataWilayah() {
  const wilayahData = [
    {
      id: 1,
      nama: 'Desa Rejo Agung',
      kecamatan: 'Way Jepara',
      luas: '25.5 km²',
      penduduk: '3,245 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Rendah'
    },
    {
      id: 2,
      nama: 'Desa Mekar Sari',
      kecamatan: 'Way Jepara',
      luas: '18.2 km²',
      penduduk: '2,156 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Rendah'
    },
    {
      id: 3,
      nama: 'Desa Marga Asih',
      kecamatan: 'Way Jepara',
      luas: '22.8 km²',
      penduduk: '2,890 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Sedang'
    },
    {
      id: 4,
      nama: 'Desa Sumber Rejeki',
      kecamatan: 'Way Jepara',
      luas: '19.5 km²',
      penduduk: '2,567 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Rendah'
    },
    {
      id: 5,
      nama: 'Desa Lestari Makmur',
      kecamatan: 'Way Jepara',
      luas: '21.0 km²',
      penduduk: '3,012 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Rendah'
    },
    {
      id: 6,
      nama: 'Desa Cahaya Baru',
      kecamatan: 'Way Jepara',
      luas: '23.7 km²',
      penduduk: '2,734 jiwa',
      status: 'Aktif',
      tingkatResiko: 'Sedang'
    }
  ];

  const statistics = [
    {
      title: 'Total Wilayah',
      value: '48 Desa',
      icon: MapPin,
      color: '#059669'
    },
    {
      title: 'Total Penduduk',
      value: '156,234 Jiwa',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Luas Wilayah',
      value: '1,245 km²',
      icon: Home,
      color: '#059669'
    },
    {
      title: 'Status Monitorng',
      value: '100%',
      icon: Activity,
      color: '#10b981'
    }
  ];

  return (
    <div className="data-wilayah-container">
      {/* Header */}
      <div className="data-header">
        <div>
          <h1 className="page-title">Data Wilayah Operasi</h1>
          <p className="page-subtitle">Informasi lengkap desa, kecamatan, penduduk, dan status keamanan wilayah</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card-wilayah">
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
      <div className="data-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Cari desa atau kecamatan..." />
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
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Desa</th>
              <th>Kecamatan</th>
              <th>Luas Wilayah</th>
              <th>Jumlah Penduduk</th>
              <th>Status</th>
              <th>Tingkat Risiko</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {wilayahData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="cell-nama">
                  <MapPin size={18} />
                  {item.nama}
                </td>
                <td>{item.kecamatan}</td>
                <td>{item.luas}</td>
                <td>
                  <Users size={16} />
                  {item.penduduk}
                </td>
                <td>
                  <span className="badge badge-success">{item.status}</span>
                </td>
                <td>
                  <span className={`badge badge-${item.tingkatResiko === 'Rendah' ? 'info' : 'warning'}`}>
                    {item.tingkatResiko}
                  </span>
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
      <div className="data-summary">
        <p>Total: <strong>{wilayahData.length}</strong> desa | Halaman 1 dari 8</p>
      </div>
    </div>
  );
}
