import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import TempleMap from '../components/TempleMap';
import Loading from '../components/Loading';
import { PlayCircle, Play, Pause, RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';

const Simulation = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    try {
      const res = await simulationService.getStatus();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch simulation status:', err);
      setError('Could not connect to simulation engine. Please check if the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      const res = await simulationService.start();
      setData(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePause = async () => {
    try {
      const res = await simulationService.pause();
      setData(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    try {
      const res = await simulationService.reset();
      setData(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScenario = async (sc) => {
    try {
      const res = await simulationService.setScenario(sc);
      setData(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeed = async (sp) => {
    try {
      const res = await simulationService.setSpeed(sp);
      setData(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !data) return <Loading />;

  if (error && !data) {
    return (
      <div className="container p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="temple-card p-4 text-center gold-glow" style={{ maxWidth: '480px' }}>
          <AlertTriangle size={36} className="text-warning mb-2" />
          <h5 className="fw-bold text-maroon mb-2">Simulation Engine Offline</h5>
          <p className="text-muted small mb-3">{error}</p>
          <button onClick={loadStatus} className="btn btn-maroon text-gold fw-bold d-inline-flex align-items-center gap-1">
            <RefreshCw size={15} /> Retry connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <PlayCircle size={24} /> Temple digital twin & simulation
          </h4>
          <small className="text-muted">Real-time operational twin, stress-test laboratory, and scenario modeling</small>
        </div>
        <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
          SIMULATION MODE
        </span>
      </div>

      {/* Controls Bar */}
      <div className="temple-card p-4 gold-glow mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <h6 className="fw-bold text-maroon mb-1">Clock Controls</h6>
            <div className="d-flex align-items-center gap-2 mt-2">
              {!data?.is_running ? (
                <button onClick={handleStart} className="btn btn-success fw-bold d-flex align-items-center gap-1">
                  <Play size={16} /> START
                </button>
              ) : (
                <button onClick={handlePause} className="btn btn-warning fw-bold text-dark d-flex align-items-center gap-1">
                  <Pause size={16} /> PAUSE
                </button>
              )}
              <button onClick={handleReset} className="btn btn-outline-secondary">
                <RotateCcw size={16} /> RESET
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold text-maroon mb-1">Simulation Speed</h6>
            <div className="btn-group w-100 mt-2">
              {[1, 5, 10, 30, 60].map(s => (
                <button 
                  key={s} 
                  onClick={() => handleSpeed(s)} 
                  className={`btn btn-sm ${data?.speed === s ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold text-maroon mb-1">Operational Scenario</h6>
            <select 
              className="form-select mt-2"
              value={data?.scenario || 'NORMAL_DAY'}
              onChange={e => handleScenario(e.target.value)}
            >
              <option value="NORMAL_DAY">Normal Day</option>
              <option value="WEEKEND">Weekend Surge</option>
              <option value="HOLIDAY">Public Holiday</option>
              <option value="FESTIVAL">Maha Festival</option>
              <option value="HEAVY_RAIN">Heavy Rain</option>
              <option value="CROWD_SURGE">Crowd Surge</option>
              <option value="EMERGENCY">Emergency Bottleneck</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Readout Metrics Cards */}
      <div className="row g-3 mb-4 text-center">
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">SIM TIME</small>
            <h4 className="fw-bold text-maroon m-0">{data?.simulated_time || '04:00 AM'}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">DEVOTEES</small>
            <h4 className="fw-bold text-dark-brown m-0">{data?.current_visitors || 0}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">ENTRY RATE</small>
            <h4 className="fw-bold text-primary m-0">{data?.entry_rate || 0}/hr</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">EXIT RATE</small>
            <h4 className="fw-bold text-warning m-0">{data?.exit_rate || 0}/hr</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">QUEUE</small>
            <h4 className="fw-bold text-gold m-0">{data?.queue_length || 0}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">WAIT TIME</small>
            <h4 className="fw-bold text-maroon m-0">{data?.waiting_time || 0} min</h4>
          </div>
        </div>
      </div>

      {/* Map Readout */}
      <div className="temple-card p-2" style={{ height: '440px' }}>
        <TempleMap zones={data?.zones || {}} />
      </div>
    </div>
  );
};

export default Simulation;
