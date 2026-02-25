import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import DataWilayah from './pages/DataWilayah';
import Personel from './pages/Personel';
import Piket from './pages/Piket';
import Keamanan from './pages/Keamanan';
import PetaSpasial from './pages/PetaSpasial';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Komponen Utility: Scroll ke atas saat pindah halaman
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isLoginPage && <Navbar />}
      <div className={!isLoginPage ? "content" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/wilayah" element={<DataWilayah />} />
          <Route path="/personel" element={<Personel />} />
          <Route path="/piket" element={<Piket />} />
          <Route path="/pertahanan" element={<Keamanan />} />
          <Route path="/peta-spasial" element={<PetaSpasial />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;