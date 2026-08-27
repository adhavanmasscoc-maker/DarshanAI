import React from 'react';
import { Sparkles, Brain, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const AIInsightCard = ({ 
  observation = "Crowd density is increasing near the Main Gopuram.", 
  prediction = "32% increase expected within 30 minutes.", 
  recommendation = "Open Gate 3 and deploy additional volunteers.", 
  riskLevel = "HIGH", 
  confidence = "91%" 
}) => {
  const getBadgeClass = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div className="temple-card p-3 h-100 gold-glow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Brain className="text-maroon spin" size={22} />
          <h6 className="fw-bold text-maroon m-0 tracking-wider">🧠 DARSHANAI AI INSIGHT</h6>
        </div>
        <span className="badge bg-opacity-10 bg-warning text-dark border border-warning px-2 py-1 fw-bold" style={{ fontSize: '0.72rem' }}>
          CONFIDENCE: {confidence}
        </span>
      </div>

      <div className="p-2 rounded bg-ivory border border-beige mb-3" style={{ fontSize: '0.85rem' }}>
        <span className="text-maroon fw-bold">Observation: </span>
        <span className="text-dark-brown">{observation}</span>
      </div>

      <div className="d-flex flex-column gap-2 mb-3" style={{ fontSize: '0.82rem' }}>
        <div className="d-flex align-items-start gap-2">
          <Zap size={16} className="text-saffron mt-1 flex-shrink-0" />
          <div>
            <strong className="text-saffron">Prediction: </strong>
            <span className="text-dark-brown">{prediction}</span>
          </div>
        </div>
        <div className="d-flex align-items-start gap-2">
          <Sparkles size={16} className="text-maroon mt-1 flex-shrink-0" />
          <div>
            <strong className="text-maroon">Recommendation: </strong>
            <span className="text-dark-brown">{recommendation}</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-beige">
        <span className="text-muted small fw-semibold">EVALUATED RISK:</span>
        <span className={`badge px-3 py-1 ${getBadgeClass(riskLevel)}`}>
          {riskLevel} RISK
        </span>
      </div>
    </div>
  );
};

export default AIInsightCard;
