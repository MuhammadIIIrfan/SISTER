import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import '../styles/footer.css';
import logoAsset from '../assets/LOGO_KOREM_043.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-header">
              <img src={logoAsset} alt="Logo" className="footer-logo" />
              <div>
                <h3 className="footer-title">KORAMIL 429-09</h3>
                <p className="footer-subtitle">WAY JEPARA</p>
              </div>
            </div>
            <p className="footer-desc">
              Melayani masyarakat dengan integritas, menjaga kedaulatan negara, dan membangun wilayah yang aman serta sejahtera bersama rakyat.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Youtube"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h4 className="section-heading">Hubungi Kami</h4>
            <div className="contact-list">
              <a href="https://www.google.com/maps/search/?api=1&query=Jl.+Raya+Way+Jepara,+Lampung+Timur" target="_blank" rel="noopener noreferrer" className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>Jl. Raya Way Jepara, Lampung Timur</span>
              </a>
              <a href="tel:0211234567" className="contact-item">
                <Phone size={18} className="contact-icon" />
                <span>(021) 123-4567</span>
              </a>
              <a href="mailto:koramil429-09@mil.id" className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>koramil429-09@mil.id</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2024 Sistem Informasi Teritorial Koramil 429-09. All rights reserved.</span>
          <div className="made-with">
            <span>SISTER v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}