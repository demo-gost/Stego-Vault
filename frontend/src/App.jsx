import { useState } from 'react';
import axios from 'axios';
import { Lock, Unlock, Upload, Key, FileImage, Download, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [result, setResult] = useState(null); // Stores download URL or Decrypted Text

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image!");
    if (mode === 'encrypt' && !message) return alert("Please enter a secret message!");
    
    setStatus("processing");
    const formData = new FormData();
    formData.append("image", file);
    if (mode === 'encrypt') formData.append("secret", message);

    const endpoint = mode === 'encrypt' ? "https://stego-vault-ratt.onrender.com/encode" : "https://stego-vault-ratt.onrender.com/decode";

    try {
      if (mode === 'encrypt') {
        // Encryption returns a File (Blob)
        const response = await axios.post(endpoint, formData, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResult(url);
      } else {
        // Decryption returns Text (JSON or String)
        const response = await axios.post(endpoint, formData);
        setResult(response.data); // The server will send back the hidden string
      }
      setStatus("success");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setMessage("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        
        {/* Header with Toggle */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => { setMode('encrypt'); reset(); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${mode === 'encrypt' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
              <Lock className="w-4 h-4" /> Lock
            </button>
            <button 
              onClick={() => { setMode('decrypt'); reset(); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${mode === 'decrypt' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
              <Unlock className="w-4 h-4" /> Unlock
            </button>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stego-Vault
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {mode === 'encrypt' ? 'Securely hide data inside images' : 'Reveal hidden secrets from images'}
          </p>
        </div>

        {/* Success Screen */}
        {status === 'success' ? (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            
            {mode === 'encrypt' ? (
              <>
                <h2 className="text-xl font-semibold text-white">Encryption Complete!</h2>
                <a href={result} download="stego_locked.png" className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/20">
                  <Download className="w-5 h-5" /> Download Image
                </a>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-white">Secret Found!</h2>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Hidden Message (Binary/Text):</p>
                  <p className="text-green-400 font-mono break-all">{result}</p>
                </div>
              </>
            )}

            <button onClick={reset} className="text-sm text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-4">
              Process Another File
            </button>
          </div>
        ) : (
          /* Input Screen */
          <div className="space-y-6">
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${file ? (mode === 'encrypt' ? 'border-blue-500 bg-blue-500/10' : 'border-purple-500 bg-purple-500/10') : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'}`}>
                {file ? (
                  <div className={`flex items-center justify-center gap-2 ${mode === 'encrypt' ? 'text-blue-400' : 'text-purple-400'}`}>
                    <FileImage className="w-5 h-5" /> <span className="font-medium truncate">{file.name}</span>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drop your image here</p>
                  </div>
                )}
              </div>
            </div>

            {mode === 'encrypt' && (
              <div className="relative">
                <div className="absolute top-3 left-3 text-slate-500"><Key className="w-5 h-5" /></div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your secret message..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-32 resize-none text-slate-300 placeholder-slate-600" />
              </div>
            )}

            <button onClick={handleSubmit} disabled={status === 'processing'} className={`w-full text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${mode === 'encrypt' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'}`}>
              {status === 'processing' ? 'Processing...' : (mode === 'encrypt' ? 'Lock Data' : 'Unlock Data')}
            </button>
            
            {status === 'error' && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">⚠️ Connection Error. Ensure Backend is running!</div>}
          </div>
        )}
      </div>
    </div>
  );
}