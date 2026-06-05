import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, ShieldAlert, Fingerprint, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('admin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('admin');
  const [role, setRole] = useState<string>('Lead Researcher');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin 
      ? 'http://127.0.0.1:8000/api/auth/login' 
      : 'http://127.0.0.1:8000/api/auth/register';

    const payload = isLogin 
      ? { username, password }
      : { username, email, password, lab_role: role };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Verification failure.');
      }

      // Simulate fingerprint scanning delay for immersive experience
      setTimeout(() => {
        login(data.token, data.user);
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'System connectivity failure.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#04060f] bio-grid scanline">
      {/* Background glow flares */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyber-cyan/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-20">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 mb-3">
            <Fingerprint className={`w-8 h-8 ${loading ? 'text-cyber-green animate-pulse' : 'text-cyber-cyan'}`} />
          </div>
          <h2 className="text-2xl font-bold font-mono tracking-wider text-white uppercase">
            BIOMETRIC SECURE GATE
          </h2>
          <p className="text-gray-500 font-mono text-xs mt-1">
            Access Virtual Subcellular Simulation Workspace
          </p>
        </div>

        {/* Credentials Form Box */}
        <div className="glass-panel p-8 rounded-xl border border-white/5 relative overflow-hidden">
          
          {/* Glowing laser scanline animation when loading */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan/60 animate-bounce shadow-cyan" />
          )}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-cyber-rose/10 border border-cyber-rose/30 flex items-start gap-2.5 text-xs text-cyber-rose font-mono">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            <div>
              <label className="block text-gray-400 font-semibold tracking-wider mb-2 uppercase">
                Researcher Identifier
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter unique ID / username"
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-400 font-semibold tracking-wider mb-2 uppercase">
                  Biomedical Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@institute.edu"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 font-semibold tracking-wider mb-2 uppercase">
                Access Passcode
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-400 font-semibold tracking-wider mb-2 uppercase">
                  Laboratory Focus Role
                </label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#070b16] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all"
                >
                  <option value="Lead Researcher">Lead Researcher</option>
                  <option value="Computational Biologist">Computational Biologist</option>
                  <option value="Pharmacologist">Pharmacologist</option>
                  <option value="Oncology Innovator">Oncology Innovator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 border flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-cyber-green/20 border-cyber-green/40 text-cyber-green cursor-wait' 
                  : 'bg-cyber-cyan/10 border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan'
              }`}
            >
              {loading ? (
                <>
                  <UserCheck className="w-5 h-5 animate-bounce" />
                  ANALYZING RECENT SCAN...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  {isLogin ? 'VERIFY CREDENTIALS' : 'GENERATE NEW KEY'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-gray-400 hover:text-cyber-cyan font-mono text-xs transition-colors"
            >
              {isLogin 
                ? "First time? Register scientist signature" 
                : "Registered scientist? Back to secure gate"}
            </button>
          </div>

        </div>

        {/* Security Alert standard notice */}
        <p className="text-center text-[10px] font-mono text-gray-600 mt-6 max-w-xs mx-auto leading-relaxed">
          Authorized personnel only. Dynamic AI biometric encryption standard active under protocol 2026.
        </p>

      </div>
    </div>
  );
};
