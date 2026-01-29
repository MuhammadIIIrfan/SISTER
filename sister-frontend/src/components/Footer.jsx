import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Heart, ArrowRight } from 'lucide-react';
import logoAsset from '../assets/LOGO_KOREM_043.png';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-header">
              <img src={logoAsset} alt="Logo" className="footer-logo" />
              <div>
                <h3 className="footer-title">SISTER</h3>
              </div>
            </div>
            <p className="footer-desc">
              Sistem Informasi Teritorial Koramil 0429-09 Way Jepara

            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h4 className="section-heading">Hubungi Kami</h4>
            <div className="contact-list">
              <a href="https://maps.app.goo.gl/WjQUPeWAMJDjhpJq8" target="_blank" rel="noreferrer" className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>Way Jepara, Lampung Timur</span>
              </a>
              <a href="tel:+62211234567" className="contact-item">
                <Phone size={18} className="contact-icon" />
                <span>(021) 123-4567</span>
              </a>
              <a href="mailto:info@sister.mil.id" className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>info@sister.mil.id</span>
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-newsletter">
            <h4 className="section-heading">Berita Terbaru</h4>
            <p className="newsletter-desc">Dapatkan update kegiatan terbaru.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Anda..." className="newsletter-input" />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe"><ArrowRight size={18} /></button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Koramil 429-09. All rights reserved.</p>
          <p className="made-with">Made with by Muhammad Irfan Efendi</p>
        </div>
      </div>
    </footer>
  );
}