import { useState, useEffect } from 'react';
import { Clock, Shield, MapPin, Building2, CalendarPlus, Edit, X, Save, CheckCircle, AlertTriangle, Loader2, Download } from 'lucide-react';
import '../styles/piket.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Piket() {
  const [activeTab, setActiveTab] = useState('koramil');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM format
  // New state for excluded personnel
  const [excludedPersonnelIds, setExcludedPersonnelIds] = useState([]);
  const [allPersonnelForExclusion, setAllPersonnelForExclusion] = useState([]); // To store all personnel for the dropdown
  const [kodimDatesInput, setKodimDatesInput] = useState('');
  const [koremDatesInput, setKoremDatesInput] = useState('');

  // Mengecek apakah suatu tanggal adalah hari ini
  const checkIsToday = (isoDate) => {
    const d = new Date(isoDate);
    const today = new Date();
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear();
  };

  // Generator Jadwal Otomatis untuk 30 Hari
  const generateSchedule = (apiPersonnel = null, excludedIds = [], monthYear = null, kodimDatesStr = '', koremDatesStr = '') => {
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
    // This should be chosen from ALL available personnel (excluding Danramil),
    // regardless of daily piket exclusions.
    if (apiPersonnel && apiPersonnel.length > 0) {
        const danramilFilteredPersonnel = apiPersonnel.filter(p => p.jabatan !== 'Danramil');
        const batuudCandidate = danramilFilteredPersonnel.find(p => p.jabatan === 'Batuud');

        if (batuudCandidate) {
            const parts = batuudCandidate.nama.trim().split(' ');
            let initial = '';
            if (parts.length >= 2) { initial = (parts[0][0] || '') + (parts[1][0] || ''); }
            else if (parts.length === 1 && parts[0].length > 0) { initial = (parts[0][0] || '') + (parts[0][1] || ''); }
            koremPers = { name: batuudCandidate.nama, role: batuudCandidate.jabatan, initial: initial.toUpperCase(), rank: batuudCandidate.pangkat };
        } else if (danramilFilteredPersonnel.length > 0) {
            // Fallback if no Batuud, pick first available personnel (not Danramil)
            const firstAvailable = danramilFilteredPersonnel[0];
            const parts = firstAvailable.nama.trim().split(' ');
            let initial = '';
            if (parts.length >= 2) { initial = (parts[0][0] || '') + (parts[1][0] || ''); }
            else if (parts.length === 1 && parts[0].length > 0) { initial = (parts[0][0] || '') + (parts[0][1] || ''); }
            koremPers = { name: firstAvailable.nama, role: firstAvailable.jabatan, initial: initial.toUpperCase(), rank: firstAvailable.pangkat };
        }
    }
    // Absolute fallback for Korem personnel if no API personnel or no suitable candidate found
    if (!koremPers) {
        koremPers = { name: 'Mayor Inf Suhendra', role: 'Pawas Korem', initial: 'MS', rank: 'Mayor Inf' };
    }

    // 2. Prepare the pool for DAILY piket (respecting exclusions)
    if (apiPersonnel && apiPersonnel.length > 0) {
      const filteredForDailyPiket = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !excludedIds.includes(p.id));
      if (filteredForDailyPiket.length > 0) {
        pool = filteredForDailyPiket.map(p => {
          const parts = p.nama.trim().split(' ');
          let initial = '';
          if (parts.length >= 2) { initial = (parts[0][0] || '') + (parts[1][0] || ''); }
          else if (parts.length === 1 && parts[0].length > 0) { initial = (parts[0][0] || '') + (parts[0][1] || ''); }
          return { name: p.nama, role: p.jabatan, initial: initial.toUpperCase(), id: p.id, rank: p.pangkat };
        });
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
      
      // Validasi: Pastikan ada cukup personel setelah pengecualian
      const availablePersonnelForDailyPiket = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !excludedPersonnelIds.includes(p.id));
      if (availablePersonnelForDailyPiket.length < 2) {
        setNotification({ type: 'error', message: 'Minimal 2 personel harus tersedia untuk piket harian setelah pengecualian.' });
        setIsConfirmModalOpen(false);
        return; // Hentikan proses generate
      }

      // Pass excludedPersonnelIds to generateSchedule
      const newSchedules = generateSchedule(apiPersonnel, excludedPersonnelIds, selectedMonthYear, kodimDatesInput, koremDatesInput);
      setSchedules(newSchedules); // Update state with new schedules
      localStorage.setItem('piketData', JSON.stringify(newSchedules));
      setIsConfirmModalOpen(false);
      setNotification({ type: 'success', message: 'Jadwal piket berhasil dibuat untuk bulan yang dipilih!' });
      setExcludedPersonnelIds([]); // Reset excluded personnel after generation
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
       const parts = value.trim().split(' ');
       let initial = '';
       if (parts.length >= 2) {
         initial = (parts[0][0] || '') + (parts[1][0] || '');
       } else if (parts.length === 1 && parts[0].length > 0) {
         initial = (parts[0][0] || '') + (parts[0][1] || '');
       }
       newPersonnel[index].initial = initial.toUpperCase();
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

  return (
    <div className="piket-container">
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content {
          background: white; border-radius: 16px; width: 90%; max-width: 500px;
          padding: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { margin: 0; font-size: 1.25rem; color: #1e293b; font-weight: 700; }
        .close-btn { background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { color: #ef4444; }
        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; font-size: 0.9rem; }
        .form-input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-family: inherit; }
        .form-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
        .btn-cancel { padding: 0.5rem 1rem; border: 1px solid #cbd5e1; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #475569; }
        .btn-cancel:hover { background: #f1f5f9; }
        .btn-save { padding: 0.5rem 1rem; border: none; background: #059669; color: white; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .btn-save:hover { background: #047857; }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed', top: '90px', right: '20px', padding: '1rem 1.5rem',
          borderRadius: '12px', backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', animation: 'slideIn 0.3s ease-out', fontWeight: '500'
        }}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <span>{notification.message}</span>
        </div>
      )}

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
          getActiveData().map((item) => (
            <div key={item.id} className="schedule-card">
              <div className="card-header">
                <div className="date-info">
                  <span className="day-name">{new Date(item.fullDate).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                  <span className="full-date">{item.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`status-badge ${item.isMonthly ? 'status-today' : checkIsToday(item.fullDate) ? 'status-today' : 'status-upcoming'}`}>
                    {item.isMonthly ? 'BULAN INI' : checkIsToday(item.fullDate) ? 'HARI INI' : 'AKAN DATANG'}
                  </span>
                  {user && user.role === 'danramil' && (
                    <button 
                      onClick={() => handleEditClick(item)}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Jadwal"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="personnel-list">
                {item.personnel.map((person, idx) => (
                  <div key={idx} className="personnel-item">
                    <div className="personnel-avatar">
                      {person.initial}
                    </div>
                    <div className="personnel-info">
                      <span className="personnel-name">{person.name}</span>
                      <span className="personnel-role">{person.rank ? `${person.rank} • ` : ''}{person.role}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shift-info">
                <Clock size={16} />
                <span>{item.shift}</span>
                {item.location && (
                  <>
                    <span style={{margin: '0 4px'}}>•</span>
                    <span>{item.location}</span>
                  </>
                )}
              </div>
            </div>
          ))
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
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#f59e0b' }}>
              <AlertTriangle size={48} />
            </div>
            <h3 className="modal-title" style={{ marginBottom: '1rem' }}>Konfirmasi Pembuatan Jadwal</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
              Jadwal piket sebelumnya akan ditimpa dan tidak dapat dikembalikan.
            </p>

            {/* Input Pemilihan Bulan dan Tahun */}
            <div className="form-group" style={{ textAlign: 'left', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.8rem' }}>Pilih Bulan & Tahun Jadwal:</label>
                <input
                    type="month"
                    className="form-input"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                    style={{ width: '100%', textAlign: 'center', fontSize: '1.1rem', padding: '10px' }}
                    required
                />
            </div>

            {/* Input Tanggal Piket Kodim */}
            <div className="form-group" style={{ textAlign: 'left', marginTop: '1rem' }}>
                <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>Tanggal Piket Kodim (pisahkan koma, cth: 5,12,20):</label>
                <input
                    type="text"
                    className="form-input"
                    value={kodimDatesInput}
                    onChange={(e) => setKodimDatesInput(e.target.value)}
                    placeholder="Kosongkan jika tidak ada"
                    style={{ textAlign: 'center' }}
                />
            </div>

            {/* Input Tanggal Piket Korem */}
            <div className="form-group" style={{ textAlign: 'left', marginTop: '1rem' }}>
                <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem' }}>Tanggal Piket Korem (pisahkan koma, cth: 10,24):</label>
                <input
                    type="text"
                    className="form-input"
                    value={koremDatesInput}
                    onChange={(e) => setKoremDatesInput(e.target.value)}
                    placeholder="Kosongkan jika tidak ada"
                    style={{ textAlign: 'center' }}
                />
            </div>

            {/* Section for excluding personnel */}
            <div style={{ textAlign: 'left', marginTop: '1rem', marginBottom: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.8rem' }}>Kecualikan Personel dari Piket Harian:</label>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem' }}>
                    {allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').map(person => (
                        <div key={person.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id={`exclude-${person.id}`}
                                value={person.id}
                                checked={excludedPersonnelIds.includes(person.id)}
                                onChange={(e) => {
                                    const personId = person.id; // Ensure person.id is used
                                    if (e.target.checked) {
                                        setExcludedPersonnelIds(prev => [...prev, personId]);
                                    } else {
                                        setExcludedPersonnelIds(prev => prev.filter(id => id !== personId));
                                    }
                                }}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <label htmlFor={`exclude-${person.id}`} style={{ fontSize: '0.9rem', color: '#334155' }}>{person.nama} ({person.jabatan})</label>
                        </div>
                    ))}
                    {allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').length === 0 && (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>Tidak ada personel yang tersedia untuk dikecualikan.</p>
                    )}
                </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
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