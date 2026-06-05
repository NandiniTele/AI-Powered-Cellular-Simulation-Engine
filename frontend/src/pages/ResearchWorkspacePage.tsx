import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Trash2, Calendar, FileJson, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResearchWorkspacePage: React.FC = () => {
  const { savedExperiments, saveExperiment, deleteExperiment, metrics } = useApp();
  const [title, setTitle] = useState<string>('');
  const [hypothesis, setHypothesis] = useState<string>('');

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hypothesis) return;

    saveExperiment(title, hypothesis);
    
    // Biomedical celebration trigger!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#00ff87', '#d946ef']
    });

    setTitle('');
    setHypothesis('');
  };

  const handleExportJSON = (exp: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exp, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `experiment_${exp.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left Columns: Lab notebook and hypothesis logs */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 border border-white/5 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase mb-2">
            RESEARCH LOG WORKSPACE
          </h3>
          <p className="text-gray-400 font-mono text-xs font-light">
            Record clinical observations, formulate hypotheses, and capture snapshots of subcellular environments for historical comparisons.
          </p>
        </div>

        {/* Notebook entry form */}
        <form onSubmit={handleSaveNote} className="flex flex-col gap-4 font-mono text-xs">
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
              Experiment Assay Title
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., TP53 Knockout response under Metformin therapy"
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-500 uppercase font-bold tracking-widest text-[10px]">
              Scientific Hypothesis Focus
            </label>
            <textarea 
              required
              rows={4}
              value={hypothesis}
              onChange={e => setHypothesis(e.target.value)}
              placeholder="e.g., I hypothesize that administering Metformin at 0.6 µM will damp the reactive oxygen species (ROS) spikes induced by BRCA1 damage, restoring health metrics by at least 15%."
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-white focus:border-cyber-cyan/50 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-lg font-mono font-bold text-xs uppercase bg-cyber-green/10 border border-cyber-green/45 hover:bg-cyber-green/20 text-cyber-green transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Send className="w-4.5 h-4.5" />
            COMMIT SNAPSHOT TO WORKSPACE
          </button>
        </form>

      </div>

      {/* Right Column: Historical logs list */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between max-h-[600px]">
        
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 h-full font-mono text-xs">
          <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-4 h-4 text-cyber-cyan" />
            LAB SNAPSHOT LOGS ({savedExperiments.length})
          </h4>

          {savedExperiments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {savedExperiments.map(e => (
                <div key={e.id} className="p-4 rounded bg-white/[0.01] border border-white/5 flex flex-col gap-2.5 relative group">
                  
                  {/* Delete button absolute */}
                  <button 
                    onClick={() => deleteExperiment(e.id)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-cyber-rose transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <span className="text-[9px] text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {e.timestamp}
                    </span>
                    <h5 className="text-sm font-bold text-white uppercase tracking-tight mt-1 leading-snug">
                      {e.title}
                    </h5>
                  </div>

                  <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                    Hypothesis: {e.hypothesis}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-[#060c18] p-2.5 rounded border border-white/5 text-[9px] text-gray-500">
                    <div>
                      <p className="font-semibold text-white">Outcomes:</p>
                      <p>Cell Health: {e.outcome.health.toFixed(1)}%</p>
                      <p>ATP Production: {e.outcome.atp.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Conditions:</p>
                      <p>Mutations: {e.conditions.mutations.length}</p>
                      <p>Drugs: {e.conditions.drugs.length}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExportJSON(e)}
                    className="w-fit py-1 px-2.5 rounded border border-cyber-cyan/30 hover:border-cyber-cyan/60 bg-cyber-cyan/5 text-cyber-cyan text-[9px] font-bold uppercase transition-all flex items-center gap-1"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    EXPORT DATASET
                  </button>

                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-gray-600 h-64 shrink-0">
              <BookOpen className="w-8 h-8 mb-3" />
              <p className="text-[10px]">No historical notes logged. Commit a biological assay using the form on the left.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-gray-600 flex items-center gap-2 shrink-0">
          <Check className="w-3.5 h-3.5 text-cyber-green" />
          <span>Active Cell Health Status: {metrics.health_score.toFixed(1)}%</span>
        </div>

      </div>

    </div>
  );
};
