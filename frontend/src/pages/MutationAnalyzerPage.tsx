import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dna, ShieldAlert, Zap, AlertTriangle, Play, RefreshCw } from 'lucide-react';

interface MutationDetail {
  id: string;
  name: string;
  category: string;
  wildTypeCodon: string;
  mutantCodon: string;
  description: string;
  severity: number; // 1-10
}

export const MutationAnalyzerPage: React.FC = () => {
  const { updateMutations, mutations, metrics, clinicalRisks, mutationImpact } = useApp();
  const [selectedMutations, setSelectedMutations] = useState<string[]>([...mutations]);
  const [running, setRunning] = useState<boolean>(false);

  const mutationCatalog: MutationDetail[] = [
    {
      id: 'TP53',
      name: 'TP53 (p53 Tumor Suppressor)',
      category: 'Loss of Function Checkpoint',
      wildTypeCodon: 'C-G-C-T-G-T-G-C-A-T-G-T-A-G-C',
      mutantCodon: 'C-G-C-T-G-T-[T-A-T]-T-G-T-A-G-C', // Point mutation
      description: 'Loss of essential DNA-damage arrest capabilities. Compromises G1/S phase cell checkpoints and blocks apoptotic induction cascades during severe stress.',
      severity: 9.6
    },
    {
      id: 'KRAS',
      name: 'KRAS (GTPase Signaler)',
      category: 'Gain of Function Oncogene',
      wildTypeCodon: 'G-G-T-G-G-C-G-T-G-G-G-C-A-A-G',
      mutantCodon: 'G-G-T-G-[A]-C-G-T-G-G-G-C-A-A-G',
      description: 'Locks regulatory signaling GTPases in a permanent active GTP-bound state, continuously triggering downstream proliferation signals.',
      severity: 8.9
    },
    {
      id: 'EGFR',
      name: 'EGFR (Receptor Kinase)',
      category: 'Hyperactive Receptor Tyrosine Kinase',
      wildTypeCodon: 'A-C-G-G-A-A-T-G-C-G-T-G-C-C-A',
      mutantCodon: 'A-C-[T]-A-A-T-G-C-G-T-G-C-C-A',
      description: 'Drives autonomous ligand-independent receptor dimerizations, causing hyperactive protein synthesis rates and mitotic progression.',
      severity: 8.4
    },
    {
      id: 'BRCA1',
      name: 'BRCA1 (DNA Repair complex)',
      category: 'DNA Damage Repair Deficit',
      wildTypeCodon: 'A-A-A-T-G-T-G-T-G-T-G-T-T-G-T',
      mutantCodon: 'A-A-A-T-[A-A]-G-T-G-T-G-T-T-G-T',
      description: 'Inactivates vital homologous recombination double-stranded DNA repair mechanisms, elevating localized genomic instability indexes.',
      severity: 7.8
    }
  ];

  const handleToggleMutation = (id: string) => {
    if (selectedMutations.includes(id)) {
      setSelectedMutations(selectedMutations.filter(m => m !== id));
    } else {
      setSelectedMutations([...selectedMutations, id]);
    }
  };

  const handleApplyMutations = async () => {
    setRunning(true);
    await updateMutations(selectedMutations);
    setTimeout(() => {
      setRunning(false);
    }, 1200);
  };

  const handleResetMutations = async () => {
    setSelectedMutations([]);
    await updateMutations([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Column: Genetic Toggle Console */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            GENOMIC MUTATION ANALYZER
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Introduce specific genomic nucleotide transfections virtually. Map structural codon shifts against localized health metrics and cancer risk indicators.
          </p>
        </div>

        {/* Mutation choices list */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
            Target Gene Mutation Profile
          </label>
          <div className="flex flex-col gap-3">
            {mutationCatalog.map(m => {
              const isSelected = selectedMutations.includes(m.id);
              return (
                <div 
                  key={m.id}
                  onClick={() => handleToggleMutation(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-cyber-purple/10 border-cyber-purple/50 shadow-purple'
                      : 'bg-white/[0.01] border-white/5 hover:border-cyber-purple/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-cyber-purple font-bold uppercase">{m.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.severity > 8.5 ? 'bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/25' : 'bg-cyber-warning/10 text-cyber-warning border border-cyber-warning/25'
                    }`}>
                      SEVERITY: {m.severity.toFixed(1)}/10
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase mb-2">{m.name}</h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-3 text-[11px]">{m.description}</p>
                  
                  {/* Visual Codon Alignments */}
                  <div className="p-3.5 rounded bg-[#070c17] border border-white/5 font-mono text-[10px] flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">WILD-TYPE:</span>
                      <span className="text-cyber-green tracking-wide">{m.wildTypeCodon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">MUTATED:</span>
                      <span className="text-cyber-rose tracking-wide font-bold">{m.mutantCodon}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleApplyMutations}
            disabled={running}
            className={`flex-1 py-3.5 rounded-lg font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              running 
                ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green cursor-wait'
                : 'bg-cyber-purple/15 border border-cyber-purple/40 hover:bg-cyber-purple/25 text-cyber-purple hover:shadow-purple'
            }`}
          >
            {running ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <Play className="w-4.5 h-4.5" />}
            {running ? 'SYNCHRONIZING TRANSACTIONS...' : 'APPLY MUTATIONS TO MODEL'}
          </button>
          
          <button
            onClick={handleResetMutations}
            className="px-6 py-3.5 rounded-lg font-mono font-bold text-xs uppercase border border-white/10 hover:border-cyber-rose/40 hover:bg-cyber-rose/5 text-white transition-all"
          >
            RESTORE WILD-TYPE
          </button>
        </div>

      </div>

      {/* Right Column: AI Severity Dashboard */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        {mutations.length > 0 ? (
          <div className="flex flex-col gap-6 font-mono text-xs">
            
            {/* Header */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Mutational Profiler</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                Genomic Impact Analysis
              </h3>
              <div className="w-full h-[1px] bg-white/5" />
            </div>

            {/* Oncogenesis risk forecast bar */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-400">
                <span>ONCOGENESIS PROBABILITY</span>
                <span className="text-cyber-purple font-bold">{clinicalRisks.oncogenesis_probability.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-cyber-purple transition-all duration-500"
                  style={{ width: `${clinicalRisks.oncogenesis_probability}%` }}
                />
              </div>
            </div>

            {/* Active mutations impact logs */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyber-rose animate-pulse" />
                PATHOGENIC RISKS LOG
              </h4>
              <div className="flex flex-col gap-2.5">
                {Object.entries(mutationImpact).map(([mutName, info]: [string, any]) => (
                  <div key={mutName} className="p-3 rounded bg-cyber-rose/5 border border-cyber-rose/25 text-[10px] flex flex-col gap-1 leading-relaxed">
                    <div className="flex justify-between items-center font-bold text-cyber-rose uppercase">
                      <span>{mutName} Mutation</span>
                      <span>Grade: {info.grade}</span>
                    </div>
                    <p className="text-gray-400 font-light">{info.impact}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 h-full">
            <Dna className="w-8 h-8 mb-3 text-cyber-purple animate-pulse" />
            <p className="text-xs">No genetic mutations applied. Select and transfect genomic codings on the left to measure severity impact logs.</p>
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
