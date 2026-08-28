import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { simulationService } from '../services/simulationService';
import TempleMap from '../components/TempleMap';
import Loading from '../components/Loading';
import { 
  PlayCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Table, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react';

const Simulation = () => {
  const [data, setData] = useState(null);
  const [liveCctvState, setLiveCctvState] = useState(null);
  const [whatIfResults, setWhatIfResults] = useState(null);
  const [runningWhatIf, setRunningWhatIf] = useState(false);
  const [loading, setLoading] = useState(true);

  // What-If Form Inputs
  const [whatIfForm, setWhatIfForm] = useState({
    base_crowd: 245,
    arrival_rate: 150,
    counters: 3,
    duration_min: 30,
    festival_multiplier: 1.0
  });

  const loadStatus = async () => {
    try {
      const res = await simulationService.getStatus();
      setData(res);

      // Fetch live CCTV analytics as baseline
      const cctvRes = await API.get('/cctv/cameras/CAM-002/analytics');
      setLiveCctvState(cctvRes.data);
      if (cctvRes.data && !whatIfResults) {
        setWhatIfForm(prev => ({
          ...prev,
          base_crowd: cctvRes.data.person_count * 10 || 245
        }));
      }
    } catch (err) {
      console.error('Failed to fetch simulation or CCTV baseline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    runWhatIfSimulation();
    const interval = setInterval(loadStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const runWhatIfSimulation = async () => {
    setRunningWhatIf(true);
    try {
      const res = await API.post('/simulation/what-if', whatIfForm);
      setWhatIfResults(res.data);
    } catch (err) {
      console.error('What-If simulation failed:', err);
    } finally {
      setRunningWhatIf(false);
    }
  };

  const handleStart = async () => setData((await simulationService.start()).status);
  const handlePause = async () => setData((await simulationService.pause()).status);
  const handleReset = async () => setData((await simulationService.reset()).status);
  const handleScenario = async (sc) => setData((await simulationService.setScenario(sc)).status);
  const handleSpeed = async (sp) => setData((await simulationService.setSpeed(sp)).status);

  if (loading && !data) return <Loading />;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
              <PlayCircle size={24} /> Temple What-If scenario simulation laboratory
            </h4>
            <span className="badge bg-warning text-dark px-3 py-2 fw-bold d-flex align-items-center gap-1 shadow-sm" style={{ fontSize: '0.75rem' }}>
              🟡 SIMULATION MODE
            </span>
          </div>
          <small className="text-muted">Test operational parameters, arrival surges, and counter configurations without affecting live database records</small>
        </div>

        <button onClick={loadStatus} className="btn btn-outline-secondary btn-sm p-2">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Live CCTV Baseline State Banner */}
      <div className="temple-card p-3 gold-glow mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <span className="badge bg-success text-light mb-1">🟢 LIVE CCTV STARTING BASELINE</span>
            <h6 className="fw-bold text-maroon m-0">
              Current Live Premises Crowd: <strong>{liveCctvState ? liveCctvState.person_count * 10 : 245} devotees</strong> (Zone: {liveCctvState?.name || 'Main Queue'})
            </h6>
            <small className="text-muted">Simulation models what-if scenarios starting from this real-world operational state</small>
          </div>
          <div className="d-flex gap-2 text-center">
            <div className="p-2 rounded bg-ivory border border-beige">
              <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>CCTV INFLOW</small>
              <strong className="text-primary">{liveCctvState?.entry_rate || 42}/min</strong>
            </div>
            <div className="p-2 rounded bg-ivory border border-beige">
              <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>CCTV OUTFLOW</small>
              <strong className="text-warning">{liveCctvState?.exit_rate || 20}/min</strong>
            </div>
            <div className="p-2 rounded bg-ivory border border-beige">
              <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>LIVE RISK</small>
              <strong className="text-danger">{liveCctvState?.risk_level || 'LOW'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Stress Testing Controls & Parameter Matrix */}
      <div className="row g-4 mb-4">
        {/* Left: What-If Parameter Sliders Form */}
        <div className="col-lg-4">
          <div className="temple-card p-4 h-100 gold-glow">
            <h6 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
              <Sliders size={18} className="text-gold" /> What-If Parameter Inputs
            </h6>

            <form onSubmit={(e) => { e.preventDefault(); runWhatIfSimulation(); }}>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold d-flex justify-content-between">
                  <span>Baseline Crowd:</span>
                  <strong className="text-maroon">{whatIfForm.base_crowd} devotees</strong>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="25"
                  className="form-range" 
                  value={whatIfForm.base_crowd} 
                  onChange={e => setWhatIfForm({...whatIfForm, base_crowd: parseInt(e.target.value)})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold d-flex justify-content-between">
                  <span>Expected Arrival Rate:</span>
                  <strong className="text-primary">{whatIfForm.arrival_rate} devotees/min</strong>
                </label>
                <input 
                  type="range" 
                  min="30" 
                  max="400" 
                  step="10"
                  className="form-range" 
                  value={whatIfForm.arrival_rate} 
                  onChange={e => setWhatIfForm({...whatIfForm, arrival_rate: parseInt(e.target.value)})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold d-flex justify-content-between">
                  <span>Active Queue Counters:</span>
                  <strong className="text-saffron">{whatIfForm.counters} Counters</strong>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  className="form-range" 
                  value={whatIfForm.counters} 
                  onChange={e => setWhatIfForm({...whatIfForm, counters: parseInt(e.target.value)})}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">Duration</label>
                  <select 
                    className="form-select form-select-sm"
                    value={whatIfForm.duration_min}
                    onChange={e => setWhatIfForm({...whatIfForm, duration_min: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">Surge Multiplier</label>
                  <select 
                    className="form-select form-select-sm"
                    value={whatIfForm.festival_multiplier}
                    onChange={e => setWhatIfForm({...whatIfForm, festival_multiplier: parseFloat(e.target.value)})}
                  >
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.25}>1.25x Weekend</option>
                    <option value={1.5}>1.5x Holiday</option>
                    <option value={2.0}>2.0x Festival</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={runningWhatIf}
                className="btn btn-maroon text-gold fw-bold w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                {runningWhatIf ? <span className="spinner-border spinner-border-sm"></span> : <><Zap size={16} /> Run What-If Simulation</>}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Comparative Scenario Matrix & AI Operational Recommendations */}
        <div className="col-lg-8">
          <div className="temple-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
                  <Table size={18} className="text-gold" /> Scenario Comparison Matrix (After {whatIfResults?.duration_min || 30} min)
                </h6>
                <span className="badge bg-ivory border border-beige text-dark-brown" style={{ fontSize: '0.72rem' }}>
                  Differential Arrival vs Service Capacity
                </span>
              </div>

              {/* Scenario Table */}
              <div className="table-responsive mb-3">
                <table className="table table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr className="text-maroon small">
                      <th>SCENARIO</th>
                      <th>COUNTERS</th>
                      <th>ARRIVAL</th>
                      <th>PROJECTED CROWD</th>
                      <th>NET QUEUE</th>
                      <th>EST. WAIT</th>
                      <th>RISK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(whatIfResults?.scenarios || []).map((sc, i) => (
                      <tr key={i} className={i === 0 ? 'bg-ivory' : ''}>
                        <td>
                          <strong>{sc.scenario}</strong>
                          <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{sc.description}</small>
                        </td>
                        <td className="fw-bold text-dark-brown">{sc.counters}</td>
                        <td>{sc.arrival_rate}/min</td>
                        <td className="fw-bold text-maroon">{sc.projected_crowd.toLocaleString()}</td>
                        <td className="fw-bold text-saffron">{sc.projected_queue.toLocaleString()}</td>
                        <td>{sc.estimated_wait_min} min</td>
                        <td>
                          <span className={`badge ${sc.risk_level === 'CRITICAL' ? 'bg-danger' : sc.risk_level === 'HIGH' ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {sc.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Actionable Recommendations */}
            <div className="p-3 rounded bg-ivory border border-gold">
              <h6 className="fw-bold text-maroon mb-2 d-flex align-items-center gap-1 small">
                <Sparkles size={16} className="text-gold" /> AI Operational Guidance & Dynamic Recommendations
              </h6>
              <div className="d-flex flex-column gap-1">
                {(whatIfResults?.ai_recommendations || [
                  '⚠️ Open +1 additional counter to prevent queue overflow.',
                  '🚨 Activate batch guidance at Main Mahadwar Gopuram entry.'
                ]).map((rec, i) => (
                  <div key={i} className="small text-dark-brown fw-semibold">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Clock & Digital Twin Playback */}
      <div className="temple-card p-3 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            {!data?.is_running ? (
              <button onClick={handleStart} className="btn btn-success fw-bold btn-sm d-flex align-items-center gap-1">
                <Play size={15} /> START CLOCK
              </button>
            ) : (
              <button onClick={handlePause} className="btn btn-warning fw-bold text-dark btn-sm d-flex align-items-center gap-1">
                <Pause size={15} /> PAUSE CLOCK
              </button>
            )}
            <button onClick={handleReset} className="btn btn-outline-secondary btn-sm">
              <RotateCcw size={15} /> RESET
            </button>
            <span className="badge bg-ivory border border-beige text-dark-brown ms-2">
              SIM CLOCK: {data?.simulated_time || '04:00 AM'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Speed:</span>
            <div className="btn-group">
              {[1, 5, 10, 30, 60].map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSpeed(s)} 
                  className={`btn btn-xs ${data?.speed === s ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Map Visualizer */}
      <div className="temple-card p-2" style={{ height: '420px' }}>
        <TempleMap zones={data?.zones || {}} />
      </div>
    </div>
  );
};

export default Simulation;
