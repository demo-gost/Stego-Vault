import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tool from './pages/Tool';
import HowItWorks from './pages/HowItWorks';
import Formats from './pages/Formats';
import Documentation from './pages/Documentation';
import About from './pages/About';
import FAQ from './pages/FAQ';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tool" element={<Tool />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/formats" element={<Formats />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}