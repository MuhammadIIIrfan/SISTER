import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  TrendingUp, 
  Shield, 
  FileText,
  Menu,
  PieChart
} from 'lucide-react';
import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import '../styles/sidebar.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      id: 'data',
      label: 'Data Wilayah',
      icon: MapPin,
      path: '/wilayah',
    },
    {
      id: 'personel',
      label: 'Data Personel',
      icon: Users,
      path: '/personel',
    },
    {
      id: 'potensi',
      label: 'Potensi Wilayah',
      icon: TrendingUp,
      path: '/potensi',
    },
    {
      id: 'keamanan',
      label: 'Keamanan & Ketertiban',
      icon: Shield,
      path: '/keamanan',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      path: '/analytics',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      path: '/reports',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-container">
        {/* Menu Header */}
        <div className="sidebar-header">
          {!isSidebarOpen && (
            <div className="sidebar-logo-section">
              <img src={logoAsset} alt="Logo" className="sidebar-logo" />
            </div>
          )}
          {isSidebarOpen && <h3>Menu</h3>}
          <button 
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isItemActive = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`sidebar-item ${isItemActive ? 'active' : ''}`}
              >
                <IconComponent size={20} className="item-icon" />
                <span className="item-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="footer-card">
            <div className="footer-icon">
              <TrendingUp size={24} />
            </div>
            <p className="footer-text">Sistem informasi territorial terintegrasi</p>
          </div>
        </div>
      </div>
    </aside>
  );
}