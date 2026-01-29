import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import DataWilayah from './pages/DataWilayah';
import Personel from './pages/Personel';
import Piket from './pages/Piket';
import Keamanan from './pages/Keamanan';
import PetaSpasial from './pages/PetaSpasial';
import Reports from './pages/Reports';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wilayah" element={<DataWilayah />} />
          <Route path="/personel" element={<Personel />} />
          <Route path="/piket" element={<Piket />} />
          <Route path="/keamanan" element={<Keamanan />} />
          <Route path="/peta-spasial" element={<PetaSpasial />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;