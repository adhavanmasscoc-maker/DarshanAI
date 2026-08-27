import React from 'react';

const CrowdCard = ({ zone }) => {
  const { name, visitors, capacity, queue, risk_level } = zone;
  const percentage = Math.min(100, Math.round((visitors / capacity) * 100));

  const getBadgeClass = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MODERATE': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div className="temple-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0 text-dark-brown">{name}</h6>
        <span className={`badge px-2 py-1 ${getBadgeClass(risk_level)}`}>
          {risk_level}
        </span>
      </div>

      <div className="my-2">
        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
          <span className="text-muted">Density Load</span>
          <span className="fw-bold text-maroon">{percentage}%</span>
        </div>
        <div className="progress bg-ivory border border-beige" style={{ height: '8px' }}>
          <div 
            className={`progress-bar ${percentage > 85 ? 'bg-danger' : percentage > 65 ? 'bg-warning' : 'bg-success'}`} 
            role="progressbar" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="row g-2 mt-2 pt-2 border-top border-beige text-center" style={{ fontSize: '0.75rem' }}>
        <div className="col-4">
          <div className="text-muted">Devotees</div>
          <div className="fw-bold text-dark-brown">{visitors}</div>
        </div>
        <div className="col-4">
          <div className="text-muted">Queue</div>
          <div className="fw-bold text-maroon">{queue}</div>
        </div>
        <div className="col-4">
          <div className="text-muted">Capacity</div>
          <div className="fw-bold text-muted">{capacity}</div>
        </div>
      </div>
    </div>
  );
};

export default CrowdCard;
