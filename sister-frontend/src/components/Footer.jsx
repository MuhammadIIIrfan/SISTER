import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Heart } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-section-title">SISTER</h3>
            <p className="footer-description">
              Sistem Informasi Teritorial untuk pengelolaan data wilayah, personel, dan keamanan secara terintegrasi.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" title="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon" title="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">Hubungi Kami</h3>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} />
                <span>Koramil 429-09, Way Jepara</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>(021) 123-4567</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@sister.mil.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Koramil 429-09 Way Jepara. All rights reserved.
            </p>
            <div className="footer-divider"></div>
            <p className="made-with">
              Made with <Heart size={14} className="heart-icon" /> by Development Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}