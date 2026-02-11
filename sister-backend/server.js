const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5000;
const SECRET_KEY = 'sister-secret-key-rahasia'; // Kunci rahasia untuk token

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend (beda port)
app.use(express.json()); // Parsing body request JSON

// --- DATA DUMMY USER (Untuk Login) ---
const users = [
    {
        id: 1,
        username: 'danramil',
        password: '123',
        role: 'danramil',
        nama: 'Kapten Ahmad Wijaya',
        nrp: '17654321',
        jabatan: 'Danramil'
    },
    {
        id: 2,
        username: 'babinsa',
        password: '123',
        role: 'babinsa',
        nama: 'Sersan Rudi Hermawan',
        nrp: '19654323',
        jabatan: 'Babinsa'
    }
];

// Data Wilayah (Simulasi Database In-Memory)
let dataWilayah = [
    { id: 1, desa: 'Braja Sakti', kecamatan: 'Way Jepara', luas: '12.5 km²', penduduk: '4,500', kades: 'Budi Santoso', status: 'Aman' },
    { id: 2, desa: 'Labuhan Ratu', kecamatan: 'Way Jepara', luas: '15.2 km²', penduduk: '5,200', kades: 'Hendra Wijaya', status: 'Aman' },
    { id: 3, desa: 'Braja Asri', kecamatan: 'Way Jepara', luas: '10.8 km²', penduduk: '3,800', kades: 'Slamet Riyadi', status: 'Waspada' },
    { id: 4, desa: 'Sumber Marga', kecamatan: 'Way Jepara', luas: '11.5 km²', penduduk: '4,150', kades: 'Joko Susilo', status: 'Aman' },
    { id: 5, desa: 'Braja Yekti', kecamatan: 'Braja Selebah', luas: '14.1 km²', penduduk: '4,100', kades: 'Wawan Setiawan', status: 'Aman' },
    { id: 6, desa: 'Braja Harjosari', kecamatan: 'Braja Selebah', luas: '11.3 km²', penduduk: '3,900', kades: 'Agus Pratama', status: 'Aman' },
    { id: 7, desa: 'Braja Gemilang', kecamatan: 'Braja Selebah', luas: '13.7 km²', penduduk: '4,300', kades: 'Rudi Hartono', status: 'Aman' },
    { id: 8, desa: 'Braja Indah', kecamatan: 'Braja Selebah', luas: '12.0 km²', penduduk: '3,500', kades: 'Dedi Mulyadi', status: 'Rawan' },
];

// --- ENDPOINTS ---

// 1. Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Cari user yang cocok
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role, nama: user.nama }, SECRET_KEY, { expiresIn: '12h' });

        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                nama: user.nama,
                nrp: user.nrp,
                jabatan: user.jabatan
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Username atau Password salah!' });
    }
});

// Endpoint: Ambil semua data
app.get('/api/wilayah', (req, res) => {
    res.json(dataWilayah);
});

// Endpoint: Ambil satu data berdasarkan ID
app.get('/api/wilayah/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = dataWilayah.find(d => d.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Data tidak ditemukan" });
    }
});

// Endpoint: Update data berdasarkan ID
app.put('/api/wilayah/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedItem = req.body;

    const index = dataWilayah.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Update data di memori
        dataWilayah[index] = { ...dataWilayah[index], ...updatedItem };
        res.json(dataWilayah[index]);
    } else {
        res.status(404).json({ message: "Data tidak ditemukan" });
    }
});

// Endpoint: Tambah data baru (Opsional)
app.post('/api/wilayah', (req, res) => {
    const newItem = req.body;
    // Generate ID sederhana
    newItem.id = dataWilayah.length ? dataWilayah[dataWilayah.length - 1].id + 1 : 1;
    dataWilayah.push(newItem);
    res.status(201).json(newItem);
});

// Endpoint: Hapus data (Opsional)
app.delete('/api/wilayah/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dataWilayah.findIndex(item => item.id === id);
    
    if (index !== -1) {
        const deletedItem = dataWilayah.splice(index, 1);
        res.json(deletedItem);
    } else {
        res.status(404).json({ message: "Data tidak ditemukan" });
    }
});

app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
});