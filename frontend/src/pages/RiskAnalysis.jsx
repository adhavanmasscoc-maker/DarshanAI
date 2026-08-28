import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import Loading from '../components/Loading';
import { ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

const RiskAnalysis = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await simulationService.getStatus();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to load risk analysis data:', err);
      setError('Unable to fetch live risk telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <Loading />;

  if (error && !data) {
    return (
      <div className="container p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="temple-card p-4 text-center gold-glow" style={{ maxWidth: '480px' }}>
          <AlertTriangle size={36} className="text-warning mb-2" />
          <h5 className="fw-bold text-maroon mb-2">Risk Evaluation Disconnected</h5>
          <p className="text-muted small mb-3">{error}</p>
          <button onClick={loadData} className="btn btn-maroon text-gold fw-bold d-inline-flex align-items-center gap-1">
            <RefreshCw size={15} /> Retry connection
          </button>
        </div>
      </div>
    );
  }

  const getRiskBadge = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM':
      case 'MODERATE': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  const riskLvl = data?.risk_level || 'LOW';
  const crowdLvl = data?.crowd_level || 'MODERATE';

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <ShieldAlert size={24} /> Temple risk overview
          </h4>
          <small className="text-muted">Real-time safety risk evaluation across operational domains</small>
        </div>
      </div>

      {/* 5 Risk Sub-Domain Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center gold-glow">
            <small className="text-muted fw-semibold">OVERALL RISK</small>
            <h4 className="fw-bold text-maroon my-2">{riskLvl}</h4>
            <span className={`badge px-2 py-1 ${getRiskBadge(riskLvl)}`}>SCORE: 0.42</span>
          </div>
        </div>

        <div className="col-md-4 col-lg-2-4">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">CROWD RISK</small>
            <h4 className="fw-bold text-warning my-2">{crowdLvl}</h4>
            <span className={`badge px-2 py-1 ${getRiskBadge(crowdLvl)}`}>DENSITY LOAD</span>
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
              <div className="fw-bold text-warning fs-5">
                {Math.round(((data?.entry_rate || 200) / (Math.max(1, data?.open_gates || 5) * 400)) * 100)}% Capacity
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded bg-ivory border border-beige">
              <small className="text-muted d-block mb-1">Staff-to-Devotee Ratio</small>
              <div className="fw-bold text-primary fs-5">
                1 : {Math.round((data?.current_visitors || 1000) / (data?.staff_available || 40))}
              </div>
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
