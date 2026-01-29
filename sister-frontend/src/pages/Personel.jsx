import { Users, Search, Filter } from 'lucide-react';
import '../styles/personel.css';

export default function Personel() {

  const personelData = [
    {
      id: 1,
      nama: 'Kapten Ahmad Wijaya',
      nrp: '17654321',
      jabatan: 'Danramil',
      pangkat: 'Kapten',
      wilayah: 'Way Jepara',
      status: 'Aktif',
      kontak: '081234567890',
      foto: `https://i.pravatar.cc/150?u=1`
    },
    {
      id: 2,
      nama: 'Peltu Budi Santoso',
      nrp: '18654322',
      jabatan: 'Batuud',
      pangkat: 'Peltu',
      wilayah: 'Way Jepara',
      status: 'Aktif',
      kontak: '081234567891',
      foto: `https://i.pravatar.cc/150?u=2`
    },
    {
      id: 3,
      nama: 'Sersan Rudi Hermawan',
      nrp: '19654323',
      jabatan: 'Babinsa',
      pangkat: 'Sersan',
      wilayah: 'Marga Asih',
      status: 'Aktif',
      kontak: '081234567892',
      foto: `https://i.pravatar.cc/150?u=3`
    },
    {
      id: 4,
      nama: 'Kopral Hendra Susanto',
      nrp: '19654324',
      jabatan: 'Babinsa',
      pangkat: 'Kopral',
      wilayah: 'Sumber Rejeki',
      status: 'Aktif',
      kontak: '081234567893',
      foto: `https://i.pravatar.cc/150?u=4`
    },
    {
      id: 5,
      nama: 'Serda Wisnu Wicaksono',
      nrp: '19654325',
      jabatan: 'Babinsa',
      pangkat: 'Serda',
      wilayah: 'Lestari Makmur',
      status: 'Aktif',
      kontak: '081234567894',
      foto: `https://i.pravatar.cc/150?u=5`
    },
    {
      id: 6,
      nama: 'Kopral Bambang Setiawan',
      nrp: '19654326',
      jabatan: 'Babinsa',
      pangkat: 'Kopral',
      wilayah: 'Cahaya Baru',
      status: 'Aktif',
      kontak: '081234567895',
      foto: `https://i.pravatar.cc/150?u=6`
    }
  ];

  const leadershipData = personelData.filter(p => ['Danramil', 'Batuud'].includes(p.jabatan));
  const babinsaData = personelData.filter(p => p.jabatan === 'Babinsa');

  // Judul dinamis
  const pageTitle = 'Struktur Organisasi Personel';
  const pageSubtitle = 'Struktur pimpinan dan daftar Babinsa Koramil 429-09';

  return (
    <div className="personel-container">
      {/* Header */}
      <div className="personel-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="personel-controls">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Cari nama atau NRP personel..." />
        </div>
        <div className="control-buttons">
          {/* Filter buttons can be added here if needed */}
        </div>
      </div>

      {/* Organogram View */}
      <div className="organogram-view">
        <div className="leadership-section">
          <h2 className="organogram-section-title">Pimpinan & Staf Utama</h2>
          <div className="leadership-cards">
            {leadershipData.map((person) => (
              <div key={person.id} className="personel-card-organogram">
                <div className="personel-photo">
                  <img src={person.foto} alt={person.nama} />
                </div>
                <div className="personel-details">
                  <h3 className="personel-name">{person.nama}</h3>
                  <p className="personel-jabatan">{person.jabatan}</p>
                  <span className="personel-pangkat">{person.pangkat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="organogram-divider"></div>

        <div className="babinsa-section">
          <h2 className="organogram-section-title">Bintara Pembina Desa (Babinsa)</h2>
          <div className="babinsa-grid">
            {babinsaData.map(person => (
              <div key={person.id} className="personel-card-organogram babinsa-card">
                 <div className="personel-photo">
                  <img src={person.foto} alt={person.nama} />
                </div>
                <div className="personel-details">
                  <h3 className="personel-name">{person.nama}</h3>
                  <p className="personel-jabatan">Babinsa {person.wilayah}</p>
                  <span className="personel-pangkat">{person.pangkat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
