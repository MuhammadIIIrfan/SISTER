import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import '../styles/login.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';
import backgroundAsset from '../assets/koramil09.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Auto-hide notification setelah 3 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Login Berhasil! Mengalihkan...' });
        // Simpan token dan info user (role, nama, dll)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          navigate('/'); // Redirect ke dashboard dengan delay agar notif terbaca
        }, 1500);
      } else {
        setNotification({ type: 'error', message: data.message || 'Login gagal' });
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({ type: 'error', message: 'Gagal terhubung ke server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div 
        className="login-bg" 
        style={{ backgroundImage: `url(${backgroundAsset})` }}
      ></div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          animation: 'slideIn 0.3s ease-out',
          fontWeight: '500'
        }}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <span>{notification.message}</span>
        </div>
      )}
      
      <div className="login-card">
        <div className="login-header">
          <img src={logoAsset} alt="Logo SISTER" className="login-logo" />
          <h1 className="login-title">SISTER</h1>
          <p className="login-subtitle">Sistem Informasi Teritorial Koramil 429-09</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              name="username"
              placeholder="NRP / Username" 
              className="login-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="login-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Memproses...' : (
              <>
                Masuk Sistem <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Lupa password? <a href="#" className="login-link">Hubungi Admin</a></p>
          <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.7}}>
            <Shield size={14} />
            <span>Secure Military Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}