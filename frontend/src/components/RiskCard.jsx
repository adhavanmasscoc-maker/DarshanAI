import React from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';

const RiskCard = ({ riskLevel = 'LOW', score = 0.15 }) => {
  const getConfig = (level) => {
    switch (level) {
      case 'CRITICAL':
        return { color: 'danger', icon: AlertOctagon, label: 'CRITICAL RISK', desc: 'Stampede warning or severe gate bottleneck' };
      case 'HIGH':
        return { color: 'warning', icon: AlertTriangle, label: 'HIGH RISK', desc: 'Queue accumulation exceeds safe threshold' };
      case 'MEDIUM':
      case 'MODERATE':
        return { color: 'info', icon: ShieldAlert, label: 'MODERATE RISK', desc: 'Increased crowd flow, monitor entry points' };
      default:
        return { color: 'success', icon: CheckCircle2, label: 'LOW RISK', desc: 'Safe operational parameters' };
    }
  };

  const config = getConfig(riskLevel);
  const Icon = config.icon;

  return (
    <div className={`temple-card p-3 border-${config.color}`}>
      <div className="d-flex align-items-center gap-3">
        <div className={`p-3 bg-${config.color} bg-opacity-10 rounded-circle text-${config.color}`}>
          <Icon size={28} />
        </div>
        <div>
          <div className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>CURRENT RISK EVALUATION</div>
          <h4 className={`fw-bold text-${config.color} m-0`}>{config.label}</h4>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>{config.desc}</small>
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
