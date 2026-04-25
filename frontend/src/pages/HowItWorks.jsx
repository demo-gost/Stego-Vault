import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Image as ImageIcon, FileVideo, FileAudio, FileText, 
  FileSpreadsheet, File, ArrowRight, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const encodeSteps = [
  { num: '1', title: 'Upload Carrier File', desc: 'Select any file as your carrier — the container that will hold your secret. Supported formats include images, videos, audio, PDFs, office documents, and text files.', color: 'var(--accent-blue)' },
  { num: '2', title: 'Add Secret Payload', desc: 'Type a text message or upload any file as your secret. The system automatically detects the file type and packages it with its original filename for later recovery.', color: 'var(--accent-purple)' },
  { num: '3', title: 'Steganography Engine', desc: 'The C++ backend detects the carrier type and applies the optimal technique: LSB for images, XOR-append for binary files, or zero-width Unicode for text files. All processing happens in-memory — no files touch the disk.', color: 'var(--accent-cyan)' },
  { num: '4', title: 'Download Stego File', desc: 'Download the modified carrier. It looks identical to the original — videos play normally, PDFs open correctly, images appear unchanged. Only Stego-Vault can recover the hidden data.', color: 'var(--accent-green)' },
];

const decodeSteps = [
  { num: '1', title: 'Upload Stego File', desc: 'Upload the file that contains hidden data. The system automatically detects which steganography technique was used based on the file type.', color: 'var(--accent-purple)' },
  { num: '2', title: 'Extraction Engine', desc: 'The appropriate extraction algorithm runs: LSB bit-reading with spiral traversal for images, magic marker detection for binary files, or zero-width character parsing for text.', color: 'var(--accent-cyan)' },
  { num: '3', title: 'Payload Recovery', desc: 'The original filename and content are recovered from the structured payload. Text messages are displayed inline; files are offered as downloads with their original names.', color: 'var(--accent-green)' },
];

const techniques = [
  {
    title: 'LSB Steganography (Images)',
    subtitle: 'For: PNG, JPG, BMP, GIF, WebP',
    steps: [
      'Load the carrier image into memory using stb_image',
      'Convert the secret payload to a binary string (8 bits per byte)',
      'Generate a spiral traversal path across the image pixel matrix',
      'For each bit, modify the Least Significant Bit (LSB) of the blue channel',
      'The pixel value changes by ±1 at most — completely invisible to the human eye',
      'Write the modified image to memory as PNG and return it',
    ]
  },
  {
    title: 'XOR Append Steganography (Binary Files)',
    subtitle: 'For: PDF, Video, Audio, Office Documents',
    steps: [
      'Read the carrier file as raw bytes',
      'Generate an XOR encryption key using a Linear Congruential Generator seeded by the carrier file size',
      'Encrypt the payload using the rotating 16-byte XOR key',
      'Append a 32-byte magic marker after the original file data',
      'Append the encrypted payload after the marker',
      'Append an 8-byte little-endian integer storing the payload size for fast extraction',
      'The original file remains fully functional — readers/players ignore appended data',
    ]
  },
  {
    title: 'Zero-Width Unicode (Text Files)',
    subtitle: 'For: TXT, CSV, MD, JSON, XML, HTML',
    steps: [
      'Convert the payload to a binary bit string',
      'Map each bit to an invisible Unicode character: 0 → U+200B (Zero-Width Space), 1 → U+200C (Zero-Width Non-Joiner)',
      'Insert a start marker (alternating U+200B/U+200C pattern) after the first visible character',
      'Insert all encoded zero-width characters',
      'Insert an end marker (reverse pattern)',
      'The text appears completely unchanged to human readers',
    ]
  },
];

export default function HowItWorks() {
  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <motion.div {...fadeUp}>
          <h1 className="page-header-title">How It Works</h1>
          <p className="page-header-subtitle">A detailed walkthrough of the encoding and decoding process, and the steganography techniques behind each file type.</p>
        </motion.div>
      </section>

      {/* ENCODING FLOW */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <div className="inline-badge"><EyeOff size={14} /> Encoding</div>
            <h2 className="section-title">Hiding Data (Encode)</h2>
          </motion.div>
          <div className="timeline">
            {encodeSteps.map((s, i) => (
              <motion.div key={i} className="timeline-item" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="timeline-dot" style={{ background: s.color }} />
                <div className="timeline-content">
                  <span className="timeline-num" style={{ color: s.color }}>Step {s.num}</span>
                  <h3 className="timeline-title">{s.title}</h3>
                  <p className="timeline-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DECODING FLOW */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <div className="inline-badge"><Eye size={14} /> Decoding</div>
            <h2 className="section-title">Extracting Data (Decode)</h2>
          </motion.div>
          <div className="timeline">
            {decodeSteps.map((s, i) => (
              <motion.div key={i} className="timeline-item" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="timeline-dot" style={{ background: s.color }} />
                <div className="timeline-content">
                  <span className="timeline-num" style={{ color: s.color }}>Step {s.num}</span>
                  <h3 className="timeline-title">{s.title}</h3>
                  <p className="timeline-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNIQUE DEEP DIVES */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Technique Deep Dive</h2>
            <p className="section-subtitle">Step-by-step breakdown of each steganography algorithm.</p>
          </motion.div>
          <div className="technique-list">
            {techniques.map((t, i) => (
              <motion.div key={i} className="technique-card" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <h3 className="technique-card-title">{t.title}</h3>
                <p className="technique-card-subtitle">{t.subtitle}</p>
                <ol className="technique-steps">
                  {t.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-alt">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <h2 className="section-title">Try It Yourself</h2>
            <p className="section-subtitle mb-6">See these techniques in action with the live tool.</p>
            <Link to="/tool" className="btn btn-primary btn-lg">
              <Lock size={18} /> Launch Tool <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
