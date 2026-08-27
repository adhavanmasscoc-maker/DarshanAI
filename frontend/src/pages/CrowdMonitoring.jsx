import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import CrowdCard from '../components/CrowdCard';
import Loading from '../components/Loading';
import { Activity, LogIn, LogOut, DoorOpen, Users } from 'lucide-react';

const CrowdMonitoring = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await simulationService.getStatus();
      setData(res);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <Activity size={24} /> Live Crowd & Zone Monitoring
          </h4>
          <small className="text-muted">Real-time zone occupancy, gate entry/exit rates, and queue accumulation</small>
        </div>
        <div className="badge bg-ivory text-maroon border border-gold px-3 py-2 fw-bold">
          SIM TIME: {data.simulated_time}
        </div>
      </div>

      {/* Operational Flow Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="temple-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-ivory rounded border border-beige text-primary">
              <LogIn size={24} />
            </div>
            <div>
              <small className="text-muted d-block fw-semibold">ENTRY RATE</small>
              <h5 className="fw-bold text-dark-brown m-0">{data.entry_rate} / hr</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="temple-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-ivory rounded border border-beige text-warning">
              <LogOut size={24} />
            </div>
            <div>
              <small className="text-muted d-block fw-semibold">EXIT RATE</small>
              <h5 className="fw-bold text-dark-brown m-0">{data.exit_rate} / hr</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="temple-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-ivory rounded border border-beige text-maroon">
              <Users size={24} />
            </div>
            <div>
              <small className="text-muted d-block fw-semibold">TOTAL QUEUE</small>
              <h5 className="fw-bold text-maroon m-0">{data.queue_length} devotees</h5>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="temple-card p-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-ivory rounded border border-beige text-success">
              <DoorOpen size={24} />
            </div>
            <div>
              <small className="text-muted d-block fw-semibold">OPEN GATES</small>
              <h5 className="fw-bold text-dark-brown m-0">{data.open_gates} Gates</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Grid */}
      <h6 className="fw-bold text-maroon mb-3">Zone Density Breakdown</h6>
      <div className="row g-3">
        {Object.entries(data.zones || {}).map(([key, zone]) => (
          <div className="col-md-4 col-lg-3" key={key}>
            <CrowdCard zone={zone} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrowdMonitoring;
