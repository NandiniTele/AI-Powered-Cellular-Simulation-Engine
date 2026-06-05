import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FlaskConical, Activity, Heart, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface DrugDetail {
  name: string;
  category: string;
  targetReceptor: string;
  description: string;
  colors: { text: string; bg: string; border: string; glow: string };
}

export const DrugTestingPage: React.FC = () => {
  const { applyDrug, clearDrugs, drugs, metrics } = useApp();
  const [selectedDrug, setSelectedDrug] = useState<string>('Metformin');
  const [dose, setDose] = useState<number>(0.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);

  const drugCatalog: DrugDetail[] = [
    {
      name: 'Metformin',
      category: 'Metabolic Sensitizer',
      targetReceptor: 'AMPK (PRKAA1)',
      description: 'Improves cellular metabolic sensitivity, curbs localized oxidative stress (ROS), and inhibits excessive mTOR transcription pathways.',
      colors: { text: 'text-cyber-green', bg: 'bg-cyber-green/5', border: 'border-cyber-green/30', glow: 'shadow-green' }
    },
    {
      name: 'Doxorubicin',
      category: 'Oncogenic Chemotherapy',
      targetReceptor: 'Topoisomerase II / DNA',
      description: 'DNA intercalating agent. High toxicity threshold designed to trigger functional TP53 apoptotic cascades inside rapid dividing cells.',
      colors: { text: 'text-cyber-rose', bg: 'bg-cyber-rose/5', border: 'border-cyber-rose/30', glow: 'shadow-rose' }
    },
    {
      name: 'Remdesivir',
      category: 'Antiviral Inhibitor',
      targetReceptor: 'Viral RdRp (NSP12)',
      description: 'Adenosine nucleoside analogue. Interferes with viral RNA-dependent RNA polymerase replication cycles inside cytoplasm.',
      colors: { text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/5', border: 'border-cyber-cyan/30', glow: 'shadow-cyan' }
    },
    {
      name: 'Amoxicillin',
      category: 'Bacterial Antibiotic',
      targetReceptor: 'Penicillin-Binding Proteins',
      description: 'Beta-lactam bactericidal agent. Disrupts active bacterial cell wall synthesis structures and curbs leukocyte hyperactivation.',
      colors: { text: 'text-cyber-warning', bg: 'bg-cyber-warning/5', border: 'border-cyber-warning/30', glow: 'shadow-orange' }
    },
    {
      name: 'NAC (N-Acetylcysteine)',
      category: 'Antioxidant Scavenger',
      targetReceptor: 'Reactive Oxygen Species',
      description: 'Replenishes cellular glutathione synthesis. Directly sweeps away accumulated oxidative free radicals (ROS).',
      colors: { text: 'text-cyber-purple', bg: 'bg-cyber-purple/5', border: 'border-cyber-purple/30', glow: 'shadow-purple' }
    }
  ];

  const handleApplyTreatment = async () => {
    setLoading(true);
    // Apply drug to FastAPI backend
    const prediction = await applyDrug(selectedDrug, dose);
    
    setTimeout(() => {
      setPredictionResult(prediction);
      setLoading(false);
    }, 1000);
  };

  const handleClearTreatments = async () => {
    await clearDrugs();
    setPredictionResult(null);
  };

  const currentDrugInfo = drugCatalog.find(d => d.name === selectedDrug)!;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Column: Drug selectors and dosage sliders */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            PHARMACOLOGICAL TESTING LAB
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Design virtual therapeutic assays. Modulate molecular weights and dose gradients to map binding indices and cellular survival ratios.
          </p>
        </div>

        {/* Drug Selection Deck */}
        <div className="flex flex-col gap-3">
          <label className="block text-gray-500 font-mono text-[10px] uppercase font-bold tracking-widest">
            Select Active Therapeutic Agent
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
            {drugCatalog.map(d => (
              <button
                key={d.name}
                onClick={() => {
                  setSelectedDrug(d.name);
                  setPredictionResult(null);
                }}
                className={`p-3 rounded-lg border transition-all ${
                  selectedDrug === d.name 
                    ? `bg-[#0c1224] ${d.colors.border} ${d.colors.text} font-bold ${d.colors.glow}`
                    : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-cyber-cyan/30 hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Drug Specs */}
        <div className={`p-5 rounded-lg border ${currentDrugInfo.colors.bg} ${currentDrugInfo.colors.border} font-mono text-xs`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Primary biological target:</span>
            <span className={`px-2 py-0.5 rounded bg-white/5 border border-white/10 ${currentDrugInfo.colors.text} font-semibold`}>
              {currentDrugInfo.targetReceptor}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-2 uppercase">{currentDrugInfo.name} ({currentDrugInfo.category})</h4>
          <p className="text-gray-400 leading-relaxed font-light">{currentDrugInfo.description}</p>
        </div>

        {/* Dosage controllers */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center font-mono text-xs">
            <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
              Tuning Dosage Concentration
            </label>
            <span className="text-cyber-cyan font-bold text-sm bg-cyber-cyan/5 border border-cyber-cyan/30 px-3 py-1 rounded">
              {(dose * 100).toFixed(0)} µM / mL
            </span>
          </div>
          
          <input 
            type="range" 
            min="0.05" 
            max="1.0" 
            step="0.05" 
            value={dose} 
            onChange={e => {
              setDose(parseFloat(e.target.value));
              setPredictionResult(null);
            }}
            className="w-full h-1.5 rounded bg-white/10 appearance-none cursor-pointer accent-cyber-cyan focus:outline-none"
          />

          <div className="flex gap-4 mt-2">
            <button
              onClick={handleApplyTreatment}
              disabled={loading}
              className={`flex-1 py-3.5 rounded-lg font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green cursor-wait'
                  : 'bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan hover:shadow-cyan'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              {loading ? 'CALCULATING MOLECULAR DOCKING...' : 'APPLY VIRTUAL TREATMENT'}
            </button>

            <button
              onClick={handleClearTreatments}
              className="px-6 py-3.5 rounded-lg font-mono font-bold text-xs uppercase border border-cyber-rose/30 hover:border-cyber-rose/60 bg-cyber-rose/5 hover:bg-cyber-rose/15 text-cyber-rose transition-all"
            >
              CLEAR THERAPEUTICS
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: AI Response Profiler */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        {predictionResult ? (
          <div className="flex flex-col gap-6 font-mono text-xs">
            
            {/* Header info */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Molecular Response</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                {predictionResult.drug} (Dose: {predictionResult.dose}x)
              </h3>
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            {/* Docking affinity */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-400">
                <span>MOLECULAR BINDING AFFINITY</span>
                <span className="text-cyber-cyan font-bold">{predictionResult.binding_affinity_pct}%</span>
              </div>
              <div className="w-full h-2 rounded bg-white/5 overflow-hidden border border-white/5 relative">
                <div 
                  className="h-full bg-cyber-cyan transition-all duration-500"
                  style={{ width: `${predictionResult.binding_affinity_pct}%` }}
                />
              </div>
            </div>

            {/* Efficacy and safety levels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase">THERAPEUTIC EFFICACY</span>
                <span className="text-xl font-extrabold text-cyber-green">{predictionResult.therapeutic_efficacy_pct}%</span>
              </div>

              <div className="p-3.5 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase">SIDE EFFECT PROFILE</span>
                <span className="text-xl font-extrabold text-cyber-rose">{predictionResult.side_effects_score}%</span>
              </div>
            </div>

            {/* Affected cellular pathways */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyber-purple" />
                AFFECTED PATHWAYS
              </h4>
              <div className="flex flex-col gap-1.5">
                {predictionResult.affected_pathways.map((path: string) => (
                  <div key={path} className="p-2.5 rounded bg-white/[0.01] border border-white/5 flex items-center gap-2 text-[10px] text-gray-300">
                    <Check className="w-3.5 h-3.5 text-cyber-green shrink-0" />
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 h-full">
            <FlaskConical className="w-8 h-8 mb-3 text-cyber-cyan animate-pulse" />
            <p className="text-xs">No active treatment assay. Select an agent, adjust the concentration slider, and click apply to run the docked predictive models.</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600 flex items-center gap-2">
          <Heart className={`w-3.5 h-3.5 ${metrics.health_score > 60 ? 'text-cyber-green' : 'text-cyber-rose animate-pulse'}`} />
          <span>Active Cell Health Status: {metrics.health_score.toFixed(1)}%</span>
        </div>

      </div>

    </div>
  );
};
