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
  const [excludedPersonnelIds, setExcludedPersonnelIds] = useState({ koramil: [], kodim: [] });
  const [koremPiketPersonelId, setKoremPiketPersonelId] = useState('');
  const [selectedSummaryPersonId, setSelectedSummaryPersonId] = useState('');
  const [allPersonnelForExclusion, setAllPersonnelForExclusion] = useState([]); // To store all personnel for the dropdown
  const [kodimDatesInput, setKodimDatesInput] = useState('');
  const [koremDatesInput, setKoremDatesInput] = useState('');
  const getDefaultPatroliState = () => ({
    monthYear: new Date().toISOString().substring(0, 7),
    reguDetails: [
      { name: 'Regu 1', personnel: '' },
      { name: 'Regu 2', personnel: '' },
      { name: 'Regu 3', personnel: '' },
      { name: 'Regu 4', personnel: '' }
    ],
    schedule: []
  });

  const parsePatroliData = () => {
    const saved = localStorage.getItem('patroliData');
    if (!saved) return getDefaultPatroliState();

    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') {
        localStorage.removeItem('patroliData');
        return getDefaultPatroliState();
      }

      return {
        monthYear: parsed.monthYear || new Date().toISOString().substring(0, 7),
        reguDetails: Array.isArray(parsed.reguDetails) ? parsed.reguDetails : getDefaultPatroliState().reguDetails,
        schedule: Array.isArray(parsed.schedule) ? parsed.schedule : []
      };
    } catch (err) {
      console.warn('Failed to parse patrol data from localStorage:', err);
      localStorage.removeItem('patroliData');
      return getDefaultPatroliState();
    }
  };

  const [patroliMonthYear, setPatroliMonthYear] = useState(() => parsePatroliData().monthYear);
  const [patroliReguDetails, setPatroliReguDetails] = useState(() => parsePatroliData().reguDetails);
  const [patroliScheduleData, setPatroliScheduleData] = useState(() => parsePatroliData());

  // Generator Jadwal Otomatis untuk 30 Hari
  const generateSchedule = (apiPersonnel = null, excludedIds = { koramil: [], kodim: [] }, monthYear = null, kodimDatesStr = '', koremDatesStr = '', koremPiketId = null) => {
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

    let koremPers = null;
    let koramilPool = [], kodimPool = [];

    // 1. Determine Korem Personnel (Pawas Korem)
    // Determine Korem Personnel (Pawas Korem) based on selection
    if (apiPersonnel && apiPersonnel.length > 0 && koremPiketId) {
        // Use '==' for loose comparison because koremPiketId from <select> is a string, while p.id is a number.
        const selectedKoremPerson = apiPersonnel.find(p => p.id == koremPiketId);
        if (selectedKoremPerson) {
            koremPers = { name: selectedKoremPerson.nama, role: 'Pawas Korem', initial: getInitial(selectedKoremPerson.nama), rank: selectedKoremPerson.pangkat };
        }
    }

    // Fallback if no person is selected or found
    if (!koremPers) {
        koremPers = { name: 'Belum Ditentukan', role: 'Pawas Korem', initial: '??', rank: '-' };
    }

    // 2. Prepare the pools for piket (respecting exclusions)
    if (apiPersonnel && apiPersonnel.length > 0) {
      const createPool = (excludeList) => apiPersonnel
        .filter(p => p.jabatan !== 'Danramil' && !excludeList.includes(p.id))
        .map(p => ({
          name: p.nama,
          role: p.jabatan,
          initial: getInitial(p.nama),
          id: p.id,
          rank: p.pangkat
        }));
      
      koramilPool = createPool(excludedIds.koramil || []);
      kodimPool = createPool(excludedIds.kodim || []);
    }

    // 3. Fallback for pools if they are empty after filtering/exclusion
    if (koramilPool.length === 0) {
      const defaultKoramil = [
        { name: 'Serka Dedi Mulyadi', role: 'Ba Jaga', initial: 'DM', rank: 'Serka' },
        { name: 'Kopda Rian Saputra', role: 'Ta Jaga', initial: 'RS', rank: 'Kopda' },
      ];
      koramilPool = [...defaultKoramil];
    }
    if (kodimPool.length === 0) {
      const defaultKodim = [
        { name: 'Peltu Budi Santoso', role: 'Pa Jaga', initial: 'BS', rank: 'Peltu' },
        { name: 'Serma Hendra', role: 'Ba Jaga', initial: 'SH', rank: 'Serma' },
        { name: 'Kopda Arif', role: 'Ta Jaga', initial: 'KA', rank: 'Kopda' },
        { name: 'Pelda Kurniawan', role: 'Pa Jaga', initial: 'PK', rank: 'Pelda' },
        { name: 'Sertu Bowo', role: 'Ba Jaga', initial: 'SB', rank: 'Sertu' },
        { name: 'Praka Eko', role: 'Ta Jaga', initial: 'PE', rank: 'Praka' }
      ];
      kodimPool = [...defaultKodim];
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

    // Seedable pseudo-random number generator (LCG) for deterministic shuffling
    // This ensures that for a given month/year, the shuffle order is always the same.
    function mulberry32(seed) {
        return function() {
            seed |= 0; seed = seed + 0x6D2B79F5 | 0;
            var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    // Algoritma yang disempurnakan:
    // - Menggunakan satu 'shiftCounts' untuk keadilan menyeluruh.
    // - Melacak hari piket terakhir untuk setiap personel.
    // - Menghindari konflik pada hari yang sama.
    // - Menerapkan waktu istirahat minimal 2 hari.
    const useIdAsKey = koramilPool.every(p => p.id) && kodimPool.every(p => p.id);
    const getKey = (person) => useIdAsKey ? person.id : person.name;

    const shiftCounts = {};
    const kodimShiftCounts = {};
    const lastPiketDay = {};

    // Inisialisasi data pelacakan untuk semua personel yang mungkin bertugas
    const allAvailablePersonnel = [...new Map([...koramilPool, ...kodimPool].map(item => [getKey(item), item])).values()];

    // --- LOGIKA BARU: Buat urutan acak yang berbeda setiap kali generate untuk fleksibilitas ---
    // Ini memastikan urutan acak yang berbeda setiap kali jadwal dibuat ulang, bahkan untuk bulan yang sama.
    // 1. Buat seed unik untuk bulan, tahun, dan waktu generate ini
    const seed = year * 100 + month + Math.floor(Math.random() * 1000000);
    const random = mulberry32(seed);

    // 2. Lakukan Fisher-Yates shuffle pada daftar personel untuk mendapatkan urutan acak yang deterministik
    const shuffledPersonnel = [...allAvailablePersonnel];
    for (let k = shuffledPersonnel.length - 1; k > 0; k--) {
        const j = Math.floor(random() * (k + 1));
        [shuffledPersonnel[k], shuffledPersonnel[j]] = [shuffledPersonnel[j], shuffledPersonnel[k]];
    }

    // 3. Buat Map untuk lookup urutan tie-breaker dengan cepat dari daftar yang sudah diacak
    const tieBreakerMap = new Map(shuffledPersonnel.map((p, index) => [getKey(p), index]));
    // --- AKHIR LOGIKA BARU ---

    // Inisialisasi data pelacakan untuk semua personel yang mungkin bertugas
    shuffledPersonnel.forEach(p => { // Gunakan daftar yang sudah diacak untuk inisialisasi
        const key = getKey(p);
        shiftCounts[key] = 0;
        kodimShiftCounts[key] = 0; // Tambahkan pelacakan khusus untuk piket Kodim
        lastPiketDay[key] = -99; // Inisialisasi dengan nilai rendah agar bisa langsung dapat jadwal
    });
    
    // Define a single sorting function that prioritizes:
    // 1. Fewer shifts (ascending)
    // 2. More rest days (longer gap since last piket, descending)
    // 3. Monthly pseudo-random tie-breaker (ascending)
    const sortPersonnelByPriority = (a, b, currentDay) => {
        const keyA = getKey(a);
        const keyB = getKey(b);

        // Priority 1: Fewer shifts
        const shiftDiff = shiftCounts[keyA] - shiftCounts[keyB];
        if (shiftDiff !== 0) return shiftDiff;

        // Priority 2: More rest days (longer gap since last piket)
        const restDiff = (currentDay - lastPiketDay[keyB]) - (currentDay - lastPiketDay[keyA]);
        if (restDiff !== 0) return restDiff;

        // Priority 3: Monthly pseudo-random tie-breaker
        return tieBreakerMap.get(keyA) - tieBreakerMap.get(keyB);
    };

    // New sorting function specifically for Kodim, incorporating the max 2 shifts rule
    const sortKodimPersonnel = (a, b, currentDay) => {
        const keyA = getKey(a);
        const keyB = getKey(b);

        // Primary Priority for Kodim: Fewer Kodim shifts (max 2)
        // This ensures those with 0 or 1 shifts are prioritized over those with 2 or more.
        const kodimShiftDiff = kodimShiftCounts[keyA] - kodimShiftCounts[keyB];
        if (kodimShiftDiff !== 0) return kodimShiftDiff;

        // Secondary Priority: More rest days (longer gap since last piket)
        const restDiff = (currentDay - lastPiketDay[keyB]) - (currentDay - lastPiketDay[keyA]);
        if (restDiff !== 0) return restDiff;

        // Tertiary Priority: Fewer total shifts (as a tie-breaker for rest days)
        const shiftDiff = shiftCounts[keyA] - shiftCounts[keyB];
        if (shiftDiff !== 0) return shiftDiff;

        // Quaternary Priority: Monthly pseudo-random tie-breaker
        return tieBreakerMap.get(keyA) - tieBreakerMap.get(keyB);
    };


    for (let i = 0; i < numberOfDaysInMonth; i++) {
      const currentDay = i + 1;
      const date = new Date(year, month, currentDay);
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const dayStr = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const fullDate = date.toISOString();

      let personsOnKodimDutyTodayKeys = [];

      // Prioritaskan penjadwalan Kodim (1 orang per hari)
      if (kodimDays.includes(currentDay)) {
        if (kodimPool.length > 0) {
            let kodimPerson = null;

            // Sort all Kodim candidates using the Kodim-specific sorting logic
            // This will naturally prioritize those with < 2 shifts, then rest days, etc.
            let candidates = [...kodimPool];
            candidates.sort((a, b) => sortKodimPersonnel(a, b, currentDay));
            
            // Find the first candidate who has less than 2 Kodim shifts
            kodimPerson = candidates.find(person => kodimShiftCounts[getKey(person)] < 2);


            if (kodimPerson) {
                newSchedules.kodim.push({
                    id: `kodim-${i}`,
                    day: dayStr,
                    date: dateStr,
                    fullDate: fullDate,
                    shift: '08:00 - 08:00 (24 Jam)',
                    personnel: [kodimPerson] // Hanya satu personel
                });
                // Update data untuk setiap personel yang ditugaskan
                const key = getKey(kodimPerson);
                shiftCounts[key]++;
                kodimShiftCounts[key]++; // Increment Kodim-specific count
                lastPiketDay[key] = currentDay;
                personsOnKodimDutyTodayKeys.push(key); // Ini akan berisi hanya satu kunci
            } else {
                // Fallback jika tidak ada personel yang tersedia (semua sudah 2 kali piket Kodim)
                newSchedules.kodim.push({ id: `kodim-${i}`, day: dayStr, date: dateStr, fullDate, shift: '08:00 - 08:00 (24 Jam)', personnel: [{ name: 'Tidak Ada Personel Tersedia', role: 'Kosong', initial: 'NA', rank: '-' }] });
            }
        } else {
            // Fallback jika pool kodim kosong
            newSchedules.kodim.push({ id: `kodim-${i}`, day: dayStr, date: dateStr, fullDate, shift: '08:00 - 08:00 (24 Jam)', personnel: [{ name: 'Tidak Ada Personel', role: 'Kosong', initial: 'NA', rank: '-' }] });
        }
      }

      // Jadwalkan Piket Koramil
      if (koramilPool.length > 0) {
          let koramilPerson = null;

          // Attempt 1: Find candidates satisfying strict 3-day rest AND not on Kodim duty
          let strictKoramilCandidates = koramilPool.filter(p => 
              !personsOnKodimDutyTodayKeys.includes(getKey(p)) && 
              currentDay - lastPiketDay[getKey(p)] > 3
          );
          strictKoramilCandidates.sort((a, b) => sortPersonnelByPriority(a, b, currentDay));

          if (strictKoramilCandidates.length > 0) {
              koramilPerson = strictKoramilCandidates[0];
          } else {
              // Attempt 2: If no one satisfies strict rest, pick from all available (not on Kodim duty),
              // prioritizing fewest shifts and then longest rest, even if < 3 days.
              let allKoramilCandidates = koramilPool.filter(p => !personsOnKodimDutyTodayKeys.includes(getKey(p)));
              allKoramilCandidates.sort((a, b) => sortPersonnelByPriority(a, b, currentDay));
              koramilPerson = allKoramilCandidates[0];
          }

          if (koramilPerson) {
              const key = getKey(koramilPerson);
              newSchedules.koramil.push({
                  id: `koramil-${i}`,
                  day: dayStr,
                  date: dateStr,
                  fullDate: fullDate,
                  shift: '08:00 - 08:00 (24 Jam)',
                  personnel: [koramilPerson]
              });
              shiftCounts[key]++;
              lastPiketDay[key] = currentDay;
          } else {
              // Fallback jika tidak ada personel yang bisa ditugaskan (misal, semua orang sedang piket Kodim)
              newSchedules.koramil.push({ id: `koramil-${i}`, day: dayStr, date: dateStr, fullDate, shift: '08:00 - 08:00 (24 Jam)', personnel: [{ name: 'Konflik Jadwal', role: 'Kosong', initial: '!!', rank: '-' }] });
          }
      } else {
          // Fallback jika pool koramil kosong
          newSchedules.koramil.push({ id: `koramil-${i}`, day: dayStr, date: dateStr, fullDate, shift: '08:00 - 08:00 (24 Jam)', personnel: [{ name: 'Tidak Ada Personel', role: 'Kosong', initial: 'NA', rank: '-' }] });
      }
    }
    return newSchedules;
  };

  const generatePatroliSchedule = (monthYear, reguDetails) => {
    const [year, month] = monthYear.split('-').map((value) => parseInt(value, 10));
    const patrolDates = [];
    const date = new Date(year, month - 1, 1);

    while (date.getMonth() === month - 1) {
      if (date.getDay() === 6) {
        patrolDates.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    return patrolDates.map((d, idx) => {
      const regu = reguDetails[idx % reguDetails.length] || { name: `Regu ${idx + 1}`, personnel: '' };
      return {
        id: `patroli-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
        day: d.toLocaleDateString('id-ID', { weekday: 'long' }),
        date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        fullDate: d.toISOString(),
        shift: 'Patroli Sabtu',
        location: 'Patroli Sabtu',
        personnel: [{
          name: regu.name,
          role: regu.personnel || 'Belum ada personel',
          initial: regu.name ? regu.name.split(' ').map((s) => s[0]).join('').toUpperCase().slice(0, 2) : 'P',
          rank: ''
        }]
      };
    });
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
                const initialSchedules = generateSchedule(data, { koramil: [], kodim: [] }, currentMonthYear, '5, 15, 25', '10, 20', batuud ? batuud.id : null);
                setSchedules(initialSchedules);
                localStorage.setItem('piketData', JSON.stringify(initialSchedules));
            }
            if (!localStorage.getItem('patroliData')) {
                const patrolDefault = {
                    monthYear: new Date().toISOString().substring(0, 7),
                    reguDetails: [
                      { name: 'Regu 1', personnel: '' },
                      { name: 'Regu 2', personnel: '' },
                      { name: 'Regu 3', personnel: '' },
                      { name: 'Regu 4', personnel: '' }
                    ],
                    schedule: generatePatroliSchedule(new Date().toISOString().substring(0, 7), [
                      { name: 'Regu 1', personnel: '' },
                      { name: 'Regu 2', personnel: '' },
                      { name: 'Regu 3', personnel: '' },
                      { name: 'Regu 4', personnel: '' }
                    ])
                };
                setPatroliScheduleData(patrolDefault);
                localStorage.setItem('patroliData', JSON.stringify(patrolDefault));
            }
        }
        catch (err) {
            console.error("Error fetching all personnel for exclusion:", err);
            // If fetching personnel fails, still try to generate with default data
            if (!localStorage.getItem('piketData')) {
                const currentMonthYear = new Date().toISOString().substring(0, 7);
                const initialSchedules = generateSchedule(null, { koramil: [], kodim: [] }, currentMonthYear, '5, 15, 25', '10, 20', null); // Pass null for apiPersonnel
                setSchedules(initialSchedules);
                localStorage.setItem('piketData', JSON.stringify(initialSchedules));
            }
            if (!localStorage.getItem('patroliData')) {
                const patrolDefault = {
                    monthYear: new Date().toISOString().substring(0, 7),
                    reguDetails: [
                      { name: 'Regu 1', personnel: '' },
                      { name: 'Regu 2', personnel: '' },
                      { name: 'Regu 3', personnel: '' },
                      { name: 'Regu 4', personnel: '' }
                    ],
                    schedule: generatePatroliSchedule(new Date().toISOString().substring(0, 7), [
                      { name: 'Regu 1', personnel: '' },
                      { name: 'Regu 2', personnel: '' },
                      { name: 'Regu 3', personnel: '' },
                      { name: 'Regu 4', personnel: '' }
                    ])
                };
                setPatroliScheduleData(patrolDefault);
                localStorage.setItem('patroliData', JSON.stringify(patrolDefault));
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
      const availableForKoramil = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !(excludedPersonnelIds.koramil || []).includes(p.id));
      if (availableForKoramil.length < 1) {
        setNotification({ type: 'error', message: 'Minimal 1 personel harus tersedia untuk piket Koramil.' });
        setIsConfirmModalOpen(false);
        setIsGenerating(false);
        return;
      }
      const availableForKodim = apiPersonnel.filter(p => p.jabatan !== 'Danramil' && !(excludedPersonnelIds.kodim || []).includes(p.id));
      if (kodimDatesInput && availableForKodim.length < 1) {
        setNotification({ type: 'error', message: 'Minimal 1 personel harus tersedia untuk piket Kodim jika tanggal ditentukan.' });
        setIsConfirmModalOpen(false);
        setIsGenerating(false);
        return;
      }

      // Pass excludedPersonnelIds to generateSchedule
      const newSchedules = generateSchedule(apiPersonnel, excludedPersonnelIds, selectedMonthYear, kodimDatesInput, koremDatesInput, koremPiketPersonelId);
      setSchedules(newSchedules); // Update state with new schedules
      localStorage.setItem('piketData', JSON.stringify(newSchedules));
      setIsConfirmModalOpen(false);
      setNotification({ type: 'success', message: 'Jadwal piket berhasil dibuat untuk bulan yang dipilih!' });
      setExcludedPersonnelIds({ koramil: [], kodim: [] }); // Reset excluded personnel after generation
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

  const executeCreatePatroliSchedule = () => {
    const newSchedule = generatePatroliSchedule(patroliMonthYear, patroliReguDetails);
    const newPatroliData = {
      monthYear: patroliMonthYear,
      reguDetails: [...patroliReguDetails],
      schedule: newSchedule
    };
    setPatroliScheduleData(newPatroliData);
    localStorage.setItem('patroliData', JSON.stringify(newPatroliData));
    setNotification({ type: 'success', message: 'Jadwal patroli Sabtu berhasil dibuat.' });
  };

  // State untuk form edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const selectedSummaryPerson = useMemo(() => {
    if (!selectedSummaryPersonId) return null;
    return allPersonnelForExclusion.find((person) => person.id == selectedSummaryPersonId) || null;
  }, [selectedSummaryPersonId, allPersonnelForExclusion]);

  const scheduleSummary = useMemo(() => {
    if (!selectedSummaryPerson) return null;

    const matchesSelectedPerson = (person) => {
      if (person.id != null) {
        return person.id == selectedSummaryPerson.id;
      }
      return person.name === selectedSummaryPerson.nama;
    };

    return {
      koramil: (schedules.koramil || []).filter((item) => item.personnel.some(matchesSelectedPerson)).map((item) => item.date),
      kodim: (schedules.kodim || []).filter((item) => item.personnel.some(matchesSelectedPerson)).map((item) => item.date),
      korem: (schedules.korem || []).filter((item) => item.personnel.some(matchesSelectedPerson)).map((item) => item.date),
    };
  }, [selectedSummaryPerson, schedules]);

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
    let data = activeTab === 'patroli' ? (patroliScheduleData.schedule || []) : (schedules[activeTab] || []);
    if (!user && activeTab !== 'patroli') {
      // Masyarakat umum (belum login) HANYA bisa melihat jadwal piket HARI INI (atau jadwal bulanan)
      data = data.filter(item => item.isMonthly || checkIsToday(item.fullDate));
    }
    return data;
  };

  const handleExportSchedule = () => {
    const dataToExport = getActiveData();
    const tabTitle = activeTab === 'koramil' ? 'Piket Koramil' : activeTab === 'kodim' ? 'Piket Kodim' : activeTab === 'korem' ? 'Piket Korem' : 'Piket Patroli';
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
              .summary-section {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                  gap: 1rem;
                  margin-top: 1rem;
              }
              .summary-card {
                  background: #ffffff;
                  border: 1px solid #d1e8dd;
                  border-radius: 16px;
                  padding: 1rem;
                  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
              }
              .summary-card h3 {
                  margin: 0 0 0.75rem;
                  font-size: 1rem;
                  color: #0f766e;
              }
              .summary-card p {
                  margin: 0;
                  color: #334155;
                  font-size: 0.95rem;
                  line-height: 1.6;
              }
              .summary-card .summary-title {
                  font-size: 1.1rem;
                  font-weight: 700;
                  color: #065f46;
                  margin-bottom: 0.5rem;
              }
              .export-summary {
                  margin-top: 2rem;
                  padding: 1.25rem;
                  background: #ecfdf5;
                  border: 1px solid #a7f3d0;
                  border-radius: 18px;
              }
              .export-summary h2 {
                  margin: 0 0 0.5rem;
                  font-size: 1.3rem;
                  color: #065f46;
              }
              .export-summary p {
                  margin: 0.5rem 0 0;
                  color: #166534;
                  font-size: 0.95rem;
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
  const ScheduleCard = ({ item, canEdit }) => {
    const isToday = useMemo(() => checkIsToday(item.fullDate), [item.fullDate]);
    const editable = canEdit && user && user.role === 'danramil';

    // Tambahkan logging untuk mendeteksi jika 'item' tidak valid
    if (!item || !item.fullDate || !item.date || !item.personnel) {
      console.error("ScheduleCard received invalid item prop:", item);
      return null; // Render nothing or a placeholder for invalid data
    }

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
        <button 
          className={`tab-button ${activeTab === 'patroli' ? 'active' : ''}`}
          onClick={() => setActiveTab('patroli')}
        >
          <Clock size={18} /> Piket Patroli
        </button>
      </div>

      {activeTab === 'patroli' ? (
        <div className="patroli-panel">
          <div className="patroli-header">
            <div>
              <h2>Patroli Sabtu</h2>
              <p className="patroli-description">Generate jadwal patroli setiap hari Sabtu untuk 4 regu, dengan input personnel per regu.</p>
            </div>
            {user && user.role === 'danramil' && (
              <button className="btn-generate" onClick={executeCreatePatroliSchedule}>
                <CalendarPlus size={18} /> Buat Jadwal Patroli
              </button>
            )}
          </div>

          <div className="patroli-form-grid">
            <div className="form-group">
              <label className="form-label">Bulan & Tahun Patroli</label>
              <input
                type="month"
                className="form-input"
                value={patroliMonthYear}
                onChange={(e) => setPatroliMonthYear(e.target.value)}
              />
            </div>
            {patroliReguDetails.map((regu, index) => (
              <div className="form-group" key={`regu-${index}`}>
                <label className="form-label">Nama Regu {index + 1}</label>
                <input
                  type="text"
                  className="form-input"
                  value={regu.name}
                  onChange={(e) => {
                    const newReguDetails = [...patroliReguDetails];
                    newReguDetails[index] = { ...newReguDetails[index], name: e.target.value || `Regu ${index + 1}` };
                    setPatroliReguDetails(newReguDetails);
                  }}
                />
                <label className="form-label" style={{ marginTop: '0.75rem' }}>Personel Regu {index + 1}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pisahkan nama dengan koma"
                  value={regu.personnel}
                  onChange={(e) => {
                    const newReguDetails = [...patroliReguDetails];
                    newReguDetails[index] = { ...newReguDetails[index], personnel: e.target.value };
                    setPatroliReguDetails(newReguDetails);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="schedule-grid">
            {patroliScheduleData.schedule && patroliScheduleData.schedule.length > 0 ? (
              patroliScheduleData.schedule.map((item) => (
                <ScheduleCard key={item.id} item={item} canEdit={false} />
              ))
            ) : (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', color: '#64748b'}}>
                Jadwal patroli Sabtu belum tersedia. Gunakan form di atas untuk membuatnya.
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="schedule-grid">
            {getActiveData().length > 0 ? (
              getActiveData().map((item) => <ScheduleCard key={item.id} item={item} canEdit={user && user.role === 'danramil'} />)
            ) : (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', color: '#64748b'}}>
                Tidak ada jadwal piket yang tersedia untuk ditampilkan.
              </div>
            )}
          </div>

          <div className="personnel-summary">
            <div className="summary-header">
              <div>
                <h2>Ringkasan Jadwal Personel</h2>
                <p className="summary-description">Pilih personel untuk melihat tanggal bertugas di Koramil, Kodim, dan Korem.</p>
              </div>
              <div className="summary-select-wrapper">
                <select
                  className="form-input"
                  value={selectedSummaryPersonId}
                  onChange={(e) => setSelectedSummaryPersonId(e.target.value)}
                >
                  <option value="">-- Pilih Personel --</option>
                  {allPersonnelForExclusion
                    .filter((person) => person.jabatan !== 'Danramil')
                    .sort((a, b) => a.nama.localeCompare(b.nama))
                    .map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.nama} ({person.pangkat})
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedSummaryPerson && (
              <div className="summary-cards">
                {['koramil', 'kodim', 'korem'].map((category) => (
                  <div key={category} className="summary-card">
                    <h3>{category === 'koramil' ? 'Piket Koramil' : category === 'kodim' ? 'Piket Kodim' : 'Piket Korem'}</h3>
                    <p className="summary-personnel-name">{selectedSummaryPerson.nama}</p>
                    {scheduleSummary[category].length > 0 ? (
                      <p className="summary-dates">
                        {scheduleSummary[category].join(', ')}
                      </p>
                    ) : (
                      <p className="summary-no-dates">Tidak ada tugas pada kategori ini.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
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
                                        {person.nama} ({person.pangkat})
                                    </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right Section: Exclusions */}
                <div className="config-section">
                    {/* Koramil Exclusions */}
                    <div>
                        <label className="form-label">Kecualikan dari Piket Koramil</label>
                        <div className="exclusion-grid-container">
                            {allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').length > 0 ? (
                                allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').map(person => (
                                    <div key={`koramil-exc-${person.id}`} className="exclusion-item">
                                        <input
                                            type="checkbox"
                                            id={`exclude-koramil-${person.id}`}
                                            className="exclusion-checkbox"
                                            checked={(excludedPersonnelIds.koramil || []).includes(person.id)}
                                            onChange={(e) => {
                                                const personId = person.id;
                                                setExcludedPersonnelIds((prev) => ({
                                                    ...prev,
                                                    koramil: e.target.checked
                                                        ? [...(prev.koramil || []), personId]
                                                        : (prev.koramil || []).filter((id) => id !== personId),
                                                }));
                                            }}
                                        />
                                        <label htmlFor={`exclude-koramil-${person.id}`} className="exclusion-label">
                                            <span className="exclusion-name">{person.nama}</span>
                                            <span className="exclusion-rank">{person.pangkat}</span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>
                                    Tidak ada personel yang tersedia.
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Kodim Exclusions */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Kecualikan dari Piket Kodim</label>
                        <div className="exclusion-grid-container">
                            {allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').length > 0 ? (
                                allPersonnelForExclusion.filter(p => p.jabatan !== 'Danramil').map(person => (
                                    <div key={`kodim-exc-${person.id}`} className="exclusion-item">
                                        <input
                                            type="checkbox"
                                            id={`exclude-kodim-${person.id}`}
                                            className="exclusion-checkbox"
                                            checked={(excludedPersonnelIds.kodim || []).includes(person.id)}
                                            onChange={(e) => {
                                                const personId = person.id;
                                                setExcludedPersonnelIds((prev) => ({
                                                    ...prev,
                                                    kodim: e.target.checked
                                                        ? [...(prev.kodim || []), personId]
                                                        : (prev.kodim || []).filter((id) => id !== personId),
                                                }));
                                            }}
                                        />
                                        <label htmlFor={`exclude-kodim-${person.id}`} className="exclusion-label">
                                            <span className="exclusion-name">{person.nama}</span>
                                            <span className="exclusion-rank">{person.pangkat}</span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', gridColumn: '1 / -1' }}>
                                    Tidak ada personel yang tersedia.
                                </p>
                            )}
                        </div>
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