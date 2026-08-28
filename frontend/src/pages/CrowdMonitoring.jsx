import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CrowdCard from '../components/CrowdCard';
import Loading from '../components/Loading';
import { 
  Camera, 
  Video, 
  Activity, 
  LogIn, 
  LogOut, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Settings2, 
  RefreshCw, 
  PlayCircle,
  Clock,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const CrowdMonitoring = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cameras, setCameras] = useState([]);
  const [selectedCamId, setSelectedCamId] = useState('CAM-001');
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingSource, setChangingSource] = useState(false);
  const [error, setError] = useState(null);

  const fetchCCTVData = async () => {
    try {
      const camsRes = await API.get('/cctv/cameras');
      setCameras(camsRes.data || []);
      
      const targetCam = selectedCamId || (camsRes.data[0]?.camera_id || 'CAM-001');
      const anaRes = await API.get(`/cctv/cameras/${targetCam}/analytics`);
      setAnalytics(anaRes.data);

      const predRes = await API.get(`/cctv/predictions?camera_id=${targetCam}`);
      setPredictions(predRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load CCTV data:', err);
      setError('CCTV stream or analytics telemetry interrupted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCCTVData();
    const interval = setInterval(fetchCCTVData, 2500);
    return () => clearInterval(interval);
  }, [selectedCamId]);

  const handleSourceChange = async (newSource) => {
    setChangingSource(true);
    try {
      await API.put(`/cctv/cameras/${selectedCamId}/source?source_type=${newSource}`);
      fetchCCTVData();
    } catch (err) {
      console.error('Failed to switch camera source:', err);
    } finally {
      setChangingSource(false);
    }
  };

  if (loading && !analytics) return <Loading />;

  const streamUrl = `/api/cctv/cameras/${selectedCamId}/stream`;

  return (
    <div className="container-fluid p-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
              <Camera size={24} /> CCTV-based real-time crowd intelligence
            </h4>
            <span className="badge bg-success text-light px-3 py-2 fw-bold d-flex align-items-center gap-1 shadow-sm" style={{ fontSize: '0.75rem' }}>
              <span className="spinner-grow spinner-grow-sm" role="status" style={{ width: '8px', height: '8px' }}></span>
              LIVE CCTV MODE
            </span>
          </div>
          <small className="text-muted">Real-world OpenCV + YOLO person detection, centroid tracking, and zone density telemetry</small>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Source Selector */}
          <div className="d-flex align-items-center gap-1 bg-white p-1 rounded border border-beige">
            <Video size={16} className="text-maroon ms-1" />
            <select
              className="form-select form-select-sm border-0 fw-bold text-maroon"
              value={analytics?.source_type || 'TEST_VIDEO'}
              onChange={e => handleSourceChange(e.target.value)}
              disabled={changingSource}
              style={{ width: '170px' }}
            >
              <option value="TEST_VIDEO">TEST VIDEO (Simulated)</option>
              <option value="WEBCAM">LOCAL WEBCAM</option>
              <option value="LIVE_CCTV">LIVE CCTV (RTSP)</option>
            </select>
          </div>

          <button 
            onClick={() => navigate('/simulation')} 
            className="btn btn-warning text-dark fw-bold btn-sm d-flex align-items-center gap-1 shadow-sm"
          >
            <PlayCircle size={16} /> Open What-If Simulation
          </button>

          <button onClick={fetchCCTVData} className="btn btn-outline-secondary btn-sm p-2">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Camera Selection Navigation Pills */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {cameras.map(cam => (
          <button
            key={cam.camera_id}
            onClick={() => setSelectedCamId(cam.camera_id)}
            className={`btn btn-sm d-flex align-items-center gap-2 py-1 px-3 ${selectedCamId === cam.camera_id ? 'btn-maroon text-gold fw-bold shadow-sm' : 'btn-outline-secondary'}`}
            style={{ fontSize: '0.8rem' }}
          >
            <Camera size={14} />
            <span>{cam.camera_id}: {cam.name}</span>
            <span className={`badge ${cam.risk_level === 'CRITICAL' ? 'bg-danger' : cam.risk_level === 'HIGH' ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.65rem' }}>
              {cam.person_count}
            </span>
          </button>
        ))}
      </div>

      {/* Main CCTV Feed & Real-Time Analytics Row */}
      <div className="row g-3 mb-4">
        {/* Left: Live Computer Vision MJPEG Stream Player */}
        <div className="col-lg-7">
          <div className="temple-card p-3 h-100 gold-glow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-maroon text-gold">{selectedCamId}</span>
                <h6 className="fw-bold text-maroon m-0">{analytics?.name}</h6>
              </div>
              <span className="badge bg-ivory border border-beige text-dark-brown" style={{ fontSize: '0.72rem' }}>
                Resolution: 1280x720 • {analytics?.fps || 15} FPS
              </span>
            </div>

            {/* Video Container */}
            <div 
              className="position-relative rounded overflow-hidden shadow-inner bg-dark d-flex align-items-center justify-content-center"
              style={{ minHeight: '360px', maxHeight: '420px', border: '2px solid #C59B27' }}
            >
              <img 
                src={streamUrl} 
                alt="Live CCTV Feed"
                className="img-fluid w-100 h-100 object-fit-contain"
                style={{ minHeight: '360px', maxHeight: '420px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400' fill='%232C1810'><rect width='100%' height='100%' fill='%23F9F6F0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%236B1D2F' font-size='16'>CCTV Stream Active - Ingesting Telemetry</text></svg>";
                }}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mt-2 text-muted small">
              <span>Source Mode: <strong className="text-maroon">{analytics?.source_type}</strong></span>
              <span>Computer Vision: <strong className="text-success">YOLOv8 + Centroid Tracking Active</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry & Multi-Horizon ML Forecasts */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3 h-100">
            {/* Live Camera Metrics Card */}
            <div className="temple-card p-3">
              <h6 className="fw-bold text-maroon mb-2 d-flex align-items-center gap-1">
                <Activity size={16} className="text-gold" /> Live Detection Telemetry ({selectedCamId})
              </h6>
              
              <div className="row g-2 text-center">
                <div className="col-4">
                  <div className="p-2 rounded bg-ivory border border-beige">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>PERSON COUNT</small>
                    <h4 className="fw-bold text-maroon m-0">{analytics?.person_count || 0}</h4>
                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>/ {analytics?.capacity} cap</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded bg-ivory border border-beige">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ENTRY RATE</small>
                    <h4 className="fw-bold text-primary m-0">{analytics?.entry_rate || 0}</h4>
                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>devotees/min</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded bg-ivory border border-beige">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>EXIT RATE</small>
                    <h4 className="fw-bold text-warning m-0">{analytics?.exit_rate || 0}</h4>
                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>devotees/min</small>
                  </div>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Zone Density Load</span>
                  <strong className={analytics?.density_percent > 80 ? 'text-danger' : analytics?.density_percent > 65 ? 'text-warning' : 'text-success'}>
                    {analytics?.density_percent}% ({analytics?.risk_level})
                  </strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${analytics?.density_percent > 80 ? 'bg-danger' : analytics?.density_percent > 65 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${analytics?.density_percent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Multi-Horizon ML Crowd Prediction Card */}
            <div className="temple-card p-3 gold-glow flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold text-maroon m-0 d-flex align-items-center gap-1">
                    <Sparkles size={16} className="text-gold" /> Multi-Horizon ML Forecasts
                  </h6>
                  <span className="badge bg-ivory border border-gold text-maroon" style={{ fontSize: '0.68rem' }}>
                    +15m • +30m • +60m
                  </span>
                </div>

                <div className="row g-2 mb-2">
                  {(predictions?.horizons || [
                    { horizon_label: '+15 min', predicted_crowd: 310, predicted_risk: 'LOW', estimated_wait_min: 14.5 },
                    { horizon_label: '+30 min', predicted_crowd: 390, predicted_risk: 'MODERATE', estimated_wait_min: 22.0 },
                    { horizon_label: '+60 min', predicted_crowd: 520, predicted_risk: 'HIGH', estimated_wait_min: 36.5 }
                  ]).map((h, i) => (
                    <div className="col-4" key={i}>
                      <div className="p-2 rounded bg-ivory border border-beige text-center">
                        <span className="badge bg-maroon text-gold mb-1" style={{ fontSize: '0.65rem' }}>{h.horizon_label}</span>
                        <h5 className="fw-bold text-dark-brown m-0">{h.predicted_crowd}</h5>
                        <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>{h.estimated_wait_min}m wait</small>
                        <span className={`badge mt-1 ${h.predicted_risk === 'CRITICAL' ? 'bg-danger' : h.predicted_risk === 'HIGH' ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.62rem' }}>
                          {h.predicted_risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendation Quote */}
                <div className="p-2 rounded bg-white border border-beige small text-dark-brown fst-italic mb-2">
                  "{predictions?.ai_recommendation || 'Deploy auxiliary queue marshals and monitor sanctum throughput.'}"
                </div>
              </div>

              <button 
                onClick={() => navigate('/simulation')} 
                className="btn btn-maroon text-gold btn-sm fw-bold w-100 py-2 d-flex align-items-center justify-content-center gap-1 shadow-sm"
              >
                <PlayCircle size={16} /> Test What-If Scenario with Live State
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdMonitoring;
