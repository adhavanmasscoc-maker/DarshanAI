import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Analytics = () => {
  const peakHourData = [
    { hour: '04:00', visitors: 1200 },
    { hour: '06:00', visitors: 4500 },
    { hour: '08:00', visitors: 9800 },
    { hour: '10:00', visitors: 11200 },
    { hour: '12:00', visitors: 6500 },
    { hour: '14:00', visitors: 4200 },
    { hour: '16:00', visitors: 8500 },
    { hour: '18:00', visitors: 14200 },
    { hour: '20:00', visitors: 9500 },
    { hour: '22:00', visitors: 2800 },
  ];

  return (
    <div className="container-fluid p-4">
      <h4 className="fw-bold text-maroon mb-1 d-flex align-items-center gap-2">
        <BarChart3 size={24} /> Historical Crowd Analytics
      </h4>
      <p className="text-muted mb-4">Historical visitor trend analysis, peak hours distribution, and festival surge historical benchmarks</p>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="temple-card p-4">
            <h6 className="fw-bold text-maroon mb-3">Hourly Diurnal Visitor Peaks (24h Aggregate)</h6>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0D5C7" />
                  <XAxis dataKey="hour" stroke="#5C4A3E" />
                  <YAxis stroke="#5C4A3E" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', color: '#2C1810', borderRadius: '8px', borderColor: '#E0D5C7' }} />
                  <Bar dataKey="visitors" fill="#C59B27" radius={[4, 4, 0, 0]} name="Avg Visitors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="temple-card p-4 h-100">
            <h6 className="fw-bold text-maroon mb-3">Key Historical Insights</h6>
            <div className="d-flex flex-column gap-3" style={{ fontSize: '0.85rem' }}>
              <div className="p-3 rounded bg-ivory border border-beige">
                <span className="text-muted d-block">PEAK DAILY TIME WINDOW</span>
                <span className="fw-bold text-maroon">08:00 AM – 10:30 AM & 05:30 PM – 07:30 PM</span>
              </div>
              <div className="p-3 rounded bg-ivory border border-beige">
                <span className="text-muted d-block">WEEKEND CROWD MULTIPLIER</span>
                <span className="fw-bold text-primary">+45.2% vs Weekday Baseline</span>
              </div>
              <div className="p-3 rounded bg-ivory border border-beige">
                <span className="text-muted d-block">HIGHEST HISTORICAL FESTIVAL</span>
                <span className="fw-bold text-danger">Diwali Deepavali (3.2x Surge)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
