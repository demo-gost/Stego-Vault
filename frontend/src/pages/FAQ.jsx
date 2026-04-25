import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Lock } from 'lucide-react';
import { useState } from 'react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What is steganography?',
        a: 'Steganography is the practice of hiding data inside another file (called a "carrier") so that no one even knows hidden data exists. Unlike encryption, which makes data unreadable, steganography makes data invisible.'
      },
      {
        q: 'How is this different from encryption?',
        a: 'Encryption scrambles data so it\'s unreadable but everyone can see encrypted data exists. Steganography hides data so nobody knows it\'s there. Stego-Vault also applies XOR obfuscation on top of the hiding, combining both concepts.'
      },
      {
        q: 'Is Stego-Vault free to use?',
        a: 'Yes! Stego-Vault is a free, open-source academic project built as a DSA coursework demonstration.'
      },
      {
        q: 'Is my data stored anywhere?',
        a: 'No. All processing happens entirely in-memory (RAM). No files are ever written to disk, no data is logged, and nothing is stored on the server. Your data exists only during the brief processing window.'
      }
    ]
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What file types can I use as a carrier?',
        a: 'You can use images (PNG, JPG, BMP, GIF, WebP), videos (MP4, AVI, MKV, MOV), audio (MP3, WAV, FLAC, OGG), documents (PDF, DOCX, PPTX), spreadsheets (XLSX, XLS), and text files (TXT, CSV, JSON, XML, MD) — over 30 formats total.'
      },
      {
        q: 'What can I hide inside a carrier?',
        a: 'Anything! Text messages, images, videos, audio files, documents, spreadsheets, or any other file type. The payload is read as raw bytes, so there are no restrictions on what you can hide.'
      },
      {
        q: 'How much data can I hide in an image?',
        a: 'For image carriers using LSB steganography, the capacity is approximately (width × height) / 8 bytes. A 1000×1000 image can hold about 125 KB. For larger payloads, use video, PDF, or audio carriers which have unlimited capacity.'
      },
      {
        q: 'Will the carrier file still work normally after hiding data?',
        a: 'Yes! Images look identical, videos play normally, PDFs open correctly, audio files sound the same. The changes are either below the perceptual threshold (LSB) or appended after the file\'s natural end marker.'
      },
      {
        q: 'What steganography techniques are used?',
        a: 'Three techniques: (1) LSB Steganography with Spiral Matrix Traversal for images, (2) XOR-obfuscated Append Steganography for binary files like PDF/video/audio/office, and (3) Zero-Width Unicode Character encoding for text files.'
      },
      {
        q: 'Why does the image carrier use spiral traversal instead of linear?',
        a: 'Linear (left-to-right, top-to-bottom) LSB embedding creates detectable patterns that steganalysis tools can find. Spiral traversal distributes the data non-linearly across the image matrix, making pattern detection significantly harder.'
      },
    ]
  },
  {
    category: 'DSA Concepts',
    items: [
      {
        q: 'Which Data Structures are used?',
        a: 'Min-Heap Priority Queue (Huffman tree construction), Binary Tree (Huffman coding), Hash Maps (frequency counting and code storage), 2D Arrays (image pixel matrix), Strings (binary representation and payload packaging).'
      },
      {
        q: 'Which Algorithms are demonstrated?',
        a: 'Greedy Algorithm (Huffman coding), Tree Traversal (DFS for Huffman code generation), Spiral Matrix Traversal (pixel navigation), Bitwise Operations (LSB manipulation), XOR Cipher (payload obfuscation), Linear Congruential Generator (key derivation).'
      },
      {
        q: 'What is the time complexity?',
        a: 'Huffman: O(n log n) for tree construction. Spiral traversal: O(W×H) for image dimensions. LSB embed/extract: O(payload_size). Binary append: O(payload_size). Overall: dominated by the carrier processing step.'
      },
    ]
  },
  {
    category: 'Troubleshooting',
    items: [
      {
        q: 'I get "Cannot connect to backend" error',
        a: 'Make sure the C++ backend server is running on port 8080. Compile with: g++ main.cpp -o stego_server -std=c++17 -lws2_32 (Windows) or -pthread (Linux), then run ./stego_server.'
      },
      {
        q: 'Image carrier says "too small for payload"',
        a: 'The secret data is larger than what the image can hold. Use a larger image or switch to a non-image carrier (PDF, video, audio) which can hold unlimited data.'
      },
      {
        q: '"No hidden data found" when decoding',
        a: 'Make sure you\'re uploading a file that was actually encoded with Stego-Vault. Also ensure the file type matches — an image encoded with Stego-Vault should be decoded as an image, not as a PDF.'
      },
    ]
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <ChevronDown size={18} className={`faq-chevron ${open ? 'rotated' : ''}`} />
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="faq-answer">
          <p>{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <motion.div {...fadeUp}>
          <h1 className="page-header-title">Frequently Asked Questions</h1>
          <p className="page-header-subtitle">Everything you need to know about Stego-Vault and steganography.</p>
        </motion.div>
      </section>

      {/* FAQ Sections */}
      {faqs.map((section, i) => (
        <section key={i} className={`section ${i % 2 === 1 ? 'section-alt' : ''}`}>
          <div className="container narrow">
            <motion.div className="section-header" {...fadeUp}>
              <h2 className="section-title">{section.category}</h2>
            </motion.div>
            <div className="faq-list">
              {section.items.map((item, j) => (
                <motion.div key={j} {...fadeUp} transition={{ delay: j * 0.05 }}>
                  <FAQItem q={item.q} a={item.a} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <h2 className="section-title">Still have questions?</h2>
            <p className="section-subtitle mb-6">Check the documentation or try the tool yourself.</p>
            <div className="hero-actions">
              <Link to="/docs" className="btn btn-ghost btn-lg">Read Documentation</Link>
              <Link to="/tool" className="btn btn-primary btn-lg">
                <Lock size={18} /> Launch Tool <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
