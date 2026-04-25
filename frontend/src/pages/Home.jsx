import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, ChevronRight, Lock, Unlock, FileVideo, FileAudio, 
  FileText, Image as ImageIcon, FileSpreadsheet, File, Zap,
  Cpu, Layers, Binary, ArrowRight, Eye, EyeOff, CheckCircle
} from 'lucide-react';

const features = [
  { icon: Cpu, title: 'LSB Steganography', desc: 'Pixel-level bit manipulation on image carriers — invisible changes.', color: 'var(--accent-blue)' },
  { icon: Layers, title: 'Spiral Matrix', desc: 'Non-linear pixel traversal to defeat steganalysis tools.', color: 'var(--accent-purple)' },
  { icon: Binary, title: 'XOR Append', desc: 'Obfuscated data injection after file EOF markers.', color: 'var(--accent-cyan)' },
  { icon: Zap, title: 'Zero-Width Unicode', desc: 'Invisible character encoding for text file carriers.', color: 'var(--accent-green)' },
];

const formats = [
  { icon: ImageIcon, label: 'Images', exts: 'PNG, JPG, BMP, GIF, WebP' },
  { icon: FileVideo, label: 'Videos', exts: 'MP4, AVI, MKV, MOV' },
  { icon: FileAudio, label: 'Audio', exts: 'MP3, WAV, FLAC, OGG' },
  { icon: FileText, label: 'Documents', exts: 'PDF, DOCX, PPTX' },
  { icon: FileSpreadsheet, label: 'Spreadsheets', exts: 'XLSX, XLS, CSV' },
  { icon: File, label: 'Text Files', exts: 'TXT, MD, JSON, XML' },
];

const steps = [
  { num: '01', title: 'Upload Carrier', desc: 'Choose any file to act as the container. It will look and work exactly the same after hiding data.' },
  { num: '02', title: 'Add Your Secret', desc: 'Type a message or upload any file — images, videos, documents. Everything gets packaged securely.' },
  { num: '03', title: 'Download & Share', desc: 'Get your stego file. Only Stego-Vault can detect and extract the hidden content.' },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function Home() {
  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
        </div>
        <motion.div className="hero-content" {...fadeUp} transition={{ duration: 0.7 }}>
          <div className="hero-badge">
            <Shield size={14} />
            <span>Universal Steganography Platform</span>
          </div>
          <h1 className="hero-title">
            Hide <span className="gradient-text-blue">Anything</span> Inside{' '}
            <span className="gradient-text-purple">Any File</span>
          </h1>
          <p className="hero-subtitle">
            Military-grade steganography powered by LSB encoding, Spiral Matrix Traversal,
            XOR Obfuscation, and Zero-Width Unicode. Supports 30+ file formats.
          </p>
          <div className="hero-actions">
            <Link to="/tool" className="btn btn-primary btn-lg">
              <EyeOff size={18} />
              Start Hiding Data
              <ChevronRight size={18} />
            </Link>
            <Link to="/how-it-works" className="btn btn-ghost btn-lg">
              Learn How It Works
            </Link>
          </div>
          {/* Format pills */}
          <div className="hero-formats">
            {['PNG','MP4','PDF','DOCX','MP3','XLSX','TXT','WAV','AVI','JPG'].map(f => (
              <span key={f} className="format-pill">{f}</span>
            ))}
            <span className="format-pill highlight">+20 more</span>
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <span className="stat-value">30+</span>
            <span className="stat-label">File Formats</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">4</span>
            <span className="stat-label">Stego Techniques</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">C++</span>
            <span className="stat-label">Native Backend</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Files on Disk</span>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Core Steganography Techniques</h2>
            <p className="section-subtitle">Four advanced algorithms engineered from scratch in C++ for maximum security and performance.</p>
          </motion.div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="feature-icon" style={{ color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to hide data inside any file.</p>
          </motion.div>
          <div className="steps-row">
            {steps.map((s, i) => (
              <motion.div key={i} className="step-card" {...fadeUp} transition={{ delay: i * 0.15 }}>
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTED FORMATS */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Supported Formats</h2>
            <p className="section-subtitle">Use any of these file types as a carrier or as the hidden payload.</p>
          </motion.div>
          <div className="formats-grid">
            {formats.map((f, i) => (
              <motion.div key={i} className="format-card" {...fadeUp} transition={{ delay: i * 0.08 }}>
                <f.icon size={24} className="format-card-icon" />
                <h4 className="format-card-title">{f.label}</h4>
                <p className="format-card-exts">{f.exts}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/formats" className="btn btn-ghost">
              View All Formats <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <motion.div className="cta-card" {...fadeUp}>
            <h2 className="cta-title">Ready to Hide Your First Secret?</h2>
            <p className="cta-desc">Upload a carrier file and start hiding data in seconds. No signup, no tracking, completely in-memory.</p>
            <Link to="/tool" className="btn btn-primary btn-lg">
              <Lock size={18} />
              Launch Stego-Vault
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
