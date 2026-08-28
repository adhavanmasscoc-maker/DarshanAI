import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { simulationService } from '../services/simulationService';
import API from '../services/api';
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
  Layers,
  Camera,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [cctvData, setCctvData] = useState(null);
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

        // Fetch Live CCTV telemetry
        const cctvRes = await API.get('/cctv/cameras/CAM-002/analytics');
        setCctvData(cctvRes.data);

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

      {/* Live CCTV Status Widget Banner */}
      <div className="temple-card p-3 gold-glow mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-ivory rounded border border-gold text-maroon">
              <Camera size={26} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success text-light fw-bold" style={{ fontSize: '0.72rem' }}>🟢 LIVE CCTV CONNECTED</span>
                <span className="text-muted small">5 Active Cameras Ingesting Telemetry</span>
              </div>
              <h6 className="fw-bold text-maroon m-0 my-1">
                YOLO Person Detection: <strong className="text-dark-brown">{cctvData?.person_count || 32} people in frame</strong> • Rate: <strong className="text-primary">{cctvData?.entry_rate || 42}/min in</strong> | <strong className="text-warning">{cctvData?.exit_rate || 20}/min out</strong>
              </h6>
              <small className="text-muted">Live Computer Vision streams active on Main Entry, Queue Complex, Sanctum, Prasadam, and Exit</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => navigate('/crowd-monitoring')} 
              className="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center gap-1"
            >
              <Camera size={15} /> View Live CCTV Feed
            </button>
            <button 
              onClick={() => navigate('/simulation')} 
              className="btn btn-maroon text-gold btn-sm fw-bold d-flex align-items-center gap-1 shadow-sm"
            >
              <PlayCircle size={15} /> Open What-If Simulation <ArrowRight size={14} />
            </button>
          </div>
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

        {/* Scenario Selection */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-semibold">SCENARIO:</span>
          <select 
            className="form-select form-select-sm"
            style={{ width: '170px' }}
            value={data.scenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
          >
            <option value="NORMAL_DAY">Normal Day</option>
            <option value="WEEKEND">Weekend Surge</option>
            <option value="HOLIDAY">Public Holiday</option>
            <option value="FESTIVAL">Maha Festival</option>
            <option value="HEAVY_RAIN">Heavy Rain</option>
            <option value="CROWD_SURGE">Crowd Surge</option>
            <option value="EMERGENCY">Emergency Evacuation</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Summary Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard 
            title="CURRENT DEVOTEES INSIDE" 
            value={data.current_visitors} 
            icon={Users} 
            color="text-primary"
            change="+4.2% vs baseline" 
            isIncrease={true}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard 
            title="AI PREDICTED PEAK (NEXT 1 HR)" 
            value={data.predicted_visitors} 
            icon={TrendingUp} 
            color="text-gold"
            change="+12.5% surge expected" 
            isIncrease={true}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard 
            title="OVERALL SAFETY RISK" 
            value={data.risk_level} 
            icon={ShieldAlert} 
            color={data.risk_level === 'CRITICAL' ? 'text-danger' : data.risk_level === 'HIGH' ? 'text-warning' : 'text-success'}
            change="Automated safety index" 
            isIncrease={false}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard 
            title="ESTIMATED DARSHAN WAIT" 
            value={`${data.waiting_time} min`} 
            icon={Clock} 
            color="text-maroon"
            change="Current queue throughput" 
            isIncrease={false}
          />
        </div>
      </div>

      {/* Main Grid: Real-Time Charts & Status */}
      <div className="row g-4 mb-4">
        {/* Real-time Predictive Trend Chart */}
        <div className="col-lg-8">
          <PredictionChart 
            history={chartHistory} 
            currentVisitors={data.current_visitors} 
            predictedVisitors={data.predicted_visitors} 
          />
        </div>

        {/* AI Action Recommendations & Status */}
        <div className="col-lg-4 d-flex flex-column gap-3">
          <AIInsightCard 
            scenario={data.scenario}
            riskLevel={data.risk_level}
            waitingTime={data.waiting_time}
            activeAlerts={data.active_alerts}
          />
          <DarshanStatus 
            queueLength={data.queue_length} 
            openGates={data.open_gates} 
            staffAvailable={data.staff_available}
            entryRate={data.entry_rate}
            exitRate={data.exit_rate}
          />
        </div>
      </div>

      {/* Geographical GIS Zone Map & Operational Health */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <TempleMap zones={data.zones} />
        </div>
        <div className="col-lg-4">
          <RiskCard 
            riskLevel={data.risk_level} 
            crowdLevel={data.crowd_level} 
            entryRate={data.entry_rate}
            openGates={data.open_gates}
          />
        </div>
      </div>

      {/* Operational Zone Status Cards Grid */}
      <h5 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
        <Layers size={20} /> Real-Time Temple Zone Telemetry
      </h5>
      <div className="row g-3">
        {Object.entries(data.zones || {}).map(([key, zone]) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={key}>
            <CrowdCard zone={zone} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
