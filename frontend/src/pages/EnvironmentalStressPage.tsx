import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldAlert, AlertTriangle, Zap, Play, RefreshCw } from 'lucide-react';

export const EnvironmentalStressPage: React.FC = () => {
  const { updateStress, stress, metrics, clinicalRisks } = useApp();
  
  // Local state for environmental sliders
  const [temp, setTemp] = useState<number>(stress.temp);
  const [radiation, setRadiation] = useState<number>(stress.radiation);
  const [toxicity, setToxicity] = useState<number>(stress.toxicity);
  const [running, setRunning] = useState<boolean>(false);

  const handleApplyStress = async () => {
    setRunning(true);
    await updateStress(temp, radiation, toxicity);
    setTimeout(() => {
      setRunning(false);
    }, 1000);
  };

  const handleResetStress = async () => {
    setTemp(37.0);
    setRadiation(0.0);
    setToxicity(0.0);
    await updateStress(37.0, 0.0, 0.0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Columns: Stress Controls Decks */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            PHYSICAL STRESS MODULE
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Subject cellular structures to simulated physical stress factors. Modulate temperatures, ionization radiation frequencies, and chemical cytotoxins to trace adaptation responses.
          </p>
        </div>

        {/* Sliders Grid */}
        <div className="flex flex-col gap-5 font-mono text-xs">
          
          {/* Temperature Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
                Thermal Incubation Temperature
              </span>
              <span className="text-cyber-cyan font-bold text-sm bg-cyber-cyan/5 border border-cyber-cyan/30 px-3 py-1 rounded">
                {temp.toFixed(1)} °C
              </span>
            </div>
            <input 
              type="range" 
              min="35.0" 
              max="43.0" 
              step="0.1" 
              value={temp} 
              onChange={e => setTemp(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-cyan focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>37.0°C (Homeostasis)</span>
              <span>40.0°C (Pyrexia)</span>
              <span>42.0°C (Denaturation Threshold)</span>
            </div>
          </div>

          {/* UV Radiation Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
                Ionization UV Radiation Dosage
              </span>
              <span className="text-cyber-purple font-bold text-sm bg-cyber-purple/5 border border-cyber-purple/30 px-3 py-1 rounded">
                {(radiation * 100).toFixed(0)} rad / hr
              </span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="1.0" 
              step="0.05" 
              value={radiation} 
              onChange={e => setRadiation(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-purple focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>0.0 rad (Sterile)</span>
              <span>0.5 rad (Double Strand Break Breaks)</span>
              <span>1.0 rad (Nuclear Karyolysis)</span>
            </div>
          </div>

          {/* Chemical Toxicity Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
                Cytotoxic Chemical Concentration
              </span>
              <span className="text-cyber-rose font-bold text-sm bg-cyber-rose/5 border border-cyber-rose/30 px-3 py-1 rounded">
                {(toxicity * 100).toFixed(0)} ppm
              </span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="1.0" 
              step="0.05" 
              value={toxicity} 
              onChange={e => setToxicity(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-rose focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>0.0 ppm (Pure)</span>
              <span>0.5 ppm (Lipid Bilayer Bilayer Decay)</span>
              <span>1.0 ppm (Apoptotic Lysis)</span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleApplyStress}
            disabled={running}
            className={`flex-1 py-3.5 rounded-lg font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              running 
                ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green cursor-wait'
                : 'bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan'
            }`}
          >
            {running ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <Play className="w-4.5 h-4.5" />}
            {running ? 'TRANSDUCING MOLECULAR SIGNALS...' : 'APPLY STRESS FACTORS'}
          </button>
          
          <button
            onClick={handleResetStress}
            className="px-6 py-3.5 rounded-lg font-mono font-bold text-xs uppercase border border-white/10 hover:border-cyber-rose/40 hover:bg-cyber-rose/5 text-white transition-all"
          >
            RESTORE STABLE CLIMATE
          </button>
        </div>

      </div>

      {/* Right Column: Heat-Shock response and Necrosis telemetry */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        <div className="flex flex-col gap-6 font-mono text-xs">
          
          {/* Header */}
          <div>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Stress Telemetry</span>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
              Environmental adaptation
            </h3>
            <div className="w-full h-[1px] bg-white/5" />
          </div>

          {/* Heat shock protein indicator */}
          <div className="p-4 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
            <span className="text-[9px] text-gray-500 font-bold uppercase">HEAT SHOCK RESPONSE (Hsp70)</span>
            <span className={`text-2xl font-extrabold ${stress.temp > 38 ? 'text-cyber-warning animate-pulse' : 'text-cyber-green'}`}>
              {stress.temp > 37 ? `${((stress.temp - 37) * 20).toFixed(0)}% Activation` : 'Homeostasis (0%)'}
            </span>
            <span className="text-[10px] text-gray-400 font-light">
              Activates protein-folding chaperone molecules (Hsp) to protect amino chains from denaturation during pyrexia.
            </span>
          </div>

          {/* Necrotic bilayer collapse risk */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-400">
              <span>NECROTIC BILAYER COLLAPSE RISK</span>
              <span className="text-cyber-rose font-bold">{clinicalRisks.cellular_necrosis_risk.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-cyber-rose transition-all duration-500"
                style={{ width: `${clinicalRisks.cellular_necrosis_risk}%` }}
              />
            </div>
          </div>

          {/* Biophysics markers alerts */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyber-rose animate-pulse" />
              PATHOLOGICAL ALERTS
            </h4>
            <div className="flex flex-col gap-2">
              {metrics.oxidative_stress > 30 && (
                <div className="p-2.5 rounded bg-cyber-rose/5 border border-cyber-rose/25 text-[10px] text-cyber-rose font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>CRITICAL: High intracellular ROS concentrations.</span>
                </div>
              )}
              {metrics.membrane_potential > -50 && (
                <div className="p-2.5 rounded bg-cyber-warning/5 border border-cyber-warning/25 text-[10px] text-cyber-warning font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>WARNING: Subcellular membrane depolarizing closer to threshold.</span>
                </div>
              )}
              {metrics.oxidative_stress <= 30 && metrics.membrane_potential <= -50 && (
                <div className="p-2.5 rounded bg-cyber-green/5 border border-cyber-green/25 text-[10px] text-cyber-green font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>STABLE: No critical stressors detected.</span>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600 flex items-center gap-2">
          <span>Active Cell Health Status: {metrics.health_score.toFixed(1)}%</span>
        </div>

      </div>

    </div>
  );
};
