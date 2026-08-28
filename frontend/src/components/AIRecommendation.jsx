import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const AIRecommendation = ({ recommendations = [], isAnomaly = false }) => {
  return (
    <div className="temple-card p-3 h-100 gold-glow">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Sparkles className="text-gold spin" size={20} />
        <h6 className="fw-bold text-maroon mb-0">AI Action Recommendations</h6>
      </div>

      <div className="d-flex flex-column gap-2">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div key={idx} className="p-2 rounded bg-ivory border border-beige d-flex align-items-start gap-2" style={{ fontSize: '0.82rem' }}>
              <span className="text-maroon mt-1 fw-bold">•</span>
              <span className="text-dark-brown">{rec}</span>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-muted" style={{ fontSize: '0.85rem' }}>
            <CheckCircle2 size={24} className="text-success mb-2 d-block mx-auto" />
            No special interventions required. Operations normal.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
