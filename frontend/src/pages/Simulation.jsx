import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import TempleMap from '../components/TempleMap';
import Loading from '../components/Loading';
import { PlayCircle, Play, Pause, RotateCcw } from 'lucide-react';

const Simulation = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await simulationService.getStatus();
      setData(res);
    };
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => setData((await simulationService.start()).status);
  const handlePause = async () => setData((await simulationService.pause()).status);
  const handleReset = async () => setData((await simulationService.reset()).status);
  const handleScenario = async (sc) => setData((await simulationService.setScenario(sc)).status);
  const handleSpeed = async (sp) => setData((await simulationService.setSpeed(sp)).status);

  if (!data) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <PlayCircle size={24} /> TEMPLE DIGITAL TWIN
          </h4>
          <small className="text-muted">Real-Time Operational Twin & Stress Test Laboratory</small>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="temple-card p-4 gold-glow mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <h6 className="fw-bold text-maroon mb-1">Clock Controls</h6>
            <div className="d-flex align-items-center gap-2 mt-2">
              {!data.is_running ? (
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
                  className={`btn btn-sm ${data.speed === s ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
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
              value={data.scenario}
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
            <h4 className="fw-bold text-maroon m-0">{data.simulated_time}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">DEVOTEES</small>
            <h4 className="fw-bold text-dark-brown m-0">{data.current_visitors}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">ENTRY RATE</small>
            <h4 className="fw-bold text-primary m-0">{data.entry_rate}/hr</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">EXIT RATE</small>
            <h4 className="fw-bold text-warning m-0">{data.exit_rate}/hr</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">QUEUE</small>
            <h4 className="fw-bold text-gold m-0">{data.queue_length}</h4>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="temple-card p-3">
            <small className="text-muted d-block">WAIT TIME</small>
            <h4 className="fw-bold text-maroon m-0">{data.waiting_time} min</h4>
          </div>
        </div>
      </div>

      {/* Map Readout */}
      <div style={{ height: '400px' }}>
        <TempleMap zones={data.zones} />
      </div>
    </div>
  );
};

export default Simulation;
