import { Menu, X, Bell, User, Settings, LogOut, LayoutDashboard, MapPin, Users, FileText, TrendingUp, Shield, PieChart } from 'lucide-react';
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
  
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useOutsideAlerter(userMenuRef, () => setShowUserMenu(false));
  useOutsideAlerter(notificationsRef, () => setShowNotifications(false));

  // Tutup semua menu saat URL berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  }, [location]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const notifications = [
    { id: 1, title: 'Patroli Rutin', message: 'Patroli wilayah operasi selesai dilaksanakan', time: '2 jam lalu', read: false },
    { id: 2, title: 'Briefing Koordinasi', message: 'Briefing dengan Muspika telah dijadwalkan', time: '5 jam lalu', read: false },
    { id: 3, title: 'Laporan Mingguan', message: 'Laporan mingguan siap untuk ditinjau', time: '1 hari lalu', read: true }
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-left">
          <div className="navbar-brand" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <img src={logoAsset} alt="Logo" className="logo-image" />
            </div>
            <div className="brand-text">
              <h1 className="app-title">SISTEM INFORMASI TERITORIAL</h1>
              <p className="app-subtitle">Koramil 429-09 Way Jepara</p>
            </div>
          </div>
        </div>

        {/* Center Navigation - Hidden on mobile */}
        <nav className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/wilayah" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Data</NavLink>
          <NavLink to="/personel" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Personel</NavLink>
          <NavLink to="/potensi" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Potensi</NavLink>
          <NavLink to="/keamanan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Keamanan</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Analytics</NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reports</NavLink>
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="notification-wrapper" ref={notificationsRef}>
            <button 
              className="action-button notification-button" 
              title="Notifications"
              onClick={toggleNotifications}
              aria-expanded={showNotifications}
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifikasi</h3>
                  <button className="close-notification" onClick={() => setShowNotifications(false)} aria-label="Tutup notifikasi">&times;</button>
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                      <div className="notification-content">
                        <h4 className="notification-title">{notif.title}</h4>
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {!notif.read && <div className="notification-dot"></div>}
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button className="view-all-button">Lihat Semua Notifikasi</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button 
              className="action-button user-button"
              onClick={toggleUserMenu}
              title="User Menu"
              aria-expanded={showUserMenu}
            >
              <div className="user-avatar">IFN</div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">IFN</div>
                  <div>
                    <p className="user-name">Muhammad Irfan</p>
                    <p className="user-email">irfan@koramil.mil.id</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <NavLink to="/profile" className="dropdown-item">
                  <User size={18} />
                  Profile
                </NavLink>
                <NavLink to="/settings" className="dropdown-item">
                  <Settings size={18} />
                  Settings
                </NavLink>
                <div className="dropdown-divider"></div>
                <button onClick={() => console.log('Logout')} className="dropdown-item logout">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={toggleMobileMenu}
            title="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu">
          <NavLink to="/" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} style={{ marginRight: '12px' }} /> Dashboard
          </NavLink>
          <NavLink to="/wilayah" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <MapPin size={20} style={{ marginRight: '12px' }} /> Data Wilayah
          </NavLink>
          <NavLink to="/personel" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <Users size={20} style={{ marginRight: '12px' }} /> Personel
          </NavLink>
          <NavLink to="/potensi" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <TrendingUp size={20} style={{ marginRight: '12px' }} /> Potensi Wilayah
          </NavLink>
          <NavLink to="/keamanan" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <Shield size={20} style={{ marginRight: '12px' }} /> Keamanan
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <PieChart size={20} style={{ marginRight: '12px' }} /> Analytics
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} style={{ marginRight: '12px' }} /> Reports
          </NavLink>
          <div className="mobile-menu-divider"></div>
          <NavLink to="/profile" className="mobile-menu-link">
            <User size={20} style={{ marginRight: '12px' }} /> Profile
          </NavLink>
          <button onClick={() => console.log('Logout')} className="mobile-menu-link logout">
            <LogOut size={20} style={{ marginRight: '12px' }} /> Logout
          </button>
        </nav>
      )}
    </header>
  );
}