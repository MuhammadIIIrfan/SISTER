import { Menu, X, Bell, User, Settings, LogOut, LayoutDashboard, MapPin, Users, FileText, Shield, Map } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

// Custom hook untuk mendeteksi klik di luar elemen
const useOutsideAlerter = (ref, onOutsideClick) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const lastScrollY = useRef(0);

  useOutsideAlerter(userMenuRef, () => setShowUserMenu(false));
  useOutsideAlerter(notificationsRef, () => setShowNotifications(false));

  // Tutup semua menu saat URL berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  }, [location]);

  // Deteksi scroll untuk mengubah style navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const notifications = [
    { id: 1, title: 'Patroli Rutin', message: 'Patroli wilayah operasi selesai dilaksanakan', time: '2 jam lalu', read: false },
    { id: 2, title: 'Briefing Koordinasi', message: 'Briefing dengan Muspika telah dijadwalkan', time: '5 jam lalu', read: false },
    { id: 3, title: 'Laporan Mingguan', message: 'Laporan mingguan siap untuk ditinjau', time: '1 hari lalu', read: true }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isVisible ? 'navbar-hidden' : ''}`}>
      <div className="navbar-container">
        
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <img src={logoAsset} alt="Logo" className="brand-logo" />
          <span className="brand-text">SISTER</span>
        </div>

        <div className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/wilayah" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Data Wilayah</NavLink>
          <NavLink to="/personel" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Personel</NavLink>
          <NavLink to="/piket" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Piket</NavLink>
          <NavLink to="/keamanan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Keamanan</NavLink>
          <NavLink to="/peta-spasial" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Peta Spasial</NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reports</NavLink>
        </div>

        <div className="navbar-actions">
          <div style={{position: 'relative'}} ref={notificationsRef} className="notification-wrapper">
            <button className="action-button" onClick={toggleNotifications}>
              <Bell size={20} /> <span className="notification-badge">3</span>
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifikasi</h3>
                  <button className="dropdown-close" onClick={() => setShowNotifications(false)}><X size={16}/></button>
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="notification-item">
                      <span className="notif-title">{notif.title}</span>
                      <div>{notif.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="user-profile-wrapper" ref={userMenuRef}>
            <button className="action-button" onClick={toggleUserMenu}>
              <span style={{ fontWeight: 700 }}>IFN</span>
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-name">Muhammad Irfan</div>
                  <div className="user-email">irfan@koramil.mil.id</div>
                </div>
                <NavLink to="/profile" className="dropdown-item">
                  <User size={16} /> Profile
                </NavLink>
                <button onClick={() => navigate('/login')} className="dropdown-item logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button 
            className="action-button mobile-toggle-btn"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/wilayah" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Data Wilayah</NavLink>
          <NavLink to="/personel" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Personel</NavLink>
          <NavLink to="/piket" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Piket</NavLink>
          <NavLink to="/keamanan" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Keamanan</NavLink>
          <NavLink to="/peta-spasial" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Peta Spasial</NavLink>
          <NavLink to="/reports" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Reports</NavLink>
        </div>
      )}
    </nav>
  );
}