import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces for our state engine
export interface Drug {
  name: string;
  dose: number; // 0 to 1
}

export interface Infection {
  type: string; // None, Viral, Bacterial
  load: number; // 0 to 1
}

export interface Stress {
  temp: number;
  radiation: number; // 0 to 1
  toxicity: number; // 0 to 1
}

export interface CellMetrics {
  atp_level: number;
  membrane_potential: number;
  protein_synthesis: number;
  oxidative_stress: number;
  apoptosis_marker: number;
  cytokine_level: number;
  health_score: number;
  cellular_age: number;
}

export interface GNNNode {
  id: string;
  type: string;
  function: string;
  activation: number;
}

export interface GNNEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface GNNGraph {
  nodes: GNNNode[];
  edges: GNNEdge[];
}

export interface SavedExperiment {
  id: string;
  title: string;
  hypothesis: string;
  timestamp: string;
  conditions: {
    mutations: string[];
    drugs: Drug[];
    infection: Infection;
    stress: Stress;
  };
  outcome: {
    health: number;
    atp: number;
    apoptosis: number;
    risks: any;
  };
}

interface User {
  username: string;
  email: string;
  lab_role: string;
}

interface AppContextType {
  token: string | null;
  user: User | null;
  activeTab: string;
  mutations: string[];
  drugs: Drug[];
  infection: Infection;
  stress: Stress;
  metrics: CellMetrics;
  pathwayActivity: Record<string, number>;
  pathwayGraph: GNNGraph;
  clinicalRisks: Record<string, number>;
  mutationImpact: Record<string, any>;
  savedExperiments: SavedExperiment[];
  socketConnected: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setTab: (tab: string) => void;
  updateMutations: (muts: string[]) => Promise<void>;
  applyDrug: (name: string, dose: number) => Promise<any>;
  clearDrugs: () => Promise<void>;
  updateInfection: (type: string, load: number) => Promise<void>;
  updateStress: (temp: number, rad: number, tox: number) => Promise<void>;
  resetCell: () => Promise<void>;
  saveExperiment: (title: string, hypothesis: string) => void;
  deleteExperiment: (id: string) => void;
  fetchForecast: () => Promise<any[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & session state
  const [token, setToken] = useState<string | null>(localStorage.getItem('biocell_token'));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('biocell_user') ? JSON.parse(localStorage.getItem('biocell_user')!) : null
  );

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  // Biological Environment State
  const [mutations, setMutations] = useState<string[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [infection, setInfection] = useState<Infection>({ type: 'None', load: 0.0 });
  const [stress, setStress] = useState<Stress>({ temp: 37.0, radiation: 0.0, toxicity: 0.0 });

  // Real-time telemetry calculations
  const [metrics, setMetrics] = useState<CellMetrics>({
    atp_level: 95.0,
    membrane_potential: -70.0,
    protein_synthesis: 90.0,
    oxidative_stress: 10.0,
    apoptosis_marker: 5.0,
    cytokine_level: 12.0,
    health_score: 98.0,
    cellular_age: 20.0
  });

  const [pathwayActivity, setPathwayActivity] = useState<Record<string, number>>({
    apoptosis: 5.0,
    mapk_proliferation: 30.0,
    akt_survival: 25.0,
    metabolic_ampk: 40.0
  });

  const [pathwayGraph, setPathwayGraph] = useState<GNNGraph>({ nodes: [], edges: [] });
  const [clinicalRisks, setClinicalRisks] = useState<Record<string, number>>({
    oncogenesis_probability: 2.0,
    cytokine_storm_danger: 5.0,
    cellular_necrosis_risk: 0.5
  });
  const [mutationImpact, setMutationImpact] = useState<Record<string, any>>({});

  // Saved workspace notes & records
  const [savedExperiments, setSavedExperiments] = useState<SavedExperiment[]>(
    localStorage.getItem('biocell_experiments') ? JSON.parse(localStorage.getItem('biocell_experiments')!) : []
  );

  // Setup WebSocket connection to the running FastAPI server
  useEffect(() => {
    if (!token) return; // Only connect when authenticated and working in dashboard

    let ws: WebSocket;
    let reconnectTimeout: number;

    const connect = () => {
      ws = new WebSocket('ws://127.0.0.1:8000/ws/cellular-simulation');

      ws.onopen = () => {
        setSocketConnected(true);
        console.log('Bio-WebSocket telemetry connection established.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMetrics(data.metrics);
          setPathwayActivity(data.pathway_activity);
          setPathwayGraph(data.pathway_graph);
          setClinicalRisks(data.clinical_risks);
          setMutationImpact(data.mutation_impact);
          
          // Keep active conditions synced with database core
          setMutations(data.conditions.mutations);
          setDrugs(data.conditions.drugs);
          setInfection(data.conditions.infection);
          setStress(data.conditions.stress);
        } catch (err) {
          console.error('Error decoding telemetry: ', err);
        }
      };

      ws.onclose = () => {
        setSocketConnected(false);
        console.log('Telemetry link severed. Retrying in 3 seconds...');
        reconnectTimeout = window.setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WS Connection error: ', err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, [token]);

  // Auth Operations
  const login = (jwtToken: string, userData: User) => {
    localStorage.setItem('biocell_token', jwtToken);
    localStorage.setItem('biocell_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setActiveTab('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('biocell_token');
    localStorage.removeItem('biocell_user');
    setToken(null);
    setUser(null);
    setActiveTab('landing');
  };

  const setTab = (tab: string) => {
    setActiveTab(tab);
  };

  // REST API calls to alter simulator variables
  const updateMutations = async (muts: string[]) => {
    try {
      await fetch('http://127.0.0.1:8000/api/cell/mutations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: muts })
      });
      setMutations(muts);
    } catch (e) {
      console.error(e);
    }
  };

  const applyDrug = async (name: string, dose: number) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cell/drugs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dose })
      });
      const data = await res.json();
      setDrugs(data.active_drugs);
      return data.prediction;
    } catch (e) {
      console.error(e);
    }
  };

  const clearDrugs = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/cell/drugs/clear', { method: 'POST' });
      setDrugs([]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateInfection = async (type: string, load: number) => {
    try {
      await fetch('http://127.0.0.1:8000/api/cell/infection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, load })
      });
      setInfection({ type, load });
    } catch (e) {
      console.error(e);
    }
  };

  const updateStress = async (temp: number, rad: number, tox: number) => {
    try {
      await fetch('http://127.0.0.1:8000/api/cell/stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp, radiation: rad, toxicity: tox })
      });
      setStress({ temp, radiation: rad, toxicity: tox });
    } catch (e) {
      console.error(e);
    }
  };

  const resetCell = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/cell/reset', { method: 'POST' });
      setMutations([]);
      setDrugs([]);
      setInfection({ type: 'None', load: 0.0 });
      setStress({ temp: 37.0, radiation: 0.0, toxicity: 0.0 });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchForecast = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/cell/forecast');
      const data = await res.json();
      return data.forecast;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  // Lab Notebook Local Cache Operations
  const saveExperiment = (title: string, hypothesis: string) => {
    const newExp: SavedExperiment = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      hypothesis,
      timestamp: new Date().toLocaleString(),
      conditions: {
        mutations: [...mutations],
        drugs: [...drugs],
        infection: { ...infection },
        stress: { ...stress }
      },
      outcome: {
        health: metrics.health_score,
        atp: metrics.atp_level,
        apoptosis: metrics.apoptosis_marker,
        risks: { ...clinicalRisks }
      }
    };
    const updated = [newExp, ...savedExperiments];
    setSavedExperiments(updated);
    localStorage.setItem('biocell_experiments', JSON.stringify(updated));
  };

  const deleteExperiment = (id: string) => {
    const updated = savedExperiments.filter(e => e.id !== id);
    setSavedExperiments(updated);
    localStorage.setItem('biocell_experiments', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{
      token,
      user,
      activeTab,
      mutations,
      drugs,
      infection,
      stress,
      metrics,
      pathwayActivity,
      pathwayGraph,
      clinicalRisks,
      mutationImpact,
      savedExperiments,
      socketConnected,
      
      login,
      logout,
      setTab,
      updateMutations,
      applyDrug,
      clearDrugs,
      updateInfection,
      updateStress,
      resetCell,
      saveExperiment,
      deleteExperiment,
      fetchForecast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
