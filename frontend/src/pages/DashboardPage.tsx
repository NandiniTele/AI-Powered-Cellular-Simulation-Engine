import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Battery, Zap, AlertTriangle, ShieldCheck, Heart, Trash2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    metrics, 
    clinicalRisks, 
    mutations, 
    drugs, 
    infection, 
    stress, 
    resetCell, 
    setTab, 
    socketConnected 
  } = useApp();

  // Helper to color ATP based on energy efficiency
  const getAtpColor = (val: number) => {
    if (val > 80) return 'text-cyber-green bg-cyber-green/10 border-cyber-green/30';
    if (val > 50) return 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30';
    if (val > 30) return 'text-cyber-warning bg-cyber-warning/10 border-cyber-warning/30';
    return 'text-cyber-rose bg-cyber-rose/10 border-cyber-rose/30 animate-pulse';
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      
      {/* Top Banner Status Bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between font-mono text-xs flex-wrap gap-4 relative overflow-hidden">
        
        {/* Core synchronization alert */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${socketConnected ? 'bg-cyber-green' : 'bg-cyber-rose'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${socketConnected ? 'bg-cyber-green' : 'bg-cyber-rose'}`}></span>
          </div>
          <div>
            <p className="font-semibold text-white uppercase">
              {socketConnected ? 'Biophysics Telemetry Active' : 'Connecting to Lab Engine...'}
            </p>
            <p className="text-gray-500 text-[10px]">Frequency: 1.0Hz (1 sample/sec)</p>
          </div>
        </div>

        {/* Action button deck */}
        <div className="flex items-center gap-3">
          <button 
            onClick={resetCell}
            className="px-4 py-2 rounded-lg border border-cyber-rose/30 hover:border-cyber-rose/60 bg-cyber-rose/5 hover:bg-cyber-rose/15 text-cyber-rose font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            RESET CELL STATE
          </button>
          
          <button 
            onClick={() => setTab('cell-viewer')}
            className="px-4 py-2 rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan/60 bg-cyber-cyan/5 hover:bg-cyber-cyan/15 text-cyber-cyan font-bold transition-all"
          >
            LAUCH CELL GRAPHICS
          </button>
        </div>

      </div>

      {/* Main Core Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Widget 1: Radial Health score */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden md:col-span-1 border border-white/5">
          <Heart className={`absolute top-4 right-4 w-5 h-5 ${metrics.health_score > 70 ? 'text-cyber-green' : metrics.health_score > 40 ? 'text-cyber-cyan' : 'text-cyber-rose animate-bounce'}`} />
          <h3 className="text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-6">
            CELLULAR HEALTH
          </h3>
          
          {/* Radial circular bar representing health */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="42" 
                stroke="rgba(255, 255, 255, 0.02)" 
                strokeWidth="7" fill="none" 
              />
              <circle 
                cx="50" cy="50" r="42" 
                stroke="url(#healthGradient)" 
                strokeWidth="8" fill="none"
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * metrics.health_score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#00ff87" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tighter text-white font-mono leading-none">
                {metrics.health_score.toFixed(0)}%
              </span>
              <span className="text-[10px] text-gray-500 font-mono mt-1 font-semibold uppercase">
                {metrics.health_score > 85 ? 'STABLE' : metrics.health_score > 60 ? 'COMPROMISED' : 'CRITICAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Widget 2: ATP Energy Production */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between md:col-span-1 border border-white/5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                ATP CAPACITY
              </h3>
              <Battery className="w-5 h-5 text-cyber-green" />
            </div>
            
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight leading-none">
                {metrics.atp_level.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase">%</span>
            </div>
            
            <p className="text-xs font-mono text-gray-500 mt-2 leading-relaxed">
              Mitochondrial oxidative phosphorylation rate. Drooping limits molecular pump actions.
            </p>
          </div>

          <div className="mt-4">
            <div className="w-full h-2.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full transition-all duration-300"
                style={{ width: `${metrics.atp_level}%` }}
              />
            </div>
          </div>
        </div>

        {/* Widget 3: Membrane potential */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between md:col-span-1 border border-white/5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                MEMBRANE POLARITY
              </h3>
              <Zap className="w-5 h-5 text-cyber-cyan" />
            </div>

            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight leading-none">
                {metrics.membrane_potential.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-gray-400 uppercase">mV</span>
            </div>

            <p className="text-xs font-mono text-gray-500 mt-2 leading-relaxed">
              Lipid bilayer electrical gradient. Typical resting potential: -70mV. Depolarization spells lysis risk.
            </p>
          </div>

          <div className="mt-4">
            {/* resting voltage scale indicator */}
            <div className="flex items-center justify-between text-[9px] font-mono text-gray-600 mb-1">
              <span>-90mV</span>
              <span>-70mV (Rest)</span>
              <span>-20mV</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/5 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, ((metrics.membrane_potential + 90) / 70) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Widget 4: Active stressors summary panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between md:col-span-1 border border-white/5">
          <div>
            <h3 className="text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-4">
              ACTIVE ENVIRONMENT
            </h3>
            
            <div className="flex flex-col gap-2.5 font-mono text-xs text-white">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-500 font-light">MUTATIONS</span>
                <span className="font-semibold text-cyber-purple uppercase">
                  {mutations.length > 0 ? mutations.join(', ') : 'None (WildType)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-500 font-light">DRUG DOSES</span>
                <span className="font-semibold text-cyber-green uppercase">
                  {drugs.length > 0 ? drugs.map(d => d.name).join(', ') : 'None Applied'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-gray-500 font-light">INFECTION</span>
                <span className="font-semibold text-cyber-rose uppercase">
                  {infection.type !== 'None' ? `${infection.type} (${(infection.load * 100).toFixed(0)}%)` : 'sterile'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 font-light">TEMP STRESS</span>
                <span className="font-semibold text-cyber-cyan">{stress.temp.toFixed(1)}°C</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Middle row: Live Telemetry lists & AI Pathological Risks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Subcellular Telemetry */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 md:col-span-2">
          <h3 className="text-white font-mono text-xs uppercase font-bold tracking-wider mb-6 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            SUBCELLULAR SIGNAL METRICS
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
              <span className="text-gray-500 font-light uppercase text-[10px]">Protein Synthesis</span>
              <span className="text-xl font-bold text-white">{metrics.protein_synthesis.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
              <span className="text-gray-500 font-light uppercase text-[10px]">Oxidative Stress</span>
              <span className="text-xl font-bold text-cyber-rose">{metrics.oxidative_stress.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
              <span className="text-gray-500 font-light uppercase text-[10px]">Apoptosis Index</span>
              <span className="text-xl font-bold text-cyber-purple">{metrics.apoptosis_marker.toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
              <span className="text-gray-500 font-light uppercase text-[10px]">Cytokine level</span>
              <span className="text-xl font-bold text-cyber-warning">{metrics.cytokine_level.toFixed(1)} pg/mL</span>
            </div>
          </div>
        </div>

        {/* Pathological AI Risk forecast */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 md:col-span-1">
          <h3 className="text-white font-mono text-xs uppercase font-bold tracking-wider mb-6 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-cyber-rose" />
            AI PATHOLOGICAL RISK INDEX
          </h3>

          <div className="flex flex-col gap-4 font-mono text-xs">
            
            <div>
              <div className="flex justify-between mb-1 text-[10px]">
                <span className="text-gray-400 font-semibold uppercase">Oncogenic Transformation Risk</span>
                <span className="text-cyber-purple font-bold">
                  {clinicalRisks.oncogenesis_probability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.02] overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyber-purple transition-all duration-300"
                  style={{ width: `${clinicalRisks.oncogenesis_probability}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-[10px]">
                <span className="text-gray-400 font-semibold uppercase">Cytokine Storm Danger</span>
                <span className="text-cyber-warning font-bold">
                  {clinicalRisks.cytokine_storm_danger.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.02] overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyber-warning transition-all duration-300"
                  style={{ width: `${clinicalRisks.cytokine_storm_danger}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-[10px]">
                <span className="text-gray-400 font-semibold uppercase">Necrotic Bilayer Collapse</span>
                <span className="text-cyber-rose font-bold">
                  {clinicalRisks.cellular_necrosis_risk.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.02] overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyber-rose transition-all duration-300"
                  style={{ width: `${clinicalRisks.cellular_necrosis_risk}%` }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
