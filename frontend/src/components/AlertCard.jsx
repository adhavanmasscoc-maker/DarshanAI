import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertCard = ({ alert, onResolve }) => {
  const { id, severity, zone, description, time, status, alert_type } = alert;

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div className="p-3 rounded bg-ivory border border-beige d-flex justify-content-between align-items-center mb-2">
      <div className="d-flex align-items-start gap-3">
        <div className="mt-1">
          <AlertTriangle className="text-saffron" size={20} />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className={`badge px-2 py-1 ${getSeverityBadge(severity)}`}>{severity}</span>
            <span className="fw-bold text-dark-brown" style={{ fontSize: '0.85rem' }}>{zone}</span>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>({alert_type})</small>
          </div>
          <p className="m-0 text-dark-brown" style={{ fontSize: '0.82rem' }}>{description}</p>
          <small className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.7rem' }}>
            <Clock size={12} />
            {new Date(time).toLocaleTimeString()}
          </small>
        </div>
      </div>

      {status === 'ACTIVE' && onResolve && (
        <button 
          onClick={() => onResolve(id)} 
          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 ms-3 fw-bold"
          style={{ fontSize: '0.75rem', whitespace: 'nowrap' }}
        >
          <CheckCircle size={14} />
          Resolve
        </button>
      )}
    </div>
  );
};

export default AlertCard;
