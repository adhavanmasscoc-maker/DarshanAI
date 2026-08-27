import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { simulationService } from '../services/simulationService';
import StatCard from '../components/StatCard';
import CrowdCard from '../components/CrowdCard';
import RiskCard from '../components/RiskCard';
import PredictionChart from '../components/PredictionChart';
import AIInsightCard from '../components/AIInsightCard';
import DarshanStatus from '../components/DarshanStatus';
import TempleMap from '../components/TempleMap';
import AlertCard from '../components/AlertCard';
import Loading from '../components/Loading';

import { 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [chartHistory, setChartHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws = null;
    const templeId = user?.temple_id || 'TEMPLE-001';
    const token = localStorage.getItem('darshanai_token');

    const fetchInitialData = async () => {
      try {
        const res = await simulationService.getStatus();
        setData(res);
        setChartHistory([
          { time: res.simulated_time || '08:00', current_visitors: res.current_visitors, predicted_visitors: res.predicted_visitors }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load initial status', err);
        setLoading(false);
      }
    };

    fetchInitialData();

    if (token) {
      ws = simulationService.createWebSocket(templeId, token);
      
      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        setData(payload);
        
        setChartHistory(prev => {
          const updated = [...prev, {
            time: payload.simulated_time,
            current_visitors: payload.current_visitors,
            predicted_visitors: payload.predicted_visitors
          }];
          return updated.slice(-15);
        });
      };

      ws.onerror = (err) => console.error('WebSocket Error:', err);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [user]);

  const handleStart = async () => setData((await simulationService.start()).status);
  const handlePause = async () => setData((await simulationService.pause()).status);
  const handleReset = async () => setData((await simulationService.reset()).status);
  const handleScenarioChange = async (s) => setData((await simulationService.setScenario(s)).status);
  const handleSpeedChange = async (s) => setData((await simulationService.setSpeed(s)).status);

  if (loading || !data) return <Loading />;

  return (
    <div className="container-fluid p-4">
      {/* Header Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-maroon m-0">Temple Operations Command Center</h3>
          <small className="text-muted">Real-time AI-powered crowd intelligence</small>
        </div>
        <div className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 fs-6 d-flex align-items-center gap-2 fw-bold">
          <CheckCircle2 size={16} />
          <span>🟢 Temple Operations Normal</span>
        </div>
      </div>

      {/* Simulation Command Toolbar */}
      <div className="temple-card p-3 mb-4 gold-glow d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <Zap className="text-saffron spin" size={22} />
          <div>
            <h6 className="fw-bold text-maroon mb-0">Simulation Controls</h6>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              SIM TIME: <span className="text-maroon fw-bold">{data.simulated_time}</span> | STATUS: {data.is_running ? <span className="text-success fw-bold">RUNNING</span> : <span className="text-muted fw-bold">PAUSED</span>}
            </small>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2">
          {!data.is_running ? (
            <button onClick={handleStart} className="btn btn-success btn-sm fw-bold d-flex align-items-center gap-1">
              <Play size={16} /> START
            </button>
          ) : (
            <button onClick={handlePause} className="btn btn-warning btn-sm fw-bold text-dark d-flex align-items-center gap-1">
              <Pause size={16} /> PAUSE
            </button>
          )}
          <button onClick={handleReset} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <RotateCcw size={16} /> RESET
          </button>
        </div>

        {/* Speed Controls */}
        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
          <span className="text-muted me-1">SPEED:</span>
          {[1, 5, 10, 30, 60].map(s => (
            <button 
              key={s} 
              onClick={() => handleSpeedChange(s)} 
              className={`btn btn-xs ${data.speed === s ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '2px 8px' }}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Scenario Selector */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">SCENARIO:</span>
          <select 
            className="form-select form-select-sm" 
            value={data.scenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
            style={{ width: '160px', fontSize: '0.8rem' }}
          >
            <option value="NORMAL_DAY">Normal Day</option>
            <option value="WEEKEND">Weekend Surge</option>
            <option value="HOLIDAY">Public Holiday</option>
            <option value="FESTIVAL">Festival Rush</option>
            <option value="HEAVY_RAIN">Heavy Rain</option>
            <option value="CROWD_SURGE">Crowd Surge</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="CURRENT DEVOTEES" 
            value={data.current_visitors?.toLocaleString()} 
            icon={Users} 
            color="maroon"
            subtitle={`Cap: ${user?.capacity || 18000}`}
          />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="PREDICTED CROWD" 
            value={data.predicted_visitors?.toLocaleString()} 
            icon={TrendingUp} 
            color="warning"
            subtitle="ML Forecast +1hr"
          />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="WAITING TIME" 
            value={`${data.waiting_time} min`} 
            icon={Clock} 
            color="info"
            subtitle="Est. Queue Wait"
          />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="CROWD LEVEL" 
            value={data.crowd_level} 
            icon={Layers} 
            color={data.crowd_level === 'CRITICAL' ? 'danger' : data.crowd_level === 'HIGH' ? 'warning' : 'success'}
            subtitle="Density Classification"
          />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="RISK LEVEL" 
            value={data.risk_level} 
            icon={ShieldAlert} 
            color={data.risk_level === 'CRITICAL' ? 'danger' : data.risk_level === 'HIGH' ? 'warning' : 'success'}
            subtitle="Safety Assessment"
          />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard 
            title="ACTIVE ALERTS" 
            value="02" 
            icon={AlertTriangle} 
            color="danger"
            subtitle="Safety Feed"
          />
        </div>
      </div>

      {/* Darshan Status & AI Insight Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <DarshanStatus 
            currentQueue={data.queue_length || 620} 
            waitingTime={data.waiting_time || 38} 
          />
        </div>
        <div className="col-lg-8">
          <AIInsightCard 
            observation="Crowd density is increasing near the Main Gopuram."
            prediction="32% increase expected within 30 minutes."
            recommendation="Open Gate 3 and deploy additional volunteers."
            riskLevel={data.risk_level || 'HIGH'}
            confidence="91%"
          />
        </div>
      </div>

      {/* Devotee Flow Chart & Map Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <PredictionChart data={chartHistory} />
        </div>
        <div className="col-lg-5">
          <TempleMap zones={data.zones} />
        </div>
      </div>

      {/* Temple Alert Center Row */}
      <div className="temple-card p-3">
        <h6 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
          <AlertTriangle className="text-danger" size={20} /> TEMPLE ALERT CENTER
        </h6>
        <div className="d-flex flex-column gap-2">
          <AlertCard 
            alert={{
              id: 1,
              severity: 'CRITICAL',
              zone: 'Main Entrance',
              description: 'Crowd surge detected near Main Gopuram gates.',
              time: new Date().toISOString(),
              status: 'ACTIVE',
              alert_type: 'CROWD_SURGE'
            }}
          />
          <AlertCard 
            alert={{
              id: 2,
              severity: 'HIGH',
              zone: 'Darshan Hall',
              description: 'Queue increasing rapidly near sanctum corridor.',
              time: new Date().toISOString(),
              status: 'ACTIVE',
              alert_type: 'RISK_SURGE'
            }}
          />
          <AlertCard 
            alert={{
              id: 3,
              severity: 'MEDIUM',
              zone: 'Token Counter',
              description: 'Waiting time above threshold in Counter 2.',
              time: new Date().toISOString(),
              status: 'RESOLVED',
              alert_type: 'WAIT_TIME'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
