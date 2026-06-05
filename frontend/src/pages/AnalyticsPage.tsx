import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer, Legend, LineChart, Line 
} from 'recharts';
import { Activity, ShieldAlert, Cpu, Calendar, TrendingUp } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { fetchForecast, metrics, pathwayActivity } = useApp();
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getForecast = async () => {
      setLoading(true);
      const data = await fetchForecast();
      setForecastData(data);
      setLoading(false);
    };
    getForecast();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-1">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-2">
        <h3 className="text-xl font-extrabold text-white tracking-wider font-sans uppercase">
          PREDICTIVE ANALYTICS COGNITIVE DECK
        </h3>
        <p className="text-gray-400 font-mono text-xs font-light">
          Compare multi-parameter forecasting models. Map GNN pathway activation metrics against simulated 24-step biophysical progressions.
        </p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Chart 1: Subcellular 24h Prognosis curves */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyber-cyan" />
            24h BIOPHYSICS PROGNOSIS
          </h4>
          
          <div className="w-full h-80">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                LOADING TIME-SERIES PROJECTIONS...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff87" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00ff87" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorATP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time_hour" stroke="rgba(255,255,255,0.3)" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(5, 12, 30, 0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="health_score" name="Cell Health" stroke="#00ff87" fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} />
                  <Area type="monotone" dataKey="atp_level" name="ATP energy" stroke="#00f2fe" fillOpacity={1} fill="url(#colorATP)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Toxicological Oxidative stress & Apoptotic forecasting */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase flex items-center gap-1.5 text-[11px] tracking-wider">
            <ShieldAlert className="w-4 h-4 text-cyber-rose" />
            24h PATHOLOGICAL DYNAMICS
          </h4>

          <div className="w-full h-80">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                LOADING TIME-SERIES PROJECTIONS...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time_hour" stroke="rgba(255,255,255,0.3)" tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(5, 12, 30, 0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="oxidative_stress" name="Oxidative ROS" stroke="#ff007f" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="apoptosis_marker" name="Apoptosis marker" stroke="#d946ef" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Pathway Activations Map widget grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
        
        {Object.entries(pathwayActivity).map(([name, score]) => (
          <div key={name} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
              GNN Signal index
            </span>
            <h5 className="text-sm font-bold text-white uppercase tracking-tight truncate">
              {name.replace('_', ' ')} Pathway
            </h5>
            
            <div className="flex justify-between items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-white tracking-tighter leading-none">
                {score.toFixed(1)}%
              </span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Activation</span>
            </div>
            
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-cyan transition-all duration-300"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};
