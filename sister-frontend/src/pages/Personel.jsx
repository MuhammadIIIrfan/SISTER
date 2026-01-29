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
    },
    {
      id: 7,
      nama: 'Serka Dedi Mulyadi',
      nrp: '19654327',
      jabatan: 'Babinsa',
      pangkat: 'Serka',
      wilayah: 'Braja Sakti',
      status: 'Aktif',
      kontak: '081234567896',
      foto: `https://i.pravatar.cc/150?u=7`
    },
    {
      id: 8,
      nama: 'Sertu Agus Pratama',
      nrp: '19654328',
      jabatan: 'Babinsa',
      pangkat: 'Sertu',
      wilayah: 'Braja Yekti',
      status: 'Aktif',
      kontak: '081234567897',
      foto: `https://i.pravatar.cc/150?u=8`
    },
    {
      id: 9,
      nama: 'Kopda Rian Saputra',
      nrp: '19654329',
      jabatan: 'Babinsa',
      pangkat: 'Kopda',
      wilayah: 'Braja Indah',
      status: 'Aktif',
      kontak: '081234567898',
      foto: `https://i.pravatar.cc/150?u=9`
    },
    {
      id: 10,
      nama: 'Praka Dimas Anggara',
      nrp: '19654330',
      jabatan: 'Babinsa',
      pangkat: 'Praka',
      wilayah: 'Braja Harjosari',
      status: 'Aktif',
      kontak: '081234567899',
      foto: `https://i.pravatar.cc/150?u=10`
    },
    {
      id: 11,
      nama: 'Serda Tono Sutrisno',
      nrp: '19654331',
      jabatan: 'Babinsa',
      pangkat: 'Serda',
      wilayah: 'Braja Gemilang',
      status: 'Aktif',
      kontak: '081234567800',
      foto: `https://i.pravatar.cc/150?u=11`
    },
    {
      id: 12,
      nama: 'Kopka Yudi Hartono',
      nrp: '19654332',
      jabatan: 'Babinsa',
      pangkat: 'Kopka',
      wilayah: 'Labuhan Ratu',
      status: 'Aktif',
      kontak: '081234567801',
      foto: `https://i.pravatar.cc/150?u=12`
    },
    {
      id: 13,
      nama: 'Sertu Eko Prasetyo',
      nrp: '19654333',
      jabatan: 'Babinsa',
      pangkat: 'Sertu',
      wilayah: 'Braja Asri',
      status: 'Aktif',
      kontak: '081234567802',
      foto: `https://i.pravatar.cc/150?u=13`
    },
    {
      id: 14,
      nama: 'Pratu Fajar Nugroho',
      nrp: '19654334',
      jabatan: 'Babinsa',
      pangkat: 'Pratu',
      wilayah: 'Braja Selebah',
      status: 'Aktif',
      kontak: '081234567803',
      foto: `https://i.pravatar.cc/150?u=14`
    }
  ];

  const danramil = personelData.find(p => p.jabatan === 'Danramil');
  const batuud = personelData.find(p => p.jabatan === 'Batuud');
  const babinsaData = personelData.filter(p => p.jabatan === 'Babinsa');

  // Judul dinamis
  const pageTitle = 'STRUKTUR ORGANISASI PERSONEL';
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
          <h2 className="organogram-section-title">Komando & Staf</h2>
          
          {/* Danramil */}
          {danramil && (
            <div className="personel-card-organogram" style={{zIndex: 2}}>
              <div className="personel-photo">
                <img src={danramil.foto} alt={danramil.nama} />
              </div>
              <div className="personel-details">
                <h3 className="personel-name">{danramil.nama}</h3>
                <p className="personel-jabatan">{danramil.jabatan}</p>
                <span className="personel-pangkat">{danramil.pangkat}</span>
              </div>
            </div>
          )}

          {/* Garis Penghubung Vertikal */}
          <div style={{width: '2px', height: '3rem', background: '#cbd5e1'}}></div>

          {/* Batuud */}
          {batuud && (
            <div className="personel-card-organogram">
              <div className="personel-photo">
                <img src={batuud.foto} alt={batuud.nama} />
              </div>
              <div className="personel-details">
                <h3 className="personel-name">{batuud.nama}</h3>
                <p className="personel-jabatan">{batuud.jabatan}</p>
                <span className="personel-pangkat">{batuud.pangkat}</span>
              </div>
            </div>
          )}
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
