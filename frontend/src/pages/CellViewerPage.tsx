import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Info, Cpu, Database, Zap, Sparkles } from 'lucide-react';

interface Organelle {
  name: string;
  x: number;
  y: number;
  r: number;
  color: string;
  glowColor: string;
  description: string;
  proteins: string[];
  attributes: Record<string, string>;
}

export const CellViewerPage: React.FC = () => {
  const { metrics, mutations } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle | null>(null);

  // Organelle definition dictionary
  const organelles: Organelle[] = [
    {
      name: 'Nucleus',
      x: 0,
      y: 0,
      r: 65,
      color: 'rgba(217, 70, 239, 0.2)',
      glowColor: 'rgba(217, 70, 239, 0.7)',
      description: 'The cellular command center containing chromosomal DNA. Directs protein synthesis via mRNA transcription.',
      proteins: ['Histones', 'RNA Polymerase II', 'TP53 Suppressor', 'BRCA1 Repair complex'],
      attributes: {
        'Transcription Rate': `${metrics.protein_synthesis > 100 ? 'Hyperactive' : metrics.protein_synthesis > 50 ? 'Steady' : 'Damped'}`,
        'Genomic State': mutations.includes('TP53') || mutations.includes('BRCA1') ? 'Mutated Checkpoints' : 'WildType Stable',
        'Nuclear Envelope': 'Intact bilayer pore system'
      }
    },
    {
      name: 'Mitochondria',
      x: -110,
      y: -60,
      r: 30,
      color: 'rgba(0, 255, 135, 0.2)',
      glowColor: 'rgba(0, 255, 135, 0.7)',
      description: 'The chemical powerplant of the cell. Generates ATP via oxidative phosphorylation across folding inner membranes (cristae).',
      proteins: ['ATP Synthase', 'Cytochrome c oxidase', 'NADH Dehydrogenase'],
      attributes: {
        'ATP Output efficiency': `${metrics.atp_level.toFixed(1)}%`,
        'Membrane potential': '-140mV (gradient)',
        'ROS Generation': `${metrics.oxidative_stress.toFixed(1)}%`
      }
    },
    {
      name: 'Endoplasmic Reticulum',
      x: 90,
      y: 70,
      r: 45,
      color: 'rgba(0, 242, 254, 0.15)',
      glowColor: 'rgba(0, 242, 254, 0.6)',
      description: 'Network of folded membranous sheets. Rough ER contains ribosomes for translating proteins; Smooth ER synthesizes lipids.',
      proteins: ['Ribosomal 60S subunit', 'BiP Chaperone', 'Protein Disulfide Isomerase'],
      attributes: {
        'Ribosome Density': 'High (rough membrane)',
        'Folding efficiency': `${(metrics.protein_synthesis * 0.95).toFixed(0)}%`,
        'Calcium storage': 'Lumen reservoir loaded'
      }
    },
    {
      name: 'Golgi Apparatus',
      x: -80,
      y: 90,
      r: 35,
      color: 'rgba(245, 158, 11, 0.15)',
      glowColor: 'rgba(245, 158, 11, 0.6)',
      description: 'Cellular post-office. Packages and tags proteins in cisternae stacks for vesicle shipping across lysosomes or membrane limits.',
      proteins: ['Mannosidase I', 'Galactosyltransferase', 'Clathrin coat complexes'],
      attributes: {
        'Glycosylation index': 'Steady',
        'Vesicle traffic': 'Active outflow',
        'Cisternae stacking': '5 layers healthy'
      }
    },
    {
      name: 'Lysosome',
      x: 100,
      y: -80,
      r: 20,
      color: 'rgba(239, 68, 68, 0.15)',
      glowColor: 'rgba(239, 68, 68, 0.6)',
      description: 'Subcellular recycling bin. Acidic vesicle loaded with hydrolase enzymes to break down old organelles and pathogens (autophagy).',
      proteins: ['Acid phosphatase', 'Cathepsins', 'Lamps complexes'],
      attributes: {
        'Internal pH': '4.8 Acidic',
        'Autophagy State': `${metrics.apoptosis_marker > 40 ? 'Hyperactive' : 'Baseline scavenging'}`,
        'Enzyme density': 'Saturated'
      }
    }
  ];

  // Default select Nucleus on startup
  useEffect(() => {
    setSelectedOrganelle(organelles[0]);
  }, []);

  // Run Canvas Cell Viewer Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    
    const w = canvas.width = 500;
    const h = canvas.height = 500;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      // Draw cell membrane outer wave
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2 + angle;
        const wave = Math.sin(a * 10 + angle * 2) * 5;
        const r = 210 + wave;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Highlight membrane boundary with slight fill
      ctx.fillStyle = 'rgba(10, 25, 50, 0.15)';
      ctx.fill();

      // Render organelles relative to center
      organelles.forEach(org => {
        const ox = cx + org.x;
        const oy = cy + org.y;

        // Pulse size oscillation
        const pulse = Math.sin(angle * 3 + org.r) * 1.5;
        const size = org.r + pulse;

        // Draw shadow glow circle
        ctx.shadowBlur = 15;
        ctx.shadowColor = org.glowColor;
        
        ctx.beginPath();
        ctx.arc(ox, oy, size, 0, Math.PI * 2);
        ctx.fillStyle = org.color;
        ctx.fill();
        
        ctx.shadowBlur = 0; // Reset shadow

        // Outline organelle boundary
        ctx.strokeStyle = org.glowColor;
        ctx.lineWidth = selectedOrganelle?.name === org.name ? 2.5 : 1.2;
        ctx.stroke();

        // Draw inner biological structural shapes
        if (org.name === 'Nucleus') {
          // Draw nucleolus
          ctx.beginPath();
          ctx.arc(ox, oy, 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(219, 70, 239, 0.4)';
          ctx.fill();
        } else if (org.name === 'Mitochondria') {
          // Draw cristae squiggly lines inside mitochondria
          ctx.beginPath();
          ctx.moveTo(ox - size*0.7, oy);
          ctx.quadraticCurveTo(ox - size*0.3, oy - size*0.4, ox, oy);
          ctx.quadraticCurveTo(ox + size*0.3, oy + size*0.4, ox + size*0.7, oy);
          ctx.strokeStyle = 'rgba(0, 255, 135, 0.5)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
        }

        // Draw organelle labeling labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(org.name.toUpperCase(), ox, oy + (org.name === 'Nucleus' ? 5 : 4));
      });

      angle += 0.005;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [selectedOrganelle]);

  // Click inspection handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Map click coordinates relative to canvas design dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Check if any organelle was clicked
    for (const org of organelles) {
      const ox = cx + org.x;
      const oy = cy + org.y;
      const dist = Math.hypot(clickX - ox, clickY - oy);
      if (dist <= org.r + 5) {
        setSelectedOrganelle(org);
        break;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      
      {/* Left: Graphic canvas view port */}
      <div className="glass-panel p-6 rounded-xl md:col-span-2 flex flex-col items-center justify-center border border-white/5 relative">
        <div className="absolute top-4 left-4 font-mono text-[10px] tracking-wider text-cyber-cyan bg-cyber-cyan/5 border border-cyber-cyan/30 px-3 py-1 rounded-full uppercase font-semibold">
          LIDIP MEMBRANE GRID VIEWER
        </div>

        <p className="absolute bottom-4 text-[10px] font-mono text-gray-500 text-center max-w-sm">
          💡 Click directly on individual colored organelles within the cell model to run deep biophysics profiling scans.
        </p>

        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="cursor-crosshair max-w-full my-6 bg-radial bg-[radial-gradient(ellipse_at_center,rgba(5,12,30,0.4)_0%,rgba(0,0,0,0.85)_100%)] rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/[0.03]"
        />
      </div>

      {/* Right Sidebar: Analytical inspection deck */}
      <div className="glass-panel p-6 rounded-xl md:col-span-1 border border-white/5 flex flex-col justify-between">
        
        {selectedOrganelle ? (
          <div className="flex flex-col gap-6 font-mono text-xs">
            
            {/* Header Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-extrabold text-white uppercase tracking-wider font-sans">
                  {selectedOrganelle.name}
                </h3>
                <Sparkles className="w-5 h-5 text-cyber-cyan animate-pulse" />
              </div>
              <p className="text-gray-400 font-light leading-relaxed text-xs">
                {selectedOrganelle.description}
              </p>
            </div>

            {/* Subcellular metrics list */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyber-cyan" />
                ACTIVE BIOMARKERS
              </h4>
              <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                {Object.entries(selectedOrganelle.attributes).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-1 border-b border-white/[0.03] last:border-0">
                    <span className="text-gray-500 font-light">{key}</span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Protein structure dictionary */}
            <div>
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyber-green" />
                ASSOCIATED MACROMOLECULES
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedOrganelle.proteins.map(p => (
                  <div 
                    key={p} 
                    className="p-2.5 rounded border border-cyber-cyan/10 bg-cyber-cyan/[0.01] text-[10px] text-cyber-cyan font-bold text-center tracking-tight truncate"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 font-mono text-gray-500 h-full">
            <Info className="w-8 h-8 mb-3 text-cyber-cyan animate-bounce" />
            <p className="text-xs">No active organelle inspected. Select a cellular element to begin transcription scan.</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3 font-mono text-[9px] text-gray-600">
          <Cpu className="w-4 h-4 shrink-0" />
          <span>Molecular dynamic engine synced. DNA checker: wildtype.</span>
        </div>

      </div>

    </div>
  );
};
