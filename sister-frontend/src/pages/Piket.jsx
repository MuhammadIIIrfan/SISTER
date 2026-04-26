import { useState, useEffect, useMemo } from 'react';
import { Clock, Shield, MapPin, Building2, CalendarPlus, Edit, X, Save, CheckCircle, AlertTriangle, Loader2, Download } from 'lucide-react';
import '../styles/piket.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

// --- Helper Functions & Sub-components ---

// Helper function to get initials from a name, matching the original logic.
const getInitial = (name) => {
  if (!name || typeof name !== 'string') return '??';
  const parts = name.trim().split(' ');
  let initial = '';
  if (parts.length >= 2) {
    initial = (parts[0][0] || '') + (parts[1][0] || '');
  } else if (parts.length === 1 && parts[0].length > 0) {
    initial = (parts[0][0] || '') + (parts[0][1] || '');
  }
  return initial.toUpperCase();
};

// Helper function to check if a date is today
const checkIsToday = (isoDate) => {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  const today = new Date();
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// Component for a single personnel item in a card
const PersonnelItem = ({ person }) => (
  <div className="personnel-item">
    <div className="personnel-avatar">{person.initial}</div>
    <div className="personnel-info">
      <span className="personnel-name">{person.name}</span>
      <span className="personnel-role">{person.rank ? `${person.rank} • ` : ''}{person.role}</span>
    </div>
  </div>
);

// Component for the notification popup
const NotificationPopup = ({ notification }) => {
  if (!notification) return null;
  return (
    <div className={`notification-popup ${notification.type === 'success' ? 'success' : 'error'}`}>
      {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
      <span>{notification.message}</span>
    </div>
  );
};

// --- Main Component ---

export default function Piket() {
  const [activeTab, setActiveTab] = useState('koramil');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM format
  // New state for excluded personnel
  const [excludedPersonnelIds, setExcludedPersonnelIds] = useState([]);
  const [koremPiketPersonelId, setKoremPiketPersonelId] = useState('');
  const [allPersonnelForExclusion, setAllPersonnelForExclusion] = useState([]); // To store all personnel for the dropdown
  const [kodimDatesInput, setKodimDatesInput] = useState('');
  const [koremDatesInput, setKoremDatesInput] = useState('');

  // Generator Jadwal Otomatis untuk 30 Hari
  const generateSchedule = (apiPersonnel = null, excludedIds = [], monthYear = null, kodimDatesStr = '', koremDatesStr = '', koremPiketId = null) => {
    const newSchedules = { koramil: [], kodim: [], korem: [] };

    const parseDates = (str) => {
      if (!str) return [];
      return str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 31);
    };
    const kodimDays = parseDates(kodimDatesStr);
    const koremDays = parseDates(koremDatesStr);
    
    let year, month;
    if (monthYear) {
      const [y, m] = monthYear.split('-');
      year = parseInt(y, 10);
      month = parseInt(m, 10) - 1; // getMonth() adalah 0-indexed di JavaScript
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }
    
    const startDate = new Date(year, month, 1);

    let pool = [];
    let koremPers = null;

    // 1. Determine Korem Personnel (Pawas Korem)
    // Determine Korem Personnel (Pawas Korem) based on selection
    if (apiPersonnel && apiPersonnel.length > 0 && koremPiketId) {
        const selectedKoremPerson = apiPersonnel.find(p => p.id === koremPiketId);
        if (selectedKoremPerson) {
            koremPers = { name: selectedKoremPerson.nama, role: 'Pawas Korem', initial: getInitial(selectedKoremPerson.nama), rank: selectedKoremPerson.pangkat };
        }
    }

    // Fallback if no person is selected or found
    if (!koremPers) {
        koremPers = { name: 'Belum Ditentukan', role: 'Pawas Korem', initial: '??', rank: '-' };
    }

    // 2. Prepare the pool for DAILY piket (respecting exclusions)
    if (apiPersonnel && apiPersonnel.length > 0) {
      const filteredForDailyPiket = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !excludedIds.includes(p.id));
      if (filteredForDailyPiket.length > 0) {
        pool = filteredForDailyPiket.map(p => ({
          name: p.nama,
          role: p.jabatan,
          initial: getInitial(p.nama),
          id: p.id,
          rank: p.pangkat
        }));
      }
    }

    // 3. Fallback for daily piket pool if it's empty after filtering/exclusion
    if (pool.length === 0) {
      const defaultKoramil = [
        { name: 'Serka Dedi Mulyadi', role: 'Ba Jaga', initial: 'DM', rank: 'Serka' },
        { name: 'Kopda Rian Saputra', role: 'Ta Jaga', initial: 'RS', rank: 'Kopda' },
        { name: 'Sertu Agus Pratama', role: 'Ba Jaga', initial: 'AP', rank: 'Sertu' },
        { name: 'Praka Dimas', role: 'Ta Jaga', initial: 'PD', rank: 'Praka' },
        { name: 'Serda Tono', role: 'Ba Jaga', initial: 'ST', rank: 'Serda' },
        { name: 'Kopka Yudi', role: 'Ta Jaga', initial: 'KY', rank: 'Kopka' }
      ];
      const defaultKodim = [
        { name: 'Peltu Budi Santoso', role: 'Pa Jaga', initial: 'BS', rank: 'Peltu' },
        { name: 'Serma Hendra', role: 'Ba Jaga', initial: 'SH', rank: 'Serma' },
        { name: 'Kopda Arif', role: 'Ta Jaga', initial: 'KA', rank: 'Kopda' },
        { name: 'Pelda Kurniawan', role: 'Pa Jaga', initial: 'PK', rank: 'Pelda' },
        { name: 'Sertu Bowo', role: 'Ba Jaga', initial: 'SB', rank: 'Sertu' },
        { name: 'Praka Eko', role: 'Ta Jaga', initial: 'PE', rank: 'Praka' }
      ];
      pool = [...defaultKoramil, ...defaultKodim];
    }

    // Generate Jadwal Korem (hanya pada tanggal spesifik yang dipilih)
    koremDays.forEach((d, idx) => {
      const date = new Date(year, month, d);
      if (date.getMonth() !== month) return; // Abaikan jika tanggal tidak valid (cth: 31 Feb)
      
      newSchedules.korem.push({
        id: `korem-${d}-${idx}`,
        day: date.toLocaleDateString('id-ID', { weekday: 'long' }),
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        fullDate: date.toISOString(),
        shift: '08:00 - 08:00 (24 Jam)',
        location: 'Makorem 043/Gatam',
        personnel: [koremPers]
      });
    });
    // Urutkan jadwal korem berdasarkan tanggal
    newSchedules.korem.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the selected month
    // Algoritma Greedy: Lacak jumlah shift setiap personel untuk memastikan pembagian adil
    const shiftCounts = {};
    pool.forEach(p => { shiftCounts[p.name] = 0; });

    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const currentDay = i + 1;
      const date = new Date(year, month, currentDay); // Start from 1st of the month
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const dayStr = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const fullDate = date.toISOString();

      // Handle case where pool might be empty after exclusion
      if (pool.length === 0) {
          newSchedules.koramil.push({
              id: `koramil-${i}`,
              day: dayStr,
              date: dateStr,
              fullDate: fullDate,
              shift: '08:00 - 08:00 (24 Jam)',
              personnel: [{ name: 'Tidak Ada Personel', role: 'Kosong', initial: 'NA', rank: '-' }]
          });
          // Tetap pastikan Kodim dicek walau kosong
          if (kodimDays.includes(currentDay)) {
              newSchedules.kodim.push({
                  id: `kodim-${i}`,
                  day: dayStr,
                  date: dateStr,
                  fullDate: fullDate,
                  shift: '08:00 - 08:00 (24 Jam)',
                  personnel: [{ name: 'Tidak Ada Personel', role: 'Kosong', initial: 'NA', rank: '-' }]
              });
          }
          continue; // Skip to next day
      }

      // Greedy Choice untuk Koramil
      pool.sort((a, b) => (shiftCounts[a.name] - shiftCounts[b.name]) || a.name.localeCompare(b.name));
      const personKoramil = pool[0];
      shiftCounts[personKoramil.name]++;

      newSchedules.koramil.push({
        id: `koramil-${i}`,
        day: dayStr,
        date: dateStr,
        fullDate: fullDate,
        shift: '08:00 - 08:00 (24 Jam)',
        personnel: [personKoramil]
      });

      // Jika hari ini ada jadwal Kodim
      if (kodimDays.includes(currentDay)) {
        pool.sort((a, b) => (shiftCounts[a.name] - shiftCounts[b.name]) || a.name.localeCompare(b.name));
        const personKodim = pool[0];
        shiftCounts[personKodim.name]++;

        newSchedules.kodim.push({
          id: `kodim-${i}`,
          day: dayStr,
          date: dateStr,
          fullDate: fullDate,
          shift: '08:00 - 08:00 (24 Jam)',
          personnel: [personKodim]
        });
      }
    }
    return newSchedules;
  };

  // Mengambil state jadwal dari localStorage, atau render default jika kosong
  const [schedules, setSchedules] = useState(() => {
    // Initial state will be set by the useEffect after fetching personnel
    return localStorage.getItem('piketData') ? JSON.parse(localStorage.getItem('piketData')) : { koramil: [], kodim: [], korem: [] };
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Auto-hide notification setelah 3 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch all personnel for the exclusion list and initial schedule when component mounts
  useEffect(() => {
    const fetchPersonelAndInitSchedule = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/personel');
            const data = await res.json();
            setAllPersonnelForExclusion(data);

            // Pre-select Batuud for Korem duty if available
            const batuud = data.find(p => p.jabatan === 'Batuud');
            if (batuud) {
                setKoremPiketPersonelId(batuud.id);
            }
            
            // Generate initial schedule if none saved, using fetched personnel
            if (!localStorage.getItem('piketData')) {
                const currentMonthYear = new Date().toISOString().substring(0, 7);
                const initialSchedules = generateSchedule(data, [], currentMonthYear, '5, 15, 25', '10, 20');
                setSchedules(initialSchedules);
                localStorage.setItem('piketData', JSON.stringify(initialSchedules));
            }
        }
        catch (err) {
            console.error("Error fetching all personnel for exclusion:", err);
            // If fetching personnel fails, still try to generate with default data
            if (!localStorage.getItem('piketData')) {
                const currentMonthYear = new Date().toISOString().substring(0, 7);
                const initialSchedules = generateSchedule(null, [], currentMonthYear, '5, 15, 25', '10, 20'); // Pass null for apiPersonnel
                setSchedules(initialSchedules);
                localStorage.setItem('piketData', JSON.stringify(initialSchedules));
            }
        }
    };
    fetchPersonelAndInitSchedule();
  }, []); // Empty dependency array means it runs once on mount

  const executeCreateSchedule = async () => {
    setIsGenerating(true);
    try {
      // Ambil struktur personel langsung dari API Backend
      const res = await fetch('http://localhost:5000/api/personel');
      const apiPersonnel = await res.json();
      
      // Validasi: Pastikan personel piket Korem dipilih
      if (!koremPiketPersonelId) {
        setNotification({ type: 'error', message: 'Silakan pilih personel untuk piket Korem.' });
        setIsConfirmModalOpen(false);
        setIsGenerating(false);
        return;
      }

      // Validasi: Pastikan ada cukup personel setelah pengecualian
      const availablePersonnelForDailyPiket = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !excludedPersonnelIds.includes(p.id));
      if (availablePersonnelForDailyPiket.length < 2) {
        setNotification({ type: 'error', message: 'Minimal 2 personel harus tersedia untuk piket harian setelah pengecualian.' });
        setIsConfirmModalOpen(false);
        return; // Hentikan proses generate
      }

      // Pass excludedPersonnelIds to generateSchedule
      const newSchedules = generateSchedule(apiPersonnel, excludedPersonnelIds, selectedMonthYear, kodimDatesInput, koremDatesInput, koremPiketPersonelId);
      setSchedules(newSchedules); // Update state with new schedules
      localStorage.setItem('piketData', JSON.stringify(newSchedules));
      setIsConfirmModalOpen(false);
      setNotification({ type: 'success', message: 'Jadwal piket berhasil dibuat untuk bulan yang dipilih!' });
      setExcludedPersonnelIds([]); // Reset excluded personnel after generation
      // Reset Korem selection to default (Batuud)
      const batuud = apiPersonnel.find(p => p.jabatan === 'Batuud');
      if (batuud) {
        setKoremPiketPersonelId(batuud.id);
      }
    } catch (err) {
      console.error("Gagal fetch personel:", err);
      setIsConfirmModalOpen(false);
      setNotification({ type: 'error', message: 'Gagal mengambil data personel. Pastikan server backend berjalan.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // State untuk form edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const handleEditClick = (item) => {
    // Buat deep copy dari array personnel agar tidak merubah state utama secara langsung
    setEditFormData({
      ...item,
      personnel: item.personnel.map(p => ({ ...p }))
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedSchedules = { ...schedules };
    const index = updatedSchedules[activeTab].findIndex(s => s.id === editFormData.id);
    if (index !== -1) {
      updatedSchedules[activeTab][index] = editFormData;
      setSchedules(updatedSchedules);
      localStorage.setItem('piketData', JSON.stringify(updatedSchedules));
      setIsEditModalOpen(false);
      alert('Jadwal piket berhasil diperbarui!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonnelChange = (index, field, value) => {
    const newPersonnel = [...editFormData.personnel];
    newPersonnel[index][field] = value;
    
    // Otomatis update inisial berdasarkan nama jika nama diubah
    if (field === 'name') {
       newPersonnel[index].initial = getInitial(value);
    }
    setEditFormData(prev => ({ ...prev, personnel: newPersonnel }));
  };

  const getActiveData = () => {
    let data = schedules[activeTab] || [];
    if (!user) {
      // Masyarakat umum (belum login) HANYA bisa melihat jadwal piket HARI INI (atau jadwal bulanan)
      data = data.filter(item => item.isMonthly || checkIsToday(item.fullDate));
    }
    return data;
  };

  const handleExportSchedule = () => {
    const dataToExport = getActiveData();
    const tabTitle = activeTab === 'koramil' ? 'Piket Koramil' : activeTab === 'kodim' ? 'Piket Kodim' : 'Piket Korem';
    const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Ambil data Batuud untuk tanda tangan
    const batuud = allPersonnelForExclusion.find(p => p.jabatan === 'Batuud');
    const batuudName = batuud ? batuud.nama : '_______________________';
    const batuudRank = batuud ? batuud.pangkat : '';
    const batuudNrp = batuud ? `NRP ${batuud.nrp}` : 'NRP _________________';

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Jadwal Piket ${tabTitle}</title>
          <style>
              body { font-family: 'Inter', sans-serif; margin: 20px; color: #333; font-size: 14px; }
              h1 { text-align: center; color: #1e293b; margin-bottom: 20px; }
              .schedule-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                  gap: 20px;
              }
              .schedule-card {
                  background: #ffffff;
                  border: 1px solid #e2e8f0;
                  border-radius: 12px;
                  padding: 15px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
              }
              .card-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 10px;
                  margin-bottom: 10px;
              }
              .date-info {
                  display: flex;
                  flex-direction: column;
              }
              .day-name {
                  font-weight: 700;
                  font-size: 1.1rem;
                  color: #1e293b;
              }
              .full-date {
                  font-size: 0.85rem;
                  color: #64748b;
              }
              .status-badge {
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 0.75rem;
                  font-weight: 600;
                  color: white;
              }
              .status-today { background-color: #059669; }
              .status-upcoming { background-color: #64748b; }
              .personnel-list {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
              }
              .personnel-item {
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }
              .personnel-avatar {
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background-color: #e0f2f7;
                  color: #0891b2;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 600;
                  font-size: 0.8rem;
                  flex-shrink: 0;
              }
              .personnel-info {
                  display: flex;
                  flex-direction: column;
              }
              .personnel-name {
                  font-weight: 600;
                  color: #334155;
              }
              .personnel-role {
                  font-size: 0.8rem;
                  color: #64748b;
              }
              .shift-info {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  font-size: 0.85rem;
                  color: #475569;
                  padding-top: 10px;
                  border-top: 1px dashed #e2e8f0;
              }
              /* Kop Surat Styles */
              .kop-surat {
                  display: flex; /* Keep flex for now, but change direction */
                  flex-direction: column; /* Stack logo above text */
                  align-items: center; /* Center items horizontally */
                  justify-content: center;
                  margin-bottom: 15px; /* Adjust as needed */
              }
              .kop-logo img {
                  width: 80px; /* Ukuran logo */
                  height: 80px;
                  margin-right: 20px;
              }
              .kop-identitas {
                  text-align: center; /* Ensure text is centered */
                  line-height: 1.2;
              }
              .kop-line-1, .kop-line-2 {
                  margin: 0;
                  font-size: 0.9rem;
                  font-weight: normal;
              }
              .kop-line-3 {
                  margin: 0;
                  font-size: 1.2rem;
                  font-weight: bold;
              }
              .kop-divider {
                  border: none;
                  border-top: 2px solid #333;
                  margin: 20px 0;
              }
              h1 {
                  font-size: 1.8rem; /* Ukuran judul utama */
                  text-align: center; /* Rata tengah */
                  text-transform: uppercase; /* Huruf kapital semua */
              }
              h1 small {
                  font-size: 0.6em;
                  color: #64748b;
                  text-transform: none; /* Jangan huruf kapital untuk sub-judul */
              }
              @media print {
                  body { margin: 0; }
                  .schedule-grid {
                      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                      gap: 15px;
                  }
              }
              /* Styles untuk Tanda Tangan */
              .signature-container {
                  margin-top: 60px;
                  display: flex;
                  justify-content: flex-end;
                  page-break-inside: avoid;
                  padding-right: 30px;
              }
              .signature-box {
                  text-align: center;
                  width: 280px;
              }
              .signature-space {
                  height: 90px;
              }
              .signature-name {
                  font-weight: bold;
                  text-decoration: underline;
                  margin-bottom: 4px;
              }
              .signature-details {
                  margin: 0;
                  font-size: 0.95rem;
              }
          </style>
      </head>
      <body>
          <div class="kop-surat">
              <div class="kop-logo">
                  <img src="${logoAsset}" alt="Logo Koramil" />
              </div>
              <div class="kop-identitas">
                  <p class="kop-line-1">KOMANDO DISTRIK MILITER 0429 LAMPUNG TIMUR</p>
                  <p class="kop-line-2"><strong>KORAMIL 429-09/WAY JEPARA</strong></p>
              </div>
          </div>
          <hr class="kop-divider">
          <h1>JADWAL PIKET DAN SIAGA ${tabTitle} <br><small style="font-size: 0.7em; font-weight: normal;">(Dibuat pada: ${currentDate})</small></h1>
          <div class="schedule-grid">
    `;

    dataToExport.forEach(item => {
      const statusClass = item.isMonthly || checkIsToday(item.fullDate) ? 'status-today' : 'status-upcoming';
      const statusText = item.isMonthly ? 'BULAN INI' : checkIsToday(item.fullDate) ? 'HARI INI' : 'AKAN DATANG';

      htmlContent += `
        <div class="schedule-card">
          <div class="card-header">
            <div class="date-info">
              <span class="day-name">${new Date(item.fullDate).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
              <span class="full-date">${item.date}</span>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="personnel-list">
      `;

      item.personnel.forEach(person => {
        htmlContent += `
          <div class="personnel-item">
            <div class="personnel-avatar">${person.initial}</div>
            <div class="personnel-info">
              <span class="personnel-name">${person.name}</span>
              <span class="personnel-role">${person.rank ? person.rank + ' • ' : ''}${person.role}</span>
            </div>
          </div>
        `;
      });

      htmlContent += `
          </div>
          <div class="shift-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${item.shift}</span>
            ${item.location ? `<span>•</span><span>${item.location}</span>` : ''}
          </div>
        </div>
      `;
    });

    htmlContent += `
          </div>
          
          <div class="signature-container">
              <div class="signature-box">
                  <p class="signature-details">Way Jepara, ${currentDate}</p>
                  <p class="signature-details">Mengetahui,<br>Bati TUUD</p>
                  <div class="signature-space"></div>
                  <p class="signature-name">${batuudName}</p>
                  <p class="signature-details">${batuudRank} ${batuudNrp}</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert('Gagal membuka jendela baru. Pastikan pop-up tidak diblokir.');
    }
  };

  // Component for a single schedule card, defined inside to access scope easily
  const ScheduleCard = ({ item }) => {
    const isToday = useMemo(() => checkIsToday(item.fullDate), [item.fullDate]);
    const canEdit = user && user.role === 'danramil';

    return (
      <div className="schedule-card">
        <div className="card-header">
          <div className="date-info">
            <span className="day-name">{new Date(item.fullDate).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
            <span className="full-date">{item.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-badge ${item.isMonthly || isToday ? 'status-today' : 'status-upcoming'}`}>
              {item.isMonthly ? 'BULAN INI' : isToday ? 'HARI INI' : 'AKAN DATANG'}
            </span>
            {canEdit && (
              <button
                onClick={() => handleEditClick(item)}
                className="edit-schedule-btn"
                title="Edit Jadwal"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="personnel-list">
          {item.personnel.map((person, idx) => (
            <PersonnelItem key={idx} person={person} />
          ))}
        </div>

        <div className="shift-info">
          <Clock size={16} />
          <span>{item.shift}</span>
          {item.location && (
            <>
              <span style={{ margin: '0 4px' }}>•</span>
              <span>{item.location}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="piket-container">

      {/* Notification Popup */}
      <NotificationPopup notification={notification} />

      {/* Header */}
      <div className="piket-header">
        <div>
          <img src={logoAsset} alt="Logo Korem" className="page-header-logo" />
          <h1 className="page-title">JADWAL PIKET & SIAGA</h1>
          <p className="page-subtitle">Monitoring jadwal dinas jaga Koramil, Kodim, dan Korem</p>
        </div>
      </div>

      {/* Tombol Buat Jadwal (Hanya untuk Danramil) */}
      {user && user.role === 'danramil' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setIsConfirmModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#059669', color: 'white', 
              border: 'none', padding: '12px 24px', 
              borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          > 
            <CalendarPlus size={18} /> Buat Jadwal Piket (1 Bulan)
          </button>
          <button 
            onClick={handleExportSchedule}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: '#3b82f6', color: 'white', 
              border: 'none', padding: '12px 24px', 
              borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={18} /> Export Jadwal
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="piket-tabs">
        <button 
          className={`tab-button ${activeTab === 'koramil' ? 'active' : ''}`}
          onClick={() => setActiveTab('koramil')}
        >
          <Shield size={18} /> Piket Koramil
        </button>
        <button 
          className={`tab-button ${activeTab === 'kodim' ? 'active' : ''}`}
          onClick={() => setActiveTab('kodim')}
        >
          <Building2 size={18} /> Piket Kodim
        </button>
        <button 
          className={`tab-button ${activeTab === 'korem' ? 'active' : ''}`}
          onClick={() => setActiveTab('korem')}
        >
          <MapPin size={18} /> Piket Korem
        </button>
      </div>

      {/* Content Grid */}
      <div className="schedule-grid">
        {getActiveData().length > 0 ? (
          getActiveData().map((item) => <ScheduleCard key={item.id} item={item} />)
        ) : (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#64748b'}}>
            Tidak ada jadwal piket yang tersedia untuk ditampilkan.
          </div>
        )}
      </div>

      {/* Modal Edit Jadwal Piket */}
      {isEditModalOpen && editFormData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Jadwal Piket</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Waktu Shift</label>
                <input type="text" name="shift" className="form-input" value={editFormData.shift} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Lokasi Pos</label>
                <input type="text" name="location" className="form-input" placeholder="Kosongkan jika tidak ada lokasi spesifik" value={editFormData.location || ''} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Personel Bertugas</label>
                {editFormData.personnel.map((person, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Nama Personel"
                      value={person.name} 
                      onChange={(e) => handlePersonnelChange(idx, 'name', e.target.value)} 
                      required 
                      style={{ flex: 2 }}
                    />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Pangkat"
                      value={person.rank || ''} 
                      onChange={(e) => handlePersonnelChange(idx, 'rank', e.target.value)} 
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Peran (cth: Ba Jaga)"
                      value={person.role} 
                      onChange={(e) => handlePersonnelChange(idx, 'role', e.target.value)} 
                      required 
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-save"><Save size={18} /> Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Buat Jadwal */}
      {isConfirmModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1rem', color: '#f59e0b', background: '#fffbeb', padding: '12px', borderRadius: '50%' }}>
                <AlertTriangle size={32} />
              </div>
              <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>Konfirmasi Pembuatan Jadwal</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.5', maxWidth: '450px', margin: '0 auto 2rem auto' }}>
                Jadwal piket sebelumnya akan ditimpa. Pastikan semua konfigurasi sudah benar sebelum melanjutkan.
              </p>
            </div>

            <div className="config-sections-wrapper">
                {/* Left Section: Dates */}
                <div className="config-section">
                    <div className="form-group">
                        <label className="form-label">Pilih Bulan & Tahun Jadwal</label>
                        <input
                            type="month"
                            className="form-input"
                            value={selectedMonthYear}
                            onChange={(e) => setSelectedMonthYear(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tanggal Piket Kodim</label>
                        <input
                            type="text"
                            className="form-input"
                            value={kodimDatesInput}
                            onChange={(e) => setKodimDatesInput(e.target.value)}
                            placeholder="Cth: 5, 15, 25"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tanggal Piket Korem</label>
                        <input
                            type="text"
                            className="form-input"
                            value={koremDatesInput}
                            onChange={(e) => setKoremDatesInput(e.target.value)}
                            placeholder="Cth: 10, 20"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Personel Piket Korem (Pawas)</label>
                        <select
                            className="form-input"
                            value={koremPiketPersonelId}
                            onChange={(e) => setKoremPiketPersonelId(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Pilih Personel --</option>
                            {allPersonnelForExclusion
                                .filter(p => p.jabatan !== 'Danramil')
                                .map(person => (
                                    <option key={person.id} value={person.id}>
                                        {person.nama} ({person.jabatan})
                                    </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right Section: Exclusions */}
                <div className="config-section">
                    <label className="form-label">Kecualikan Personel dari Piket Harian</label>
                    <div className="exclusion-grid-container">
                        {allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').length > 0 ? (
                            allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').map(person => (
                                <div key={person.id} className="exclusion-item">
                                    <input
                                        type="checkbox"
                                        id={`exclude-${person.id}`}
                                        className="exclusion-checkbox"
                                        checked={excludedPersonnelIds.includes(person.id)}
                                        onChange={(e) => {
                                            const personId = person.id;
                                            if (e.target.checked) {
                                                setExcludedPersonnelIds(prev => [...prev, personId]);
                                            } else {
                                                setExcludedPersonnelIds(prev => prev.filter(id => id !== personId));
                                            }
                                        }}
                                    />
                                    <label htmlFor={`exclude-${person.id}`} className="exclusion-label">
                                        <span className="exclusion-name">{person.nama}</span>
                                        <span className="exclusion-role">{person.jabatan}</span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>
                                Tidak ada personel yang tersedia untuk dikecualikan.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button type="button" className="btn-cancel" onClick={() => setIsConfirmModalOpen(false)} disabled={isGenerating}>Batal</button>
              <button type="button" className="btn-save" onClick={executeCreateSchedule} disabled={isGenerating} style={{ opacity: isGenerating ? 0.7 : 1 }}>
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <CalendarPlus size={18} />} 
                {isGenerating ? 'Memproses...' : 'Ya, Buat Jadwal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}