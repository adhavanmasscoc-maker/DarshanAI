import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'gold', subtitle, trend }) => {
  const getColorClass = (col) => {
    switch (col) {
      case 'danger': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      case 'success': return 'text-success';
      default: return 'text-maroon';
    }
  };

  return (
    <div className="temple-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span className="text-gold text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <h3 className={`fw-bold ${getColorClass(color)} my-1`}>{value}</h3>
        </div>
        {Icon && (
          <div className="p-2 bg-ivory rounded border border-beige">
            <Icon size={22} className="text-maroon" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-beige" style={{ fontSize: '0.75rem' }}>
          {subtitle && <span className="text-muted">{subtitle}</span>}
          {trend && (
            <span className={`fw-bold ${trend.startsWith('+') ? 'text-danger' : 'text-success'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
