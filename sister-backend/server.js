const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 5000;
const SECRET_KEY = 'sister-secret-key-rahasia'; // Kunci rahasia untuk token

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend (beda port)
app.use(express.json({ limit: '100mb' })); // Parsing body request JSON (limit diperbesar untuk foto resolusi tinggi)
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- DATABASE SETUP (SQLite) ---
const dbPath = path.resolve(__dirname, 'sister.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

// Helper functions untuk Async/Await Database
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Inisialisasi Tabel dan Data Awal
async function initDb() {
    // 1. Tabel Users
    await dbRun(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        nama TEXT,
        nrp TEXT,
        jabatan TEXT
    )`);

    const userCount = await dbGet("SELECT count(*) as count FROM users");
    if (userCount.count === 0) {
        console.log("Seeding users...");
        await dbRun("INSERT INTO users (username, password, role, nama, nrp, jabatan) VALUES (?, ?, ?, ?, ?, ?)", ['danramil', '123', 'danramil', 'Kapten Ahmad Wijaya', '17654321', 'Danramil']);
        await dbRun("INSERT INTO users (username, password, role, nama, nrp, jabatan) VALUES (?, ?, ?, ?, ?, ?)", ['babinsa', '123', 'babinsa', 'Sersan Rudi Hermawan', '19654323', 'Babinsa']);
    }

    // 2. Tabel Wilayah
    await dbRun(`CREATE TABLE IF NOT EXISTS wilayah (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        desa TEXT,
        kecamatan TEXT,
        luas TEXT,
        penduduk TEXT,
        kades TEXT,
        status TEXT
    )`);

    const wilayahCount = await dbGet("SELECT count(*) as count FROM wilayah");
    if (wilayahCount.count === 0) {
        console.log("Seeding wilayah...");
        const initialWilayah = [
            ['Braja Sakti', 'Way Jepara', '12.5 km²', '4,500', 'Budi Santoso', 'Aman'],
            ['Labuhan Ratu', 'Way Jepara', '15.2 km²', '5,200', 'Hendra Wijaya', 'Aman'],
            ['Braja Asri', 'Way Jepara', '10.8 km²', '3,800', 'Slamet Riyadi', 'Waspada'],
            ['Sumber Marga', 'Way Jepara', '11.5 km²', '4,150', 'Joko Susilo', 'Aman'],
            ['Braja Yekti', 'Braja Selebah', '14.1 km²', '4,100', 'Wawan Setiawan', 'Aman'],
            ['Braja Harjosari', 'Braja Selebah', '11.3 km²', '3,900', 'Agus Pratama', 'Aman'],
            ['Braja Gemilang', 'Braja Selebah', '13.7 km²', '4,300', 'Rudi Hartono', 'Aman'],
            ['Braja Indah', 'Braja Selebah', '12.0 km²', '3,500', 'Dedi Mulyadi', 'Rawan']
        ];
        for (const w of initialWilayah) {
            await dbRun("INSERT INTO wilayah (desa, kecamatan, luas, penduduk, kades, status) VALUES (?, ?, ?, ?, ?, ?)", w);
        }
    }

    // 3. Tabel Reports
    await dbRun(`CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        date TEXT,
        time TEXT,
        location TEXT,
        description TEXT,
        image TEXT
    )`);

    // 4. Tabel Personel
    await dbRun(`CREATE TABLE IF NOT EXISTS personel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT,
        nrp TEXT,
        jabatan TEXT,
        pangkat TEXT,
        wilayah TEXT,
        status TEXT,
        kontak TEXT,
        foto TEXT
    )`);

    const personelCount = await dbGet("SELECT count(*) as count FROM personel");
    if (personelCount.count === 0) {
        console.log("Seeding personel...");
        const initialPersonel = [
            ['Kapten Ahmad Wijaya', '17654321', 'Danramil', 'Kapten', 'Way Jepara', 'Aktif', '081234567890', 'https://i.pravatar.cc/150?u=1'],
            ['Peltu Budi Santoso', '18654322', 'Batuud', 'Peltu', 'Way Jepara', 'Aktif', '081234567891', 'https://i.pravatar.cc/150?u=2'],
            ['Sersan Rudi Hermawan', '19654323', 'Babinsa', 'Sersan', 'Marga Asih', 'Aktif', '081234567892', 'https://i.pravatar.cc/150?u=3']
        ];
        for (const p of initialPersonel) {
            await dbRun("INSERT INTO personel (nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", p);
        }
    }

    // 5. Tabel Incidents (Pertahanan Wilayah)
    await dbRun(`CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        location TEXT,
        date TEXT,
        type TEXT,
        severity TEXT,
        status TEXT,
        description TEXT,
        reporter TEXT
    )`);

    // MIGRATION: Pastikan kolom reporter ada (fix untuk database lama yang belum punya kolom ini)
    try {
        await dbRun("ALTER TABLE incidents ADD COLUMN reporter TEXT");
    } catch (e) {
        // Abaikan error jika kolom sudah ada
    }

    const incidentCount = await dbGet("SELECT count(*) as count FROM incidents");
    if (incidentCount.count === 0) {
        console.log("Seeding incidents...");
        const initialIncidents = [
            ['Indikasi Paham Radikal', 'Desa Braja Sakti', '2024-02-26', 'Ideologi', 'Siaga', 'Proses', 'Ditemukan penyebaran buku/selebaran yang mengarah pada paham radikal.', 'Warga'],
            ['Konflik Batas Tanah', 'Desa Labuhan Ratu', '2024-02-24', 'Sosial', 'Waspada', 'Selesai', 'Mediasi sengketa batas tanah antar tetangga berhasil didamaikan.', 'Babinsa'],
        ];
        for (const inc of initialIncidents) {
            await dbRun("INSERT INTO incidents (title, location, date, type, severity, status, description, reporter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", inc);
        }
    }
}

// --- ENDPOINTS ---

// 1. Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await dbGet("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
        
        if (user) {
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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Ambil semua data
app.get('/api/wilayah', async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM wilayah");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Ambil satu data berdasarkan ID
app.get('/api/wilayah/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const item = await dbGet("SELECT * FROM wilayah WHERE id = ?", [id]);
        if (item) res.json(item);
        else res.status(404).json({ message: "Data tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Update data berdasarkan ID
app.put('/api/wilayah/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { desa, kecamatan, luas, penduduk, kades, status } = req.body;
    try {
        await dbRun(
            "UPDATE wilayah SET desa=?, kecamatan=?, luas=?, penduduk=?, kades=?, status=? WHERE id=?",
            [desa, kecamatan, luas, penduduk, kades, status, id]
        );
        const updated = await dbGet("SELECT * FROM wilayah WHERE id = ?", [id]);
        if (updated) res.json(updated);
        else res.status(404).json({ message: "Data tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Tambah data baru (Opsional)
app.post('/api/wilayah', async (req, res) => {
    const { desa, kecamatan, luas, penduduk, kades, status } = req.body;
    try {
        const result = await dbRun(
            "INSERT INTO wilayah (desa, kecamatan, luas, penduduk, kades, status) VALUES (?, ?, ?, ?, ?, ?)",
            [desa, kecamatan, luas, penduduk, kades, status]
        );
        const newItem = await dbGet("SELECT * FROM wilayah WHERE id = ?", [result.lastID]);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Hapus data (Opsional)
app.delete('/api/wilayah/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await dbRun("DELETE FROM wilayah WHERE id = ?", [id]);
        if (result.changes > 0) res.json({ message: "Data dihapus", id });
        else res.status(404).json({ message: "Data tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ENDPOINTS LAPORAN ---

// Ambil semua laporan
app.get('/api/reports', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let query = "SELECT * FROM reports ORDER BY id DESC";
        const params = [];

        if (limit) {
            query += " LIMIT ?";
            params.push(limit);
        }
        
        const rows = await dbAll(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tambah laporan baru
app.post('/api/reports', async (req, res) => {
    const { title, category, date, time, location, description, image } = req.body;
    try {
        const result = await dbRun(
            "INSERT INTO reports (title, category, date, time, location, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [title, category, date, time, location, description, image]
        );
        const newReport = await dbGet("SELECT * FROM reports WHERE id = ?", [result.lastID]);
        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hapus laporan
app.delete('/api/reports/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await dbRun("DELETE FROM reports WHERE id = ?", [id]);
        if (result.changes > 0) res.json({ message: "Laporan dihapus", id });
        else res.status(404).json({ message: "Laporan tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ENDPOINTS INCIDENTS (PERTAHANAN WILAYAH) ---

app.get('/api/incidents', async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM incidents ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/incidents', async (req, res) => {
    const { title, location, type, description, reporter } = req.body;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const severity = 'Waspada'; // Default severity
    const status = 'Baru'; // Default status
    
    try {
        const result = await dbRun(
            "INSERT INTO incidents (title, location, date, type, severity, status, description, reporter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [title, location, date, type, severity, status, description, reporter]
        );
        const newItem = await dbGet("SELECT * FROM incidents WHERE id = ?", [result.lastID]);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/incidents/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { severity, status } = req.body;
    try {
        await dbRun("UPDATE incidents SET severity=?, status=? WHERE id=?", [severity, status, id]);
        const updated = await dbGet("SELECT * FROM incidents WHERE id = ?", [id]);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ENDPOINTS PERSONEL ---

// Ambil semua personel
app.get('/api/personel', async (req, res) => {
    try {
        const rows = await dbAll("SELECT * FROM personel");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tambah personel
app.post('/api/personel', async (req, res) => {
    const { nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto } = req.body;
    try {
        const result = await dbRun(
            "INSERT INTO personel (nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto]
        );
        const newItem = await dbGet("SELECT * FROM personel WHERE id = ?", [result.lastID]);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update personel
app.put('/api/personel/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto } = req.body;
    try {
        await dbRun(
            "UPDATE personel SET nama=?, nrp=?, jabatan=?, pangkat=?, wilayah=?, status=?, kontak=?, foto=? WHERE id=?",
            [nama, nrp, jabatan, pangkat, wilayah, status, kontak, foto, id]
        );
        const updated = await dbGet("SELECT * FROM personel WHERE id = ?", [id]);
        if (updated) res.json(updated);
        else res.status(404).json({ message: "Personel tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hapus personel
app.delete('/api/personel/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await dbRun("DELETE FROM personel WHERE id = ?", [id]);
        if (result.changes > 0) res.json({ message: "Personel dihapus", id });
        else res.status(404).json({ message: "Personel tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server backend berjalan di http://localhost:${port}`);
});