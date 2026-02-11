import { Users, Filter, Hash } from 'lucide-react';
import '../styles/personel.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

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
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="personel-controls">
        <div className="control-buttons">
          {/* Filter buttons can be added here if needed */}
        </div>
      </div>

      {/* Organogram View */}
      <div className="organogram-view">
        <div className="leadership-section">
          <h2 className="organogram-section-title">PIMPINAN</h2>
          
          {/* Danramil */}
          {danramil && (
            <div className="personel-card-modern">
              <div className="card-header-accent"></div>
              <div className="personel-main-info">
                <div className="avatar-container">
                  <img src={danramil.foto} alt={danramil.nama} className="avatar-img" />
                </div>
                <h3 className="personel-name">{danramil.nama}</h3>
                <p className="personel-rank-text">{danramil.pangkat}</p>
                <div className="nrp-pill">
                  <Hash size={12} /> <span>{danramil.nrp}</span>
                </div>
                <div className="personel-divider"></div>
                <p className="personel-jabatan">{danramil.jabatan}</p>
              </div>
            </div>
          )}

          {/* Batuud */}
          {batuud && (
            <div className="personel-card-modern">
              <div className="card-header-accent"></div>
              <div className="personel-main-info">
                <div className="avatar-container">
                  <img src={batuud.foto} alt={batuud.nama} className="avatar-img" />
                </div>
                <h3 className="personel-name">{batuud.nama}</h3>
                <p className="personel-rank-text">{batuud.pangkat}</p>
                <div className="nrp-pill">
                  <Hash size={12} /> <span>{batuud.nrp}</span>
                </div>
                <div className="personel-divider"></div>
                <p className="personel-jabatan">{batuud.jabatan}</p>
              </div>
            </div>
          )}
        </div>

        <div className="babinsa-section">
          <h2 className="organogram-section-title">BABINSA</h2>
          <div className="babinsa-grid">
            {babinsaData.map(person => (
              <div key={person.id} className="personel-card-modern">
                <div className="card-header-accent"></div>
                <div className="personel-main-info">
                  <div className="avatar-container">
                    <img src={person.foto} alt={person.nama} className="avatar-img" />
                  </div>
                  <h3 className="personel-name">{person.nama}</h3>
                  <p className="personel-rank-text">{person.pangkat}</p>
                  <div className="nrp-pill">
                    <Hash size={12} /> <span>{person.nrp}</span>
                  </div>
                  <div className="personel-divider"></div>
                  <p className="personel-jabatan">Babinsa {person.wilayah}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
