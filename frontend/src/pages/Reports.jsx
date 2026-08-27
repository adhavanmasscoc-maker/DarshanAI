import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Reports = () => {
  const [timeframe, setTimeframe] = useState('DAILY');

  const reportData = [
    { period: 'Mon', devotees: 12400, avgWait: 22, incidents: 0 },
    { period: 'Tue', devotees: 14200, avgWait: 25, incidents: 1 },
    { period: 'Wed', devotees: 13800, avgWait: 24, incidents: 0 },
    { period: 'Thu', devotees: 16500, avgWait: 31, incidents: 0 },
    { period: 'Fri', devotees: 21400, avgWait: 42, incidents: 2 },
    { period: 'Sat', devotees: 28900, avgWait: 58, incidents: 3 },
    { period: 'Sun', devotees: 32400, avgWait: 65, incidents: 2 }
  ];

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <FileSpreadsheet size={24} /> TEMPLE OPERATIONS REPORTS
          </h4>
          <small className="text-muted">Aggregated crowd safety, queue metrics, and incident reports</small>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group me-2">
            <button onClick={() => setTimeframe('DAILY')} className={`btn btn-sm ${timeframe === 'DAILY' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Daily</button>
            <button onClick={() => setTimeframe('WEEKLY')} className={`btn btn-sm ${timeframe === 'WEEKLY' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Weekly</button>
            <button onClick={() => setTimeframe('MONTHLY')} className={`btn btn-sm ${timeframe === 'MONTHLY' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Monthly</button>
          </div>
          <button className="btn btn-warning btn-sm text-dark fw-bold d-flex align-items-center gap-1">
            <Download size={16} /> EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">TOTAL DEVOTEES ({timeframe})</small>
            <h3 className="fw-bold text-maroon my-1">139,600</h3>
            <small className="text-success">+14% vs last period</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">PEAK HOURS WINDOW</small>
            <h3 className="fw-bold text-saffron my-1">08:00 – 10:30 AM</h3>
            <small className="text-muted">High density window</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">AVERAGE WAITING TIME</small>
            <h3 className="fw-bold text-primary my-1">38.1 mins</h3>
            <small className="text-muted">Across all queues</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">LOGGED INCIDENTS</small>
            <h3 className="fw-bold text-danger my-1">8 Total</h3>
            <small className="text-success">All resolved</small>
          </div>
        </div>
      </div>

      {/* Analytics Report Chart */}
      <div className="temple-card p-4">
        <h6 className="fw-bold text-maroon mb-3">Devotee Footfall & Waiting Time Trends</h6>
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0D5C7" />
              <XAxis dataKey="period" stroke="#5C4A3E" />
              <YAxis stroke="#5C4A3E" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', color: '#2C1810', borderRadius: '8px', borderColor: '#E0D5C7' }} />
              <Bar dataKey="devotees" fill="#6B1D2F" radius={[4, 4, 0, 0]} name="Devotees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
