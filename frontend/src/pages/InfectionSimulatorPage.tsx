import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, Activity, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

interface InfectionDetail {
  type: string;
  name: string;
  receptor: string;
  hallmark: string;
  description: string;
  immuneFactors: string[];
}

export const InfectionSimulatorPage: React.FC = () => {
  const { updateInfection, infection, metrics, clinicalRisks } = useApp();
  const [selectedType, setSelectedType] = useState<string>('Viral');
  const [load, setLoad] = useState<number>(0.4);
  const [running, setRunning] = useState<boolean>(false);

  const catalog: InfectionDetail[] = [
    {
      type: 'Viral',
      name: 'Coronaviridae Spike Transfection',
      receptor: 'ACE2 (Angiotensin Converting Enzyme 2)',
      hallmark: 'Ribosomal protein hijack, high cytopathic vacuolization, and extreme cytokine storm.',
      description: 'Hijacks cellular transcription mechanisms. Restricts rough ER protein folding efficiency, drains ATP stocks, and spikes massive intracellular cytokine signals.',
      immuneFactors: ['Interferon-beta (IFN-β)', 'Interleukin-6 (IL-6)', 'T-Cell recruitment']
    },
    {
      type: 'Bacterial',
      name: 'Lipopolysaccharide Toxemia (E. coli)',
      receptor: 'TLR4 (Toll-Like Receptor 4)',
      hallmark: 'Bilayer depolarization, rapid physical cell envelope damage, and septic inflammatory markers.',
      description: 'Disrupts cellular lipid bilayers. Depolarizes membrane potential values closer to zero, compromises metabolic gradient dynamics, and sparks immediate leukocyte leukocyte immune sweeps.',
      immuneFactors: ['Tumor Necrosis Factor-alpha (TNF-α)', 'IL-1 beta (IL-1β)', 'Neutrophil recruitment']
    }
  ];

  const handleTransfect = async () => {
    setRunning(true);
    await updateInfection(selectedType, load);
    setTimeout(() => {
      setRunning(false);
    }, 1200);
  };

  const handleClearInfection = async () => {
    await updateInfection('None', 0.0);
  };

  const currentInfo = catalog.find(i => i.type === selectedType)!;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Column: Infection selectors and transfection loaders */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            INFECTION & IMMUNE SIMULATOR
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Induce simulated viral transfection or bacterial lipopolysaccharide toxemia. Modulate pathogen load density to measure downstream cytokine storm thresholds.
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
            Select Pathological Agent type
          </label>
          <div className="flex gap-4">
            {['Viral', 'Bacterial'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`flex-1 py-3 rounded-lg border transition-all ${
                  selectedType === t 
                    ? 'bg-[#0f1026] border-cyber-rose/50 text-cyber-rose font-bold shadow-rose'
                    : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-cyber-rose/30 hover:text-white'
                }`}
              >
                {t.toUpperCase()} TRANSFECTION
              </button>
            ))}
          </div>
        </div>

        {/* Agent Details specifications */}
        <div className="p-5 rounded-lg border border-cyber-rose/20 bg-cyber-rose/[0.01] font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">ENTRY RECEPTOR BINDING:</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyber-rose font-semibold">
              {currentInfo.receptor}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-2 uppercase">{currentInfo.name}</h4>
          <p className="text-gray-400 leading-relaxed font-light mb-3">{currentInfo.description}</p>
          <p className="text-[11px] text-cyber-rose font-semibold italic bg-cyber-rose/5 border border-cyber-rose/25 p-2 rounded">
            ⚠️ Hallmark: {currentInfo.hallmark}
          </p>
        </div>

        {/* Pathogen load density controller */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center font-mono text-xs">
            <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
              Tuning Pathological Load Density
            </label>
            <span className="text-cyber-rose font-bold text-sm bg-cyber-rose/5 border border-cyber-rose/30 px-3 py-1 rounded">
              {(load * 100).toFixed(0)} MOI / Cell
            </span>
          </div>

          <input 
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05" 
            value={load} 
            onChange={e => setLoad(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-rose focus:outline-none"
          />

          <div className="flex gap-4 mt-2">
            <button
              onClick={handleTransfect}
              disabled={running}
              className={`flex-1 py-3.5 rounded-lg font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                running 
                  ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green cursor-wait'
                  : 'bg-cyber-rose/10 border border-cyber-rose/40 hover:bg-cyber-rose/20 text-cyber-rose hover:shadow-rose'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              {running ? 'TRANSACTING PATHOGENS...' : 'TRANSFECT CELL ENVIRONMENT'}
            </button>

            <button
              onClick={handleClearInfection}
              className="px-6 py-3.5 rounded-lg font-mono font-bold text-xs uppercase border border-white/10 hover:border-cyber-green/40 hover:bg-cyber-green/5 text-white transition-all"
            >
              STERILIZE CYTOPLASM
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Immune Response telemetry */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        {infection.type !== 'None' ? (
          <div className="flex flex-col gap-6 font-mono text-xs">
            
            {/* Header */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Immune Telemetry</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                Active Transfection Profile
              </h3>
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            {/* Cytokine level counter */}
            <div className="p-4 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
              <span className="text-[9px] text-gray-500 font-bold uppercase">CYTOKINE ACCUMULATION</span>
              <span className="text-2xl font-extrabold text-cyber-rose animate-pulse">
                {metrics.cytokine_level.toFixed(1)} pg/mL
              </span>
              <span className="text-[10px] text-gray-400 font-light">
                Healthy baseline: 12.0 pg/mL. Levels exceeding 80 denote storm hyperactivation.
              </span>
            </div>

            {/* Cytokine storm risk meter */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-400">
                <span>CYTOKINE STORM PROBABILITY</span>
                <span className="text-cyber-warning font-bold">{clinicalRisks.cytokine_storm_danger.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyber-warning transition-all duration-500"
                  style={{ width: `${clinicalRisks.cytokine_storm_danger}%` }}
                />
              </div>
            </div>

            {/* Active recruitment cytokines */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                IMMUNE RECRUITMENT FACTORS
              </h4>
              <div className="flex flex-col gap-2">
                {currentInfo.immuneFactors.map(factor => (
                  <div key={factor} className="p-2.5 rounded bg-white/[0.01] border border-white/5 flex items-center gap-2 text-[10px] text-cyber-cyan font-bold">
                    <Shield className="w-3.5 h-3.5 shrink-0 text-cyber-cyan" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 h-full">
            <Shield className="w-8 h-8 mb-3 text-cyber-rose animate-pulse" />
            <p className="text-xs">Cell environment is sterile. Induce a pathogen transfection on the left to activate immune responses.</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-cyber-warning" />
          <span>Active Cell Health Status: {metrics.health_score.toFixed(1)}%</span>
        </div>

      </div>

    </div>
  );
};
