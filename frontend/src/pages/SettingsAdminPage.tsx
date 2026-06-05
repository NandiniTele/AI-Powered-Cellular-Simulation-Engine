import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, RefreshCw, Cpu, Database, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsAdminPage: React.FC = () => {
  const { user } = useApp();
  
  // Local config parameters
  const [speed, setSpeed] = useState<string>('1.0Hz');
  const [learningRate, setLearningRate] = useState<number>(0.25);
  const [sensitivity, setSensitivity] = useState<number>(1.2);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const handleSyncDatabases = () => {
    setSyncing(true);
    setSyncSuccess(false);

    // Simulate biological dataset download delay (NCBI / PubChem)
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      
      confetti({
        particleCount: 30,
        spread: 40,
        colors: ['#00f2fe', '#00ff87']
      });

      // Clear success indicator after 3 seconds
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Column: Admin and Biophysics Settings Panel */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            ADMIN & SETTINGS PANEL
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Adjust active biological network parameters, tune AI GNN weighting scales, and synchronize clinical databases.
          </p>
        </div>

        {/* Configurations grid */}
        <div className="flex flex-col gap-5 font-mono text-xs text-white">
          
          {/* Simulation speeds */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
              Cellular Engine Telemetry Speed
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['PAUSED', '1.0Hz', '2.0Hz', '5.0Hz'].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-3 rounded-lg border transition-all ${
                    speed === s 
                      ? 'bg-cyber-cyan/15 border-cyber-cyan/50 text-cyber-cyan font-bold shadow-cyan'
                      : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-cyber-cyan/30 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* AI GNN GCN weights tuning */}
          <div className="flex flex-col gap-4 border-t border-white/5 pt-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5 mb-2">
              <Cpu className="w-4 h-4 text-cyber-purple" />
              AI GNN MODEL TUNERS
            </h4>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">GNN Graph Convolution learning rate (α)</span>
                <span className="text-cyber-purple font-bold">{learningRate.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.95" 
                step="0.05" 
                value={learningRate} 
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-purple focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-400">Macromolecular Activation sensitivity coefficient</span>
                <span className="text-cyber-purple font-bold">{sensitivity.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.5" 
                step="0.1" 
                value={sensitivity} 
                onChange={e => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-purple focus:outline-none"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Right Column: User profile and Database Sync status cards */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        <div className="flex flex-col gap-6 font-mono text-xs">
          
          {/* Header */}
          <div>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Scientist Profile</span>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
              LAB WORKSPACE METRICS
            </h3>
            <div className="w-full h-[1px] bg-white/5" />
          </div>

          {/* User profile detail block */}
          {user && (
            <div className="p-4 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-cyber-cyan font-bold uppercase text-[10px]">
                <User className="w-4 h-4 text-cyber-cyan" />
                <span>USER CREDENTIALS SIGNED</span>
              </div>
              <div className="flex flex-col gap-1.5 text-gray-400 text-[11px]">
                <p>Username: <span className="text-white font-semibold">{user.username}</span></p>
                <p>Email: <span className="text-white font-semibold">{user.email}</span></p>
                <p>Focus role: <span className="text-cyber-cyan font-bold uppercase">{user.lab_role}</span></p>
              </div>
            </div>
          )}

          {/* Database Sync utilities */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyber-green" />
              CLINICAL DATABASE SYNC
            </h4>
            
            <button
              onClick={handleSyncDatabases}
              disabled={syncing}
              className={`w-full py-3.5 rounded-lg font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                syncing 
                  ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green cursor-wait'
                  : 'bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'UPDATING NCBI SEQUENCES...' : 'SYNC NIH / PUBCHEM DATA'}
            </button>

            {syncSuccess && (
              <div className="mt-3 p-2.5 rounded bg-cyber-green/5 border border-cyber-green/25 text-[10px] text-cyber-green font-bold text-center">
                ✅ NCBI databases synchronized. 28,490 genomes matched.
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-cyan" />
          <span>Biophysics parameters secure. Lab standard protocol 2026.</span>
        </div>

      </div>

    </div>
  );
};
