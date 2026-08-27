import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PredictionChart = ({ data }) => {
  return (
    <div className="temple-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold text-maroon mb-0">DEVOTEE FLOW & AI FORECAST</h6>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>Real-time observations vs ML predicted visitor trend</small>
        </div>
        <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.75rem' }}>
          <span className="d-flex align-items-center gap-1 text-saffron fw-semibold">
            <span className="d-inline-block rounded-circle bg-saffron" style={{ width: '8px', height: '8px' }}></span>
            Actual Devotees
          </span>
          <span className="d-flex align-items-center gap-1 text-gold fw-semibold">
            <span className="d-inline-block rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></span>
            Predicted Crowd
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B1D2F" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6B1D2F" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C59B27" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#C59B27" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0D5C7" />
            <XAxis dataKey="time" stroke="#5C4A3E" style={{ fontSize: '0.75rem', fontWeight: '600' }} />
            <YAxis stroke="#5C4A3E" style={{ fontSize: '0.75rem', fontWeight: '600' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E0D5C7', borderRadius: '8px', color: '#2C1810', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
            <Area type="monotone" dataKey="current_visitors" stroke="#6B1D2F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" name="Actual Crowd" />
            <Area type="monotone" dataKey="predicted_visitors" stroke="#C59B27" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted Crowd" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
