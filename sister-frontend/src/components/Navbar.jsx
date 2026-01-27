import { Menu, X, Bell, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
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
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <img src={logoAsset} alt="Logo" className="logo-image" />
          </div>
          <div className="brand-text">
            <h1 className="app-title">SISTEM INFORMASI TERITORIAL</h1>
            <p className="app-subtitle">Koramil 429-09 Way Jepara</p>
          </div>
        </div>

        {/* Center Navigation - Hidden on mobile */}
        <nav className="navbar-nav">
          <button onClick={() => navigate('/')} className="nav-link active">Dashboard</button>
          <button onClick={() => navigate('/wilayah')} className="nav-link">Data</button>
          <button onClick={() => navigate('/personel')} className="nav-link">Personel</button>
          <button onClick={() => navigate('/reports')} className="nav-link">Reports</button>
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="notification-wrapper">
            <button 
              className="action-button notification-button" 
              title="Notifications"
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifikasi</h3>
                  <button className="close-notification" onClick={() => setShowNotifications(false)}>×</button>
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
          <div className="user-menu-wrapper">
            <button 
              className="action-button user-button"
              onClick={toggleUserMenu}
              title="User Menu"
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
                <a href="#" className="dropdown-item">
                  <User size={18} />
                  Profile
                </a>
                <a href="#" className="dropdown-item">
                  <Settings size={18} />
                  Settings
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item logout">
                  <LogOut size={18} />
                  Logout
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            title="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="mobile-menu">
          <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="mobile-menu-link active">Dashboard</button>
          <button onClick={() => { navigate('/wilayah'); setIsMenuOpen(false); }} className="mobile-menu-link">Data</button>
          <button onClick={() => { navigate('/personel'); setIsMenuOpen(false); }} className="mobile-menu-link">Personel</button>
          <button onClick={() => { navigate('/reports'); setIsMenuOpen(false); }} className="mobile-menu-link">Reports</button>
          <div className="mobile-menu-divider"></div>
          <a href="#" className="mobile-menu-link">Profile</a>
          <a href="#" className="mobile-menu-link logout">Logout</a>
        </nav>
      )}
    </header>
  );
}