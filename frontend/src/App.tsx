import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CellViewerPage } from './pages/CellViewerPage';
import { DiseaseSimulatorPage } from './pages/DiseaseSimulatorPage';
import { DrugTestingPage } from './pages/DrugTestingPage';
import { MutationAnalyzerPage } from './pages/MutationAnalyzerPage';
import { InfectionSimulatorPage } from './pages/InfectionSimulatorPage';
import { EnvironmentalStressPage } from './pages/EnvironmentalStressPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResearchWorkspacePage } from './pages/ResearchWorkspacePage';
import { SettingsAdminPage } from './pages/SettingsAdminPage';

import { 
  Activity, ShieldAlert, FlaskConical, Dna, Database, 
  Settings, BookOpen, User, LogOut, LayoutDashboard, Heart, Zap
} from 'lucide-react';

const DashboardShell: React.FC = () => {
  const { activeTab, setTab, user, logout, metrics } = useApp();

  // Sidebar navigation setup mapping standard modules
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-cyber-cyan' },
    { id: 'cell-viewer', name: 'Cell Viewer', icon: Dna, color: 'text-cyber-cyan' },
    { id: 'disease-simulator', name: 'Disease Simulator', icon: ShieldAlert, color: 'text-cyber-rose' },
    { id: 'drug-lab', name: 'Drug Lab', icon: FlaskConical, color: 'text-cyber-green' },
    { id: 'mutation-analyzer', name: 'Mutation Analyzer', icon: Dna, color: 'text-cyber-purple' },
    { id: 'infection-simulator', name: 'Infection Simulator', icon: ShieldAlert, color: 'text-cyber-rose' },
    { id: 'environmental-stress', name: 'Environmental Stress', icon: Activity, color: 'text-cyber-cyan' },
    { id: 'analytics', name: 'Analytics', icon: Activity, color: 'text-cyber-green' },
    { id: 'workspace', name: 'Research Workspace', icon: BookOpen, color: 'text-cyber-cyan' },
    { id: 'settings', name: 'Settings & Admin', icon: Settings, color: 'text-gray-400' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'cell-viewer': return <CellViewerPage />;
      case 'disease-simulator': return <DiseaseSimulatorPage />;
      case 'drug-lab': return <DrugTestingPage />;
      case 'mutation-analyzer': return <MutationAnalyzerPage />;
      case 'infection-simulator': return <InfectionSimulatorPage />;
      case 'environmental-stress': return <EnvironmentalStressPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'workspace': return <ResearchWorkspacePage />;
      case 'settings': return <SettingsAdminPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#04060f] flex flex-col bio-grid">
      
      {/* Dynamic Bioluminescent Header Navigation */}
      <header className="glass-panel py-4 px-6 border-b border-white/5 flex items-center justify-between z-30 shrink-0 font-mono text-xs">
        
        {/* Brand header */}
        <div 
          onClick={() => setTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full border border-cyber-cyan flex items-center justify-center text-sm font-bold glow-text-cyan">🧬</span>
          <div>
            <h1 className="text-sm font-extrabold tracking-widest text-white uppercase font-sans">
              VIRTUAL HUMAN CELL
            </h1>
            <p className="text-gray-500 text-[9px] uppercase font-mono">AI Biological Simulator</p>
          </div>
        </div>

        {/* Global core live stat displays */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${metrics.health_score > 60 ? 'text-cyber-green' : 'text-cyber-rose animate-pulse'}`} />
            <span className="text-gray-500">HEALTH:</span>
            <span className="text-white font-bold">{metrics.health_score.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span className="text-gray-500">ATP INDEX:</span>
            <span className="text-white font-bold">{metrics.atp_level.toFixed(0)}%</span>
          </div>
        </div>

        {/* Profile info block */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-right">
              <div>
                <p className="font-semibold text-white uppercase leading-none">{user.username}</p>
                <p className="text-[9px] text-cyber-cyan font-bold tracking-wider mt-1">{user.lab_role.toUpperCase()}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                <User className="w-4 h-4" />
              </div>
            </div>

            <button 
              onClick={logout}
              className="p-2 rounded hover:bg-cyber-rose/10 hover:text-cyber-rose text-gray-500 transition-colors"
              title="Sever Telemetry Connection"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </header>

      {/* Main Body with Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Sidebar Nav */}
        <aside className="glass-panel w-64 border-r border-white/5 p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="flex flex-col gap-1 font-mono text-xs">
            
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider px-3 mb-3">
              LABORATORY DIVISIONS
            </p>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-white/[0.03] text-white border-l-2 border-cyber-cyan font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}

          </div>

          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] font-mono text-gray-600 leading-relaxed">
            <p className="font-semibold text-white uppercase mb-1">Telemetry Sync</p>
            <p>Port: 127.0.0.1:8000</p>
            <p>Security protocol: JWT</p>
          </div>
        </aside>

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-1 overflow-y-auto p-6 min-h-0">
          {renderActiveTab()}
        </main>

      </div>

    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab, token } = useApp();

  if (activeTab === 'landing') {
    return <LandingPage />;
  }

  if (!token) {
    return <AuthPage />;
  }

  return <DashboardShell />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
