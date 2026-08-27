import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import Loading from '../components/Loading';
import { ShieldAlert } from 'lucide-react';

const RiskAnalysis = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await simulationService.getStatus();
      setData(res);
    };
    load();
  }, []);

  if (!data) return <Loading />;

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM':
      case 'MODERATE': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <ShieldAlert size={24} /> TEMPLE RISK OVERVIEW
          </h4>
          <small className="text-muted">Real-time safety risk evaluation across operational domains</small>
        </div>
      </div>

      {/* 5 Risk Sub-Domain Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center gold-glow">
            <small className="text-muted fw-semibold">OVERALL RISK</small>
            <h4 className="fw-bold text-maroon my-2">{data.risk_level || 'MEDIUM'}</h4>
            <span className={`badge px-2 py-1 ${getRiskBadge(data.risk_level)}`}>SCORE: 0.42</span>
          </div>
        </div>

        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">CROWD RISK</small>
            <h4 className="fw-bold text-warning my-2">{data.crowd_level || 'HIGH'}</h4>
            <span className={`badge px-2 py-1 ${getRiskBadge(data.crowd_level)}`}>DENSITY LOAD</span>
          </div>
        </div>

        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">QUEUE RISK</small>
            <h4 className="fw-bold text-primary my-2">MEDIUM</h4>
            <span className="badge badge-moderate">38 MIN WAIT</span>
          </div>
        </div>

        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">SECURITY RISK</small>
            <h4 className="fw-bold text-success my-2">LOW</h4>
            <span className="badge badge-low">GATES CLEAR</span>
          </div>
        </div>

        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">MEDICAL RISK</small>
            <h4 className="fw-bold text-success my-2">LOW</h4>
            <span className="badge badge-low">AID READY</span>
          </div>
        </div>
      </div>

      {/* Detailed Risk Indicators */}
      <div className="temple-card p-4">
        <h6 className="fw-bold text-maroon mb-3">Risk Factor Stress Breakdown</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 rounded bg-ivory border border-beige">
              <small className="text-muted d-block mb-1">Gate Entry Capacity</small>
              <div className="fw-bold text-warning fs-5">{Math.round((data.entry_rate / (data.open_gates * 400)) * 100)}% Capacity</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded bg-ivory border border-beige">
              <small className="text-muted d-block mb-1">Staff-to-Devotee Ratio</small>
              <div className="fw-bold text-primary fs-5">1 : {Math.round(data.current_visitors / (data.staff_available || 1))}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded bg-ivory border border-beige">
              <small className="text-muted d-block mb-1">Active Safety Alerts</small>
              <div className="fw-bold text-danger fs-5">2 Active Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
