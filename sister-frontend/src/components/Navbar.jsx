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
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const lastScrollY = useRef(0);

  useOutsideAlerter(userMenuRef, () => setShowUserMenu(false));
  useOutsideAlerter(notificationsRef, () => setShowNotifications(false));

  // Tutup semua menu saat URL berubah dan cek status login
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
    
    // Cek user dari localStorage
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
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

  // Fetch notifikasi dari backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    };

    fetchNotifications();
    // Polling setiap 30 detik untuk update realtime
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  
  const toggleNotifications = async () => {
    const isOpen = !showNotifications;
    setShowNotifications(isOpen);

    // Jika membuka notifikasi dan ada yang belum dibaca, tandai sudah dibaca di backend
    if (isOpen && unreadCount > 0) {
      try {
        await fetch('http://localhost:5000/api/notifications/mark-read', { method: 'PUT' });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (error) {
        console.error("Gagal update status notifikasi:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const canViewMap = user && (user.role === 'danramil' || user.role === 'babinsa');

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
          <NavLink to="/pertahanan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Pertahanan Wilayah</NavLink>
          {canViewMap && (
            <NavLink to="/peta-spasial" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Peta Spasial</NavLink>
          )}
          <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Laporan</NavLink>
        </div>

        <div className="navbar-actions">
          <div style={{position: 'relative'}} ref={notificationsRef} className="notification-wrapper">
            <button className="action-button" onClick={toggleNotifications}>
              <Bell size={20} /> 
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Notifikasi</h3>
                  <button className="dropdown-close" onClick={() => setShowNotifications(false)}><X size={16}/></button>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="notification-item" style={{ borderLeft: !notif.read ? '3px solid #ff9d00' : '3px solid transparent' }}>
                        <span className="notif-title">{notif.title}</span>
                        <div>{notif.message}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{notif.time}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                      Tidak ada notifikasi baru
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-profile-wrapper" ref={userMenuRef}>
            {user ? (
              <>
                <button className="action-button" onClick={toggleUserMenu}>
                  <span style={{ fontWeight: 700 }}>{user.username ? user.username.substring(0, 3).toUpperCase() : 'USR'}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-name">{user.nama || 'User'}</div>
                      <div className="user-email">{user.jabatan || 'Anggota'}</div>
                    </div>
                    <NavLink to="/profile" className="dropdown-item">
                      <User size={16} /> Profile
                    </NavLink>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="action-button" onClick={() => navigate('/login')}>
                <User size={20} /> <span style={{ marginLeft: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>LOGIN</span>
              </button>
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
          <NavLink to="/pertahanan" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pertahanan Wilayah</NavLink>
          {canViewMap && (
            <NavLink to="/peta-spasial" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Peta Spasial</NavLink>
          )}
          <NavLink to="/reports" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Laporan</NavLink>
        </div>
      )}
    </nav>
  );
}