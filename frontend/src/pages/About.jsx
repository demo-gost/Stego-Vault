import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Code, Cpu, Users, ArrowRight, Target, BookOpen, Zap } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const techStack = [
  { category: 'Frontend', items: ['React 19', 'Vite 7', 'TailwindCSS 3', 'Framer Motion 12', 'React Router 7', 'Axios', 'Lucide Icons'] },
  { category: 'Backend', items: ['C++17', 'httplib (Header-only HTTP)', 'stb_image / stb_image_write', 'Custom Steganography Engine', 'In-Memory Processing'] },
  { category: 'Deployment', items: ['Docker (gcc:latest)', 'Render.com', 'Dockerfile with -O3 optimization'] },
  { category: 'DSA Concepts', items: ['Huffman Coding (Greedy)', 'Min-Heap Priority Queue', 'Spiral Matrix Traversal', 'LSB Bit Manipulation', 'XOR Cipher', 'Zero-Width Unicode', 'Hash Maps'] },
];

const goals = [
  { icon: Shield, title: 'Security First', desc: 'All operations run in-memory with zero disk storage. Data is XOR-obfuscated and hidden below the perceptual threshold.' },
  { icon: Zap, title: 'Universal Compatibility', desc: 'Support 30+ file formats as carriers — images, videos, audio, PDFs, office documents, and text files.' },
  { icon: Cpu, title: 'Performance', desc: 'Native C++ backend compiled with -O3 optimization. In-memory processing with no I/O bottlenecks.' },
  { icon: BookOpen, title: 'Educational Value', desc: 'Demonstrate real-world application of DSA concepts: greedy algorithms, trees, matrices, bit manipulation, and hashing.' },
];

export default function About() {
  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <motion.div {...fadeUp}>
          <h1 className="page-header-title">About Stego-Vault</h1>
          <p className="page-header-subtitle">The story, team, and technology behind the universal steganography platform.</p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container narrow">
          <motion.div {...fadeUp}>
            <div className="about-mission-card">
              <Target size={32} className="about-mission-icon" />
              <h2 className="about-mission-title">Our Mission</h2>
              <p className="about-mission-desc">
                Stego-Vault was built as a capstone DSA project to demonstrate how Data Structures and Algorithms
                power real-world security applications. We took the concept of steganography — hiding data in plain sight —
                and built a production-grade, full-stack platform that supports hiding any type of data inside any type of file.
              </p>
              <p className="about-mission-desc">
                Unlike simple academic demos, Stego-Vault is engineered for real deployment: containerized with Docker,
                with a professional React frontend and a high-performance C++ backend that processes everything in-memory.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Project Goals</h2>
          </motion.div>
          <div className="goals-grid">
            {goals.map((g, i) => (
              <motion.div key={i} className="goal-card" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <g.icon size={24} className="goal-icon" />
                <h3 className="goal-title">{g.title}</h3>
                <p className="goal-desc">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">Everything that powers Stego-Vault under the hood.</p>
          </motion.div>
          <div className="techstack-grid">
            {techStack.map((ts, i) => (
              <motion.div key={i} className="techstack-card" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <h3 className="techstack-title">{ts.category}</h3>
                <ul className="techstack-list">
                  {ts.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-alt">
        <div className="container">
          <motion.div className="section-header" {...fadeUp}>
            <h2 className="section-title">Built by Group 1</h2>
            <p className="section-subtitle">DSA Course Project — 2026</p>
          </motion.div>
          <motion.div className="team-card" {...fadeUp}>
            <Users size={48} className="team-icon" />
            <h3 className="team-title">Group 1</h3>
            <p className="team-desc">
              This project was developed as part of our Data Structures & Algorithms coursework, 
              demonstrating practical application of greedy algorithms, trees, matrices, bit manipulation, 
              and hash maps in building a real-world security tool.
            </p>
            <Link to="/tool" className="btn btn-primary">
              Try Our Tool <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
