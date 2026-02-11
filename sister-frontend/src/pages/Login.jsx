import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield } from 'lucide-react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        // Simpan token dan info user (role, nama, dll)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); // Redirect ke dashboard
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal terhubung ke server');
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