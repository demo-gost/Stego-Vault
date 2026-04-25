import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, FileVideo, FileAudio, FileText, 
  FileSpreadsheet, File, FileType, CheckCircle
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const carrierFormats = [
  { 
    icon: ImageIcon, label: 'Images', color: 'var(--accent-blue)',
    technique: 'LSB + Spiral Matrix Traversal',
    formats: [
      { ext: 'PNG', desc: 'Lossless — best for LSB steganography' },
      { ext: 'JPG / JPEG', desc: 'Lossy compression — works with conversion to PNG internally' },
      { ext: 'BMP', desc: 'Uncompressed bitmap' },
      { ext: 'GIF', desc: 'Animated/static graphics' },
      { ext: 'WebP', desc: 'Modern web image format' },
    ]
  },
  {
    icon: FileVideo, label: 'Videos', color: 'var(--accent-purple)',
    technique: 'XOR Append Steganography',
    formats: [
      { ext: 'MP4', desc: 'Most common video container' },
      { ext: 'AVI', desc: 'Audio Video Interleave' },
      { ext: 'MKV', desc: 'Matroska container' },
      { ext: 'MOV', desc: 'Apple QuickTime' },
      { ext: 'WebM', desc: 'Web-optimized video' },
      { ext: 'FLV', desc: 'Flash Video' },
      { ext: 'WMV', desc: 'Windows Media Video' },
    ]
  },
  {
    icon: FileAudio, label: 'Audio', color: 'var(--accent-pink)',
    technique: 'XOR Append Steganography',
    formats: [
      { ext: 'MP3', desc: 'MPEG Layer 3 audio' },
      { ext: 'WAV', desc: 'Uncompressed audio' },
      { ext: 'FLAC', desc: 'Free Lossless Audio Codec' },
      { ext: 'OGG', desc: 'Ogg Vorbis audio' },
      { ext: 'AAC', desc: 'Advanced Audio Coding' },
      { ext: 'WMA', desc: 'Windows Media Audio' },
      { ext: 'M4A', desc: 'MPEG-4 Audio' },
    ]
  },
  {
    icon: FileText, label: 'Documents', color: 'var(--accent-red)',
    technique: 'XOR Append Steganography',
    formats: [
      { ext: 'PDF', desc: 'Portable Document Format — data hidden after %%EOF' },
      { ext: 'DOCX', desc: 'Microsoft Word (ZIP-based)' },
      { ext: 'PPTX', desc: 'Microsoft PowerPoint (ZIP-based)' },
      { ext: 'DOC', desc: 'Legacy Word format' },
      { ext: 'PPT', desc: 'Legacy PowerPoint format' },
      { ext: 'ODT', desc: 'OpenDocument Text' },
    ]
  },
  {
    icon: FileSpreadsheet, label: 'Spreadsheets', color: 'var(--accent-green)',
    technique: 'XOR Append Steganography',
    formats: [
      { ext: 'XLSX', desc: 'Microsoft Excel (ZIP-based)' },
      { ext: 'XLS', desc: 'Legacy Excel format' },
      { ext: 'ODS', desc: 'OpenDocument Spreadsheet' },
    ]
  },
  {
    icon: FileType, label: 'Text Files', color: 'var(--accent-cyan)',
    technique: 'Zero-Width Unicode Steganography',
    formats: [
      { ext: 'TXT', desc: 'Plain text' },
      { ext: 'CSV', desc: 'Comma-separated values' },
      { ext: 'MD', desc: 'Markdown' },
      { ext: 'JSON', desc: 'JavaScript Object Notation' },
      { ext: 'XML', desc: 'Extensible Markup Language' },
      { ext: 'HTML', desc: 'Web pages' },
      { ext: 'CSS', desc: 'Stylesheets' },
      { ext: 'JS', desc: 'JavaScript source' },
      { ext: 'LOG', desc: 'Log files' },
    ]
  },
];

const payloadFormats = [
  'Text messages', 'PNG', 'JPG', 'GIF', 'BMP', 'WebP',
  'MP4', 'AVI', 'MKV', 'MOV', 'MP3', 'WAV', 'FLAC', 'OGG',
  'PDF', 'DOCX', 'XLSX', 'PPTX', 'DOC', 'XLS', 'TXT', 'CSV',
  'JSON', 'XML', 'ZIP', 'RAR', '7Z', 'EXE', 'Any binary file',
];

export default function Formats() {
  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <motion.div {...fadeUp}>
          <h1 className="page-header-title">Supported Formats</h1>
          <p className="page-header-subtitle">Complete reference of all carrier and payload file types supported by Stego-Vault.</p>
        </motion.div>
      </section>

      {/* Payload section */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Secret Payload (What You Can Hide)</h2>
            <p className="section-subtitle">You can hide literally any file type as the secret payload — there are no restrictions.</p>
          </motion.div>
          <motion.div className="payload-grid" {...fadeUp}>
            {payloadFormats.map((f, i) => (
              <span key={i} className="payload-pill">
                <CheckCircle size={12} /> {f}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Carrier formats */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Carrier Formats (Where You Can Hide)</h2>
            <p className="section-subtitle">Each carrier type uses a different steganography technique optimized for that format.</p>
          </motion.div>

          <div className="format-sections">
            {carrierFormats.map((cat, i) => (
              <motion.div key={i} className="format-section-card" {...fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="format-section-header">
                  <cat.icon size={24} style={{ color: cat.color }} />
                  <div>
                    <h3 className="format-section-title">{cat.label}</h3>
                    <p className="format-section-technique">{cat.technique}</p>
                  </div>
                </div>
                <div className="format-table">
                  <div className="format-table-header">
                    <span>Extension</span>
                    <span>Description</span>
                  </div>
                  {cat.formats.map((f, j) => (
                    <div key={j} className="format-table-row">
                      <span className="format-ext">{f.ext}</span>
                      <span className="format-desc">{f.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
