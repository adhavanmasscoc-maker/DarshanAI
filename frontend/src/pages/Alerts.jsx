import React, { useState, useEffect } from 'react';
import API from '../services/api';
import AlertCard from '../components/AlertCard';
import Loading from '../components/Loading';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchAlerts = async () => {
    try {
      const res = await API.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      await API.put(`/alerts/${id}/resolve`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ACTIVE') return a.status === 'ACTIVE';
    if (filter === 'RESOLVED') return a.status === 'RESOLVED';
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <AlertTriangle size={24} /> Safety Alert Feed & Incident Management
          </h4>
          <small className="text-muted">Real-time emergency events, crowd bottleneck alerts, and medical incident logs</small>
        </div>

        {/* Filter Buttons */}
        <div className="btn-group">
          <button onClick={() => setFilter('ALL')} className={`btn btn-sm ${filter === 'ALL' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>ALL ({alerts.length})</button>
          <button onClick={() => setFilter('ACTIVE')} className={`btn btn-sm ${filter === 'ACTIVE' ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}>ACTIVE ({alerts.filter(a => a.status === 'ACTIVE').length})</button>
          <button onClick={() => setFilter('RESOLVED')} className={`btn btn-sm ${filter === 'RESOLVED' ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}>RESOLVED ({alerts.filter(a => a.status === 'RESOLVED').length})</button>
        </div>
      </div>

      <div className="temple-card p-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <CheckCircle size={36} className="text-success mb-2" />
            <p>No safety alerts found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
