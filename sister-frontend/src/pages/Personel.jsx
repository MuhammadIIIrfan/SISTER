import { Users, Briefcase, Award, Heart, Search, Filter, Download, Phone, Mail } from 'lucide-react';
import '../styles/personel.css';

export default function Personel() {
  const personelData = [
    {
      id: 1,
      nama: 'Kapten Ahmad Wijaya',
      nrp: '17654321',
      jabatan: 'Danrem',
      pangkat: 'Kapten',
      wilayah: 'Rejo Agung',
      status: 'Aktif',
      kontak: '081234567890'
    },
    {
      id: 2,
      nama: 'Letnan Budi Santoso',
      nrp: '18654322',
      jabatan: 'Danki',
      pangkat: 'Letnan',
      wilayah: 'Mekar Sari',
      status: 'Aktif',
      kontak: '081234567891'
    },
    {
      id: 3,
      nama: 'Sersan Rudi Hermawan',
      nrp: '19654323',
      jabatan: 'Babinsa',
      pangkat: 'Sersan',
      wilayah: 'Marga Asih',
      status: 'Aktif',
      kontak: '081234567892'
    },
    {
      id: 4,
      nama: 'Kopral Hendra Susanto',
      nrp: '19654324',
      jabatan: 'Babinsa',
      pangkat: 'Kopral',
      wilayah: 'Sumber Rejeki',
      status: 'Aktif',
      kontak: '081234567893'
    },
    {
      id: 5,
      nama: 'Serda Wisnu Wicaksono',
      nrp: '19654325',
      jabatan: 'Babinsa',
      pangkat: 'Serda',
      wilayah: 'Lestari Makmur',
      status: 'Aktif',
      kontak: '081234567894'
    },
    {
      id: 6,
      nama: 'Kopral Bambang Setiawan',
      nrp: '19654326',
      jabatan: 'Babinsa',
      pangkat: 'Kopral',
      wilayah: 'Cahaya Baru',
      status: 'Aktif',
      kontak: '081234567895'
    }
  ];

  const statistics = [
    {
      title: 'Total Personel',
      value: '1,245',
      icon: Users,
      color: '#059669'
    },
    {
      title: 'Babinsa Aktif',
      value: '48',
      icon: Briefcase,
      color: '#10b981'
    },
    {
      title: 'Personel Terlatih',
      value: '1,189',
      icon: Award,
      color: '#059669'
    },
    {
      title: 'Kepuasan Kerja',
      value: '4.8/5',
      icon: Heart,
      color: '#10b981'
    }
  ];

  return (
    <div className="personel-container">
      {/* Header */}
      <div className="personel-header">
        <div>
          <h1 className="page-title">Data Personel</h1>
          <p className="page-subtitle">Informasi lengkap Babinsa, personel, kompetensi, dan penugasan Koramil 429-09</p>
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
          <input type="text" placeholder="Cari nama atau NRP personel..." />
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
              <th>Nama Personel</th>
              <th>NRP</th>
              <th>Pangkat</th>
              <th>Jabatan</th>
              <th>Wilayah</th>
              <th>Status</th>
              <th>Kontak</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {personelData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td className="cell-nama">
                  <Users size={18} />
                  {item.nama}
                </td>
                <td>{item.nrp}</td>
                <td>
                  <span className="badge badge-primary">{item.pangkat}</span>
                </td>
                <td>{item.jabatan}</td>
                <td>{item.wilayah}</td>
                <td>
                  <span className="badge badge-success">{item.status}</span>
                </td>
                <td>
                  <div className="contact-info">
                    <Phone size={14} />
                    <span>{item.kontak}</span>
                  </div>
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
        <p>Total: <strong>{personelData.length}</strong> personel ditampilkan | Halaman 1 dari 21</p>
      </div>
    </div>
  );
}
