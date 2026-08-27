import React, { useState } from 'react';
import { mlService } from '../services/mlService';
import { TrendingUp, Cpu, Sparkles, AlertCircle, Clock } from 'lucide-react';

const Predictions = () => {
  const [formData, setFormData] = useState({
    hour: 18,
    day_of_week: 5,
    month: 10,
    is_weekend: 1,
    is_holiday: 1,
    is_festival: 1,
    festival_type: 'Navratri Start',
    visitor_count: 11000,
    queue_length: 1800,
    number_of_open_gates: 5,
    staff_available: 40,
    weather: 'Clear'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInference = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.runFullInference(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <TrendingUp size={24} /> AI PREDICTIONS & FORECAST LAB
          </h4>
          <small className="text-muted">Real-time ML inference against saved scikit-learn models</small>
        </div>
      </div>

      {/* Multi-Hour Forecast Cards Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="temple-card p-4 gold-glow text-center">
            <small className="text-maroon fw-bold">NEXT 1 HOUR</small>
            <h2 className="fw-bold text-maroon my-1">9,820 <small className="text-muted fs-6">devotees</small></h2>
            <div className="d-flex justify-content-center gap-2 mt-2" style={{ fontSize: '0.75rem' }}>
              <span className="badge badge-moderate">MODERATE</span>
              <span className="badge badge-low">LOW RISK</span>
              <span className="badge bg-light text-dark border">24 min wait</span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="temple-card p-4 gold-glow text-center border-warning">
            <small className="text-warning fw-bold">NEXT 2 HOURS</small>
            <h2 className="fw-bold text-warning my-1">14,280 <small className="text-muted fs-6">devotees</small></h2>
            <div className="d-flex justify-content-center gap-2 mt-2" style={{ fontSize: '0.75rem' }}>
              <span className="badge badge-high">HIGH CROWD</span>
              <span className="badge badge-high">MEDIUM RISK</span>
              <span className="badge bg-light text-dark border">38 min wait</span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="temple-card p-4 gold-glow text-center border-danger">
            <small className="text-danger fw-bold">NEXT 4 HOURS</small>
            <h2 className="fw-bold text-danger my-1">21,450 <small className="text-muted fs-6">devotees</small></h2>
            <div className="d-flex justify-content-center gap-2 mt-2" style={{ fontSize: '0.75rem' }}>
              <span className="badge badge-critical">CRITICAL</span>
              <span className="badge badge-critical">HIGH RISK</span>
              <span className="badge bg-light text-dark border">65 min wait</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Parameters Form & ML Output */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="temple-card p-4">
            <h6 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
              <Cpu className="text-gold" size={18} /> Model Feature Inputs
            </h6>
            <form onSubmit={handleInference}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Hour of Day (0-23)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.hour} 
                    onChange={e => setFormData({...formData, hour: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Festival Status</label>
                  <select 
                    className="form-select"
                    value={formData.is_festival}
                    onChange={e => setFormData({...formData, is_festival: parseInt(e.target.value)})}
                  >
                    <option value={0}>No Festival</option>
                    <option value={1}>Major Festival</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Current Devotee Count</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.visitor_count} 
                    onChange={e => setFormData({...formData, visitor_count: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Active Queue Length</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.queue_length} 
                    onChange={e => setFormData({...formData, queue_length: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Open Entry Gates</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.number_of_open_gates} 
                    onChange={e => setFormData({...formData, number_of_open_gates: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-semibold">Staff On Duty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.staff_available} 
                    onChange={e => setFormData({...formData, staff_available: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-maroon w-100 mt-4 fw-bold text-gold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : <><Sparkles size={18} /> RUN ML INFERENCE</>}
              </button>
            </form>
          </div>
        </div>

        {/* Prediction Results Display */}
        <div className="col-lg-6">
          <div className="temple-card p-4 h-100 gold-glow">
            <h6 className="fw-bold text-maroon mb-3">Model Inference Outputs</h6>
            {result ? (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 rounded bg-ivory border border-beige">
                  <small className="text-muted d-block">PREDICTED DEVOTEE COUNT</small>
                  <h3 className="fw-bold text-maroon m-0">{result.predicted_visitor_count?.toLocaleString()}</h3>
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-ivory border border-warning">
                      <small className="text-muted d-block">CROWD LEVEL</small>
                      <h4 className="fw-bold text-warning m-0">{result.predicted_crowd_level}</h4>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-ivory border border-danger">
                      <small className="text-muted d-block">RISK ASSESSMENT</small>
                      <h4 className="fw-bold text-danger m-0">{result.predicted_risk_level}</h4>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-ivory border border-gold">
                  <small className="text-muted d-block">PREDICTED WAITING TIME</small>
                  <h3 className="fw-bold text-gold m-0">{result.predicted_waiting_time} minutes</h3>
                </div>

                <div className="p-3 rounded bg-ivory border border-secondary">
                  <small className="text-muted d-block mb-1">ANOMALY DETECTOR (Isolation Forest)</small>
                  <div className="fw-bold text-dark-brown">
                    STATUS: {result.is_anomaly ? <span className="text-danger">ANOMALY DETECTED</span> : <span className="text-success">NORMAL PATTERN</span>} (Score: {result.anomaly_score})
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <AlertCircle size={36} className="mb-2 text-maroon" />
                <p>Click "Run ML Inference" to test model predictions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
