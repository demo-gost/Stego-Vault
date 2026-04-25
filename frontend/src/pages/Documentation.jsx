import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Database, Cpu, Layers, Binary, Zap, Shield } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const architecture = [
  { title: 'React Frontend', desc: 'React 19 + Vite 7 + TailwindCSS + Framer Motion. Single-page application with client-side routing. Communicates with the backend via multipart/form-data HTTP requests.', icon: Code },
  { title: 'C++ Backend', desc: 'Pure C++17 HTTP server using httplib (header-only). Handles image loading with stb_image, steganography processing, and serves the API on port 8080.', icon: Cpu },
  { title: 'In-Memory Processing', desc: 'Zero disk I/O. Images are decoded from the HTTP request body, processed in RAM, and returned directly. No temporary files are created at any point.', icon: Database },
  { title: 'Docker Deployment', desc: 'Containerized with gcc:latest Docker image. Compiled with -O3 optimization. Deployable to Render, Railway, or any Docker host.', icon: Shield },
];

const dsaConcepts = [
  {
    title: 'Greedy Algorithm — Huffman Coding',
    icon: Cpu,
    unit: 'Data Structures & Algorithms',
    desc: 'Huffman coding compresses data by building a binary tree where more frequent characters get shorter codes. The algorithm uses a greedy strategy — always merging the two nodes with the lowest frequency.',
    details: [
      'Uses a Min-Heap Priority Queue (O(log n) insert/extract)',
      'Builds an optimal prefix-free binary tree',
      'Recursive DFS traversal generates variable-length codes',
      'Achieves optimal compression for character-based encoding',
      'Time complexity: O(n log n) where n = unique characters',
    ]
  },
  {
    title: 'Spiral Matrix Traversal (2D Array)',
    icon: Layers,
    unit: 'Arrays & Matrix Operations',
    desc: 'Instead of traversing the image linearly (left-to-right, top-to-bottom), we use a clockwise spiral pattern. This distributes hidden data non-linearly, making it harder for steganalysis tools to detect patterns.',
    details: [
      'Four-pointer boundary algorithm (top, bottom, left, right)',
      'Direction cycling: Right → Down → Left → Up',
      'Boundary shrinks after each sweep',
      'Produces a complete coverage of all pixels',
      'Time complexity: O(W × H) where W, H = image dimensions',
    ]
  },
  {
    title: 'Bit Manipulation — LSB Steganography',
    icon: Binary,
    unit: 'Bitwise Operations',
    desc: 'The core of image steganography. We modify only the Least Significant Bit (LSB) of each pixel\'s blue channel. A change of ±1 in a single color channel is completely imperceptible.',
    details: [
      'AND mask: pixel & 0xFE clears the LSB (11111110)',
      'OR set: pixel | bit sets the LSB to 0 or 1',
      'Combined: (pixel & 0xFE) | data_bit',
      'Blue channel chosen — human eye is least sensitive to blue',
      'Each pixel stores 1 bit → capacity = W × H bits',
    ]
  },
  {
    title: 'XOR Cipher — Obfuscation',
    icon: Shield,
    unit: 'Cryptography Basics',
    desc: 'For non-image carriers, the payload is XOR-encrypted with a pseudo-random key derived from the carrier file size using a Linear Congruential Generator (LCG).',
    details: [
      'Key generation: LCG with seed = carrier file size',
      '16-byte rotating key applied across the payload',
      'XOR is self-inverse: encrypt(encrypt(x)) = x',
      'Provides obfuscation (not military-grade encryption)',
      'Key is implicitly recoverable from the carrier size during decode',
    ]
  },
  {
    title: 'Hash Map — Frequency Counting',
    icon: Database,
    unit: 'Hash Tables',
    desc: 'Used in Huffman coding to count character frequencies in O(n) time using unordered_map, and to store the generated Huffman codes for O(1) lookup during encoding.',
    details: [
      'unordered_map<char, int> for frequency counting',
      'unordered_map<char, string> for code mapping',
      'Average O(1) insertion and lookup',
      'Used for both compression and decompression paths',
    ]
  },
  {
    title: 'Zero-Width Unicode Encoding',
    icon: Zap,
    unit: 'Character Encoding',
    desc: 'For text file carriers, secret data is encoded as invisible Unicode characters. Zero-Width Space (U+200B) represents bit 0, Zero-Width Non-Joiner (U+200C) represents bit 1.',
    details: [
      'Each bit → 3 UTF-8 bytes (0xE2 0x80 0x8B or 0x8C)',
      'Invisible to all text editors and renders',
      'Start/end markers delineate the hidden data block',
      'Lossless encoding — every bit is preserved exactly',
      'Capacity: unlimited (text file grows but looks the same)',
    ]
  },
];

export default function Documentation() {
  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <motion.div {...fadeUp}>
          <h1 className="page-header-title">Documentation</h1>
          <p className="page-header-subtitle">Technical architecture, DSA concepts, and implementation details of Stego-Vault.</p>
        </motion.div>
      </section>

      {/* Architecture */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">System Architecture</h2>
            <p className="section-subtitle">Stego-Vault is a full-stack application with a React frontend and a native C++ backend.</p>
          </motion.div>
          <div className="arch-grid">
            {architecture.map((a, i) => (
              <motion.div key={i} className="arch-card" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <a.icon size={24} className="arch-icon" />
                <h3 className="arch-title">{a.title}</h3>
                <p className="arch-desc">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow Diagram */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Data Flow</h2>
          </motion.div>
          <motion.div className="dataflow-card" {...fadeUp}>
            <div className="dataflow-row">
              <div className="dataflow-node">React Frontend</div>
              <div className="dataflow-arrow">→ multipart/form-data →</div>
              <div className="dataflow-node highlight">C++ Server (:8080)</div>
              <div className="dataflow-arrow">→ blob response →</div>
              <div className="dataflow-node">Browser Download</div>
            </div>
            <div className="dataflow-sub">
              <div className="dataflow-engine">
                <strong>Processing Engine (all in-memory):</strong>
                <div className="dataflow-engines-row">
                  <span className="dataflow-engine-pill">stego.h — Image LSB</span>
                  <span className="dataflow-engine-pill">file_stego.h — Binary Append / Text Unicode</span>
                  <span className="dataflow-engine-pill">huffman.h — Compression (DSA)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DSA Concepts */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">DSA Concepts & Algorithms</h2>
            <p className="section-subtitle">Every major Data Structure and Algorithm concept used in Stego-Vault, explained.</p>
          </motion.div>
          <div className="dsa-list">
            {dsaConcepts.map((d, i) => (
              <motion.div key={i} className="dsa-card" {...fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="dsa-card-header">
                  <d.icon size={22} className="dsa-icon" />
                  <div>
                    <h3 className="dsa-title">{d.title}</h3>
                    <span className="dsa-unit">{d.unit}</span>
                  </div>
                </div>
                <p className="dsa-desc">{d.desc}</p>
                <ul className="dsa-details">
                  {d.details.map((det, j) => (
                    <li key={j}>{det}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packet Format */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Payload Packet Format</h2>
          </motion.div>
          <div className="packet-grid">
            <motion.div className="packet-card" {...fadeUp}>
              <h3 className="packet-title">Image Carriers</h3>
              <div className="packet-code">
                <code>[filename]:::SEP:::[content]:::STEGO_END:::</code>
                <p>→ convert to binary → embed in blue channel LSB (spiral order)</p>
              </div>
            </motion.div>
            <motion.div className="packet-card" {...fadeUp} transition={{ delay: 0.1 }}>
              <h3 className="packet-title">Binary Carriers (PDF, Video, Audio, Office)</h3>
              <div className="packet-code">
                <code>[original file][MAGIC_32bytes][XOR payload][size_8bytes]</code>
                <p>→ XOR key derived from carrier size via LCG</p>
              </div>
            </motion.div>
            <motion.div className="packet-card" {...fadeUp} transition={{ delay: 0.2 }}>
              <h3 className="packet-title">Text Carriers</h3>
              <div className="packet-code">
                <code>[char₁][start_marker][zero-width bits][end_marker][rest of text]</code>
                <p>→ each bit = U+200B (0) or U+200C (1)</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
