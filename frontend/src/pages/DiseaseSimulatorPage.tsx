import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Heart, Activity, Skull, Zap } from 'lucide-react';

interface DiseasePreset {
  name: string;
  category: string;
  description: string;
  mutations: string[];
  stress: { temp: number; radiation: number; toxicity: number };
  infection: { type: string; load: number };
  cellMorphology: string;
  hallmarks: string[];
}

export const DiseaseSimulatorPage: React.FC = () => {
  const { 
    updateMutations, 
    updateStress, 
    updateInfection, 
    metrics, 
    clinicalRisks 
  } = useApp();
  
  const [selectedDisease, setSelectedDisease] = useState<DiseasePreset | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const diseases: DiseasePreset[] = [
    {
      name: 'Oncogenic Progression',
      category: 'Neoplastic Mutation',
      description: 'Loss of regulatory cell checkpoints. Hyperactive proliferation signals override DNA-damage cell apoptosis controls, establishing warburg glycolysis dynamics.',
      mutations: ['TP53', 'KRAS', 'EGFR'],
      stress: { temp: 37.0, radiation: 0.1, toxicity: 0.0 },
      infection: { type: 'None', load: 0.0 },
      cellMorphology: 'Irregular nuclear envelope, chromatin clumping, and dense cytoplasmic mitochondria clusters supporting accelerated transcription divisions.',
      hallmarks: ['Apoptosis resistance', 'Accelerated glucose glycolysis', 'Unregulated transcription']
    },
    {
      name: 'Mitochondrial Decay (Diabetes)',
      category: 'Metabolic Pathology',
      description: 'ATP synthesis pipeline failure. Oxidative stress increases while the cellular respiratory capability undergoes structural dysfunction, leading to localized starvation.',
      mutations: ['BRCA1'],
      stress: { temp: 37.0, radiation: 0.0, toxicity: 0.35 },
      infection: { type: 'None', load: 0.0 },
      cellMorphology: 'Swollen and fragmented cristae structures inside mitochondria, with cellular bilayer depolarization.',
      hallmarks: ['Drooping ATP synthesis', 'Spiked Reactive Oxygen Species (ROS)', 'Bilayer lipid oxidation']
    },
    {
      name: 'Amyloid Cytotoxicity',
      category: 'Neurodegenerative Stress',
      description: 'Misfolded macromolecule accumulation inside the cytoplasm. Spikes inflammatory markers and depolarizes cell membranes, leading to severe apoptotic activation.',
      mutations: [],
      stress: { temp: 38.2, radiation: 0.0, toxicity: 0.6 },
      infection: { type: 'None', load: 0.0 },
      cellMorphology: 'Aggregated fibrillar inclusions within rough Endoplasmic Reticulum and Golgi apparatus stacks. Swelling cytoplasm.',
      hallmarks: ['Extreme cytokine trigger', 'Rough ER calcium leak', 'Caspase-3 apoptotic activation']
    },
    {
      name: 'Ischemic Cytonecrosis',
      category: 'Cardiovascular Anoxia',
      description: 'Oxygen deprivation. Starves ATP production, depolarizes membrane potential closer to threshold values, and leads to necrotic cell membrane rupture.',
      mutations: [],
      stress: { temp: 37.5, radiation: 0.0, toxicity: 0.8 },
      infection: { type: 'Bacterial', load: 0.25 },
      cellMorphology: 'Complete cytoplasmic vacuolization, blebbing outer cell membrane, and karyolysis (nuclear dissolution).',
      hallmarks: ['Necrotic rupture', 'Bilayer membrane depolarization', 'Total metabolic failure']
    }
  ];

  const handleApplyDiseasePreset = async (preset: DiseasePreset) => {
    setRunning(true);
    setSelectedDisease(preset);
    
    // Apply preset values into global FastAPI biological states
    await updateMutations(preset.mutations);
    await updateStress(preset.stress.temp, preset.stress.radiation, preset.stress.toxicity);
    await updateInfection(preset.infection.type, preset.infection.load);
    
    setTimeout(() => {
      setRunning(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Columns: Preset Toggles & description */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            PATHOLOGY DISEASE BOARD
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Induce simulated human pathologies in real-time. Toggle complex diseases to trace molecular cascades and necrosis trends.
          </p>
        </div>

        {/* Disease list selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diseases.map(d => (
            <div 
              key={d.name}
              onClick={() => handleApplyDiseasePreset(d)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                selectedDisease?.name === d.name 
                  ? 'bg-cyber-purple/10 border-cyber-purple/50 shadow-purple'
                  : 'bg-white/[0.01] border-white/5 hover:border-cyber-purple/30 hover:bg-cyber-purple/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-widest text-cyber-purple uppercase font-bold">
                  {d.category}
                </span>
                <ShieldAlert className="w-4.5 h-4.5 text-cyber-purple" />
              </div>
              <h4 className="text-sm font-bold font-sans text-white uppercase mb-2">
                {d.name}
              </h4>
              <p className="text-gray-500 font-mono text-[10px] leading-relaxed line-clamp-3">
                {d.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disease morphology insights */}
        {selectedDisease && (
          <div className="mt-4 p-5 rounded-lg bg-white/[0.01] border border-white/5 font-mono text-xs">
            <h5 className="text-white font-bold mb-2 uppercase flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-cyber-rose animate-pulse" />
              INSPECTED CYTOPLASMIC MORPHOLOGY
            </h5>
            <p className="text-gray-400 leading-relaxed font-light mb-3">
              {selectedDisease.cellMorphology}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedDisease.hallmarks.map(h => (
                <div key={h} className="px-2.5 py-1 rounded bg-cyber-rose/5 border border-cyber-rose/25 text-cyber-rose text-[9px] font-semibold uppercase">
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Comparative Metrics and Risks */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        {selectedDisease ? (
          <div className="flex flex-col gap-6 font-mono text-xs">
            
            {/* Header info */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Active Profile</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                {selectedDisease.name}
              </h3>
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            {/* Biophysics counters during disease */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                PATHOLOGICAL METRICS
              </h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-light">Cell Vital Health</span>
                  <span className={`font-semibold ${metrics.health_score > 60 ? 'text-cyber-green' : 'text-cyber-rose'}`}>
                    {metrics.health_score.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-light">ATP Droop</span>
                  <span className="text-white font-semibold">
                    {metrics.atp_level.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-500 font-light">Oxidative ROS stress</span>
                  <span className="text-cyber-rose font-semibold">
                    {metrics.oxidative_stress.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-500 font-light">Apoptosis signal</span>
                  <span className="text-cyber-purple font-semibold">
                    {metrics.apoptosis_marker.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI pathology forecasts */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyber-purple" />
                CLINICAL AI TRANSFORMATION RISK
              </h4>
              
              <div className="flex flex-col gap-3.5">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-400">Oncogenesis Probability</span>
                    <span className="text-cyber-purple font-bold">
                      {clinicalRisks.oncogenesis_probability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-cyber-purple transition-all duration-300"
                      style={{ width: `${clinicalRisks.oncogenesis_probability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-400">Cellular Necrotic Risk</span>
                    <span className="text-cyber-rose font-bold">
                      {clinicalRisks.cellular_necrosis_risk.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-cyber-rose transition-all duration-300"
                      style={{ width: `${clinicalRisks.cellular_necrosis_risk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 h-full">
            <Heart className="w-8 h-8 mb-3 text-cyber-purple animate-pulse" />
            <p className="text-xs">No disease target induced. Select a clinical preset profile on the left to begin cellular testing.</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600">
          State active: {running ? 'MUTATION ENGINES RECONFIGURING...' : 'STEADY LOGICAL ENGINE SYNCED'}
        </div>

      </div>

    </div>
  );
};
