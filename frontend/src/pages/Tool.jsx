import { useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Upload, FileAudio, FileText, Image as ImageIcon,
  Download, CheckCircle, ArrowLeft, FileVideo, FileSpreadsheet,
  File, FileType, Eye, EyeOff, Activity, AlertCircle
} from 'lucide-react';

const API_BASE = "https://stego-vault-ratt.onrender.com";

const getFileCategory = (file) => {
  if (!file) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  const categories = {
    image:  { exts: ['png','jpg','jpeg','bmp','gif','webp'], icon: ImageIcon, label: 'Image', color: 'blue', technique: 'LSB + Spiral Matrix' },
    video:  { exts: ['mp4','avi','mkv','mov','webm','flv','wmv'], icon: FileVideo, label: 'Video', color: 'purple', technique: 'Binary Append + XOR' },
    audio:  { exts: ['mp3','wav','flac','ogg','aac','wma','m4a'], icon: FileAudio, label: 'Audio', color: 'pink', technique: 'Binary Append + XOR' },
    pdf:    { exts: ['pdf'], icon: FileText, label: 'PDF', color: 'red', technique: 'Post-EOF Append + XOR' },
    office: { exts: ['docx','xlsx','pptx','doc','xls','ppt','odt','ods'], icon: FileSpreadsheet, label: 'Office', color: 'green', technique: 'Binary Append + XOR' },
    text:   { exts: ['txt','csv','log','md','json','xml','html','css','js'], icon: FileType, label: 'Text', color: 'cyan', technique: 'Zero-Width Unicode' },
  };
  for (const [key, cat] of Object.entries(categories)) {
    if (cat.exts.includes(ext)) return { ...cat, type: key };
  }
  return { icon: File, label: 'File', color: 'slate', type: 'unknown', technique: 'Binary Append + XOR' };
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function Tool() {
  const [mode, setMode] = useState('encrypt');
  const [carrierFile, setCarrierFile] = useState(null);
  const [secretType, setSecretType] = useState('text');
  const [secretText, setSecretText] = useState("");
  const [secretFile, setSecretFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [resultUrl, setResultUrl] = useState(null);
  const [resultText, setResultText] = useState(null);
  const [extractedName, setExtractedName] = useState("");
  const [carrierTypeName, setCarrierTypeName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const carrierCategory = useMemo(() => getFileCategory(carrierFile), [carrierFile]);
  const secretCategory = useMemo(() => getFileCategory(secretFile), [secretFile]);

  const handleSubmit = async () => {
    if (!carrierFile) return alert("Please select a carrier file!");
    if (mode === 'encrypt' && secretType === 'text' && !secretText.trim()) return alert("Please enter a secret message!");
    if (mode === 'encrypt' && secretType === 'file' && !secretFile) return alert("Please select a secret file!");

    setStatus("processing");
    setErrorMsg("");
    const formData = new FormData();
    formData.append("carrier", carrierFile);

    if (mode === 'encrypt') {
      if (secretType === 'text') formData.append("secret_text", secretText);
      else formData.append("secret_file", secretFile);
    }

    const endpoint = mode === 'encrypt' ? `${API_BASE}/encode` : `${API_BASE}/decode`;

    try {
      const response = await axios.post(endpoint, formData, { responseType: 'blob' });

      if (mode === 'encrypt') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResultUrl(url);
        setCarrierTypeName(response.headers['x-carrier-type'] || '');
      } else {
        const filename = response.headers['x-filename'] || 'secret_file.bin';
        setExtractedName(filename);
        setCarrierTypeName(response.headers['x-carrier-type'] || '');
        if (filename === 'secret.txt') {
          const text = await response.data.text();
          setResultText(text);
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          setResultUrl(url);
        }
      }
      setStatus("success");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          setErrorMsg(json.error || "Unknown error");
        } catch { setErrorMsg("Server error"); }
      } else {
        setErrorMsg("Cannot connect to backend. Is the C++ server running on port 8080?");
      }
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus('idle'); setResultUrl(null); setResultText(null);
    setSecretText(""); setSecretFile(null); setCarrierFile(null);
    setErrorMsg(""); setCarrierTypeName("");
  };

  const getDownloadName = () => {
    if (!carrierFile) return "stego_output";
    const parts = carrierFile.name.split('.');
    const ext = parts.pop();
    return `${parts.join('.')}_stego.${ext}`;
  };

  return (
    <div className="page">
      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="section-header">
            <h1 className="section-title">Steganography Tool</h1>
            <p className="section-subtitle">Hide data inside files or extract hidden data from stego files.</p>
          </div>

          <div className="tool-card">
            {/* Tabs */}
            <div className="tool-tabs">
              <button onClick={() => { setMode('encrypt'); reset(); }} className={`tool-tab ${mode === 'encrypt' ? 'active encrypt' : ''}`}>
                <EyeOff size={16} /> Hide Data
              </button>
              <button onClick={() => { setMode('decrypt'); reset(); }} className={`tool-tab ${mode === 'decrypt' ? 'active decrypt' : ''}`}>
                <Eye size={16} /> Extract Data
              </button>
            </div>

            <div className="tool-body">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="tool-success">
                    <CheckCircle size={56} className="tool-success-icon" />
                    <h2 className="tool-success-title">{mode === 'encrypt' ? 'Data Hidden Successfully!' : 'Secret Extracted!'}</h2>

                    {carrierTypeName && (
                      <p className="tool-technique">
                        Technique: <strong>{carrierTypeName === 'image' ? 'LSB + Spiral Matrix' : carrierTypeName === 'text' ? 'Zero-Width Unicode' : 'XOR Append Stego'}</strong>
                      </p>
                    )}

                    {mode === 'encrypt' ? (
                      <a href={resultUrl} download={getDownloadName()} className="btn btn-primary btn-block">
                        <Download size={18} /> Download Stego File
                      </a>
                    ) : (
                      <div className="tool-result-box">
                        <p className="tool-result-label">Extracted: <strong>{extractedName}</strong></p>
                        {resultText ? (
                          <div className="tool-result-text">{resultText}</div>
                        ) : (
                          <a href={resultUrl} download={extractedName} className="btn btn-secondary btn-block">
                            <Download size={18} /> Download {extractedName}
                          </a>
                        )}
                      </div>
                    )}

                    <button onClick={reset} className="btn btn-ghost btn-sm tool-reset-btn">
                      <ArrowLeft size={16} /> Process Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="tool-form">
                    {/* Carrier Upload */}
                    <div className="form-group">
                      <label className="form-label">
                        1. Carrier File <span className="form-hint">(Hide data inside this)</span>
                      </label>
                      <div className={`upload-zone ${carrierFile ? 'has-file' : ''}`}>
                        <input type="file" onChange={(e) => setCarrierFile(e.target.files[0])} className="upload-input" />
                        {carrierFile ? (
                          <div className="upload-file-info">
                            {carrierCategory && <carrierCategory.icon size={22} className="upload-file-icon" />}
                            <div>
                              <p className="upload-file-name">{carrierFile.name}</p>
                              <p className="upload-file-meta">{formatSize(carrierFile.size)} • {carrierCategory?.label} • {carrierCategory?.technique}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <Upload size={28} className="upload-placeholder-icon" />
                            <span>Drop any file — Image, Video, PDF, Audio, Doc...</span>
                            <span className="upload-placeholder-hint">The secret will be hidden inside this file</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secret Input */}
                    {mode === 'encrypt' && (
                      <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="form-label-row">
                          <label className="form-label">2. Secret Data to Hide</label>
                          <div className="toggle-group">
                            <button onClick={() => setSecretType('text')} className={`toggle-btn ${secretType === 'text' ? 'active' : ''}`}>
                              <FileText size={12} /> Text
                            </button>
                            <button onClick={() => setSecretType('file')} className={`toggle-btn ${secretType === 'file' ? 'active' : ''}`}>
                              <File size={12} /> File
                            </button>
                          </div>
                        </div>

                        {secretType === 'text' ? (
                          <textarea
                            value={secretText}
                            onChange={(e) => setSecretText(e.target.value)}
                            placeholder="Type your secret message..."
                            className="form-textarea"
                          />
                        ) : (
                          <div className={`upload-zone small ${secretFile ? 'has-file' : ''}`}>
                            <input type="file" onChange={(e) => setSecretFile(e.target.files[0])} className="upload-input" />
                            {secretFile ? (
                              <div className="upload-file-info">
                                {secretCategory && <secretCategory.icon size={18} className="upload-file-icon" />}
                                <div>
                                  <span className="upload-file-name">{secretFile.name}</span>
                                  <p className="upload-file-meta">{formatSize(secretFile.size)} • {secretCategory?.label}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="upload-placeholder row">
                                <ImageIcon size={18} />
                                <FileVideo size={18} />
                                <FileAudio size={18} />
                                <FileText size={18} />
                                <FileSpreadsheet size={18} />
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Image capacity warning */}
                    {carrierFile && carrierCategory?.type === 'image' && mode === 'encrypt' && (
                      <div className="info-banner">
                        <AlertCircle size={16} />
                        <p><strong>Image carriers</strong> use LSB steganography — payload is limited by image size. For larger secrets, use Video, PDF, or Audio carriers.</p>
                      </div>
                    )}

                    <button onClick={handleSubmit} disabled={status === 'processing'} className={`btn btn-block ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`}>
                      {status === 'processing' ? (
                        <><Activity size={18} className="spin" /> Processing...</>
                      ) : (
                        mode === 'encrypt' ? <><Lock size={18} /> Hide Data Inside File</> : <><Unlock size={18} /> Extract Hidden Data</>
                      )}
                    </button>

                    {status === 'error' && (
                      <div className="error-banner">{errorMsg || "Something went wrong."}</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
