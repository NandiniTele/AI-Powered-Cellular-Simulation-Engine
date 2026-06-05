import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldAlert, FlaskConical, Dna, Database, Terminal } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setTab, token } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotating bioluminescent cell canvas graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = 450;
    let height = canvas.height = 450;
    let angle = 0;

    const particles: { x: number; y: number; size: number; baseAngle: number; radius: number; speed: number; color: string }[] = [];
    
    // Create organelles and cytoplasmic mitochondria particles
    for (let i = 0; i < 180; i++) {
      const radius = 60 + Math.random() * 90;
      const baseAngle = Math.random() * Math.PI * 2;
      particles.push({
        x: 0,
        y: 0,
        size: Math.random() * 2 + 1,
        baseAngle,
        radius,
        speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, 0.6)' : 'rgba(0, 255, 135, 0.5)'
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Draw outer cellular membrane wave
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI * 2 + angle;
        const wave = Math.sin(a * 8 + angle * 3) * 6;
        const r = 160 + wave;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Nucleus core
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55);
      gradient.addColorStop(0, 'rgba(217, 70, 239, 0.45)');
      gradient.addColorStop(1, 'rgba(10, 15, 35, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw rotating chromatin filaments inside Nucleus
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const theta = (i / 40) * Math.PI * 2 + angle * 1.5;
        const r = 30 + Math.sin(theta * 4 + angle) * 8;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(219, 70, 239, 0.5)';
      ctx.stroke();

      // Update and draw mitochondria/cytoplasmic particles
      particles.forEach(p => {
        p.baseAngle += p.speed;
        const rOffset = Math.sin(p.baseAngle * 5 + angle) * 4;
        const px = cx + Math.cos(p.baseAngle) * (p.radius + rOffset);
        const py = cy + Math.sin(p.baseAngle) * (p.radius + rOffset);
        
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      angle += 0.008;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#04060f] overflow-hidden bio-grid scanline">
      
      {/* Background radial glowing nebulas */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full filter blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full filter blur-[100px] animate-pulse-slow" />

      {/* Main Container */}
      <div className="w-full max-w-6xl z-20 flex flex-col md:flex-row items-center justify-between gap-12 mt-8">
        
        {/* Left Side: Brand & Terminal */}
        <div className="flex-1 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-ping" />
            <span className="text-xs font-mono tracking-widest text-cyber-cyan uppercase font-semibold">AI Biological Simulation Active</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-mono text-white leading-none">
            VIRTUAL HUMAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-[#60efff] to-[#00ff87] glow-text-cyan font-sans uppercase">
              CELL ENGINE
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-lg font-light">
            Model physical subcellular dynamics, forecast gene activation pathways with Graph Neural Networks, and test complex pharmacological treatments digitally at research scale.
          </p>

          {/* Core system attributes badges */}
          <div className="grid grid-cols-2 gap-4 max-w-md font-mono text-xs text-gray-300">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <Dna className="w-5 h-5 text-cyber-green" />
              <div>
                <p className="font-semibold text-white">GNN Engine</p>
                <p className="text-gray-500 font-light">Pathway Mapping</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <FlaskConical className="w-5 h-5 text-cyber-cyan" />
              <div>
                <p className="font-semibold text-white">Pharmacology</p>
                <p className="text-gray-500 font-light">Drug Simulator</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <ShieldAlert className="w-5 h-5 text-cyber-rose" />
              <div>
                <p className="font-semibold text-white">Pathology</p>
                <p className="text-gray-500 font-light">Mutation Analyzer</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <Activity className="w-5 h-5 text-cyber-purple" />
              <div>
                <p className="font-semibold text-white">1Hz Telemetry</p>
                <p className="text-gray-500 font-light">Live Biophysics</p>
              </div>
            </div>
          </div>

          {/* Action gateways */}
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setTab(token ? 'dashboard' : 'auth')}
              className="px-8 py-3.5 rounded-lg font-mono text-sm tracking-wider font-semibold text-black bg-gradient-to-r from-cyber-cyan to-cyber-green hover:shadow-cyan transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              INITIALIZE LABORATORY
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('details');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-lg font-mono text-sm font-semibold border border-white/10 hover:border-cyber-cyan/40 bg-white/[0.02] hover:bg-cyber-cyan/5 transition-all text-white"
            >
              SYSTEM SCHEMA
            </button>
          </div>
        </div>

        {/* Right Side: Glowing Rotating Cell Canvas */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="absolute w-[360px] h-[360px] rounded-full border border-cyber-cyan/10 animate-spin-slow" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-cyber-purple/10 animate-pulse-slow" />
          <canvas ref={canvasRef} className="relative z-10 max-w-full" />
        </div>

      </div>

      {/* Lab Features Details Section */}
      <div id="details" className="w-full max-w-6xl mt-32 border-t border-white/5 pt-16 z-20">
        <h2 className="text-3xl font-bold font-mono tracking-tight text-white text-center mb-12">
          BIOMEDICAL LABORATORY CAPABILITIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-xl hover:border-cyber-cyan/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-mono font-semibold text-white mb-2 uppercase">1. Subcellular Simulation</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Interactive biophysics simulation of vital organelles (Nucleus, Mitochondria, Golgi) displaying membrane potentials, ATP production indices, and RNA protein synthesis rates.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl hover:border-cyber-green/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyber-green/10 border border-cyber-green/30 text-cyber-green mb-4">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-mono font-semibold text-white mb-2 uppercase">2. GNN Pathway Networks</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Explore dynamic cellular pathways modeled through directed biological graph structures. Witness ERK proliferation and apoptotic p53 cascades activate in real time.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl hover:border-cyber-purple/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple mb-4">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-mono font-semibold text-white mb-2 uppercase">3. Pharmacological Assays</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Virtually evaluate small-molecule agents (Metformin, Doxorubicin, Remdesivir) against active viruses, genetic mutations, and toxic physical stressors with calculated dosage curves.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mt-24 border-t border-white/5 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-mono">
        <p>© 2026 Advanced Bio-Simulation Systems. Virtual Cell Project.</p>
        <p>Lab Core: 127.0.0.1:8000 | Status: ONLINE</p>
      </div>

    </div>
  );
};
