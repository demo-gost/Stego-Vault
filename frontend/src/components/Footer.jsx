import { Link } from 'react-router-dom';
import { Shield, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="navbar-logo-icon small">
                <Shield size={16} />
              </div>
              <span className="footer-logo-text">STEGO-VAULT</span>
            </div>
            <p className="footer-desc">
              Universal steganography platform. Hide any data inside any file — images, videos, PDFs, audio, documents, and text files.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <Link to="/tool" className="footer-link">Launch Tool</Link>
            <Link to="/how-it-works" className="footer-link">How It Works</Link>
            <Link to="/formats" className="footer-link">Supported Formats</Link>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <Link to="/docs" className="footer-link">Documentation</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="/about" className="footer-link">About Us</Link>
          </div>

          {/* Techniques */}
          <div className="footer-col">
            <h4 className="footer-col-title">Techniques</h4>
            <span className="footer-link no-hover">LSB Steganography</span>
            <span className="footer-link no-hover">Spiral Matrix</span>
            <span className="footer-link no-hover">XOR Obfuscation</span>
            <span className="footer-link no-hover">Zero-Width Unicode</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Stego-Vault Universal Edition. Built by <strong>Group 1</strong></p>
          <div className="footer-bottom-links">
            <span>C++ Backend</span>
            <span>•</span>
            <span>React Frontend</span>
            <span>•</span>
            <span>DSA Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
