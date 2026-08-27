import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Clock, Users, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';

const DarshanStatus = ({ currentQueue = 1248, waitingTime = 38, avgDarshanTime = 4, nextPeak = '6:00 PM – 8:30 PM' }) => {
  const navigate = useNavigate();
  const [cats, setCats] = useState({
    "General": 850,
    "Special": 180,
    "VIP": 60,
    "Senior": 72,
    "Divyang": 24,
    "Family": 62
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/pilgrims/queue-summary');
        const b = res.data.category_breakdown;
        setCats({
          "General": b["General Darshan"] || 850,
          "Special": b["Special Darshan"] || 180,
          "VIP": b["VIP"] || 60,
          "Senior": b["Senior Citizen"] || 72,
          "Divyang": b["Divyang"] || 24,
          "Family": b["Children / Family"] || 62
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const totalDevotees = Object.values(cats).reduce((a, b) => a + b, 0);

  return (
    <div className="temple-card p-3 h-100 gold-glow">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <Flame className="text-saffron spin" size={20} />
          <h6 className="fw-bold text-maroon m-0 tracking-wider">UNIFIED QUEUE STATUS</h6>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 d-flex align-items-center gap-1 fw-bold" style={{ fontSize: '0.72rem' }}>
          <CheckCircle2 size={12} /> DARSHAN OPEN
        </span>
      </div>

      <div className="row g-2 mb-2 text-center">
        <div className="col-6">
          <div className="p-2 rounded bg-ivory border border-beige">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>TOTAL QUEUE (100%)</small>
            <span className="fw-bold text-maroon fs-5">{totalDevotees.toLocaleString()}</span> <small className="text-muted">devotees</small>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 rounded bg-ivory border border-beige">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ESTIMATED WAITING</small>
            <span className="fw-bold text-saffron fs-5">{waitingTime} min</span>
          </div>
        </div>
      </div>

      {/* 8-Category Mini Tags */}
      <div className="p-2 rounded bg-white border border-beige mb-2">
        <small className="text-muted d-block mb-1 fw-semibold" style={{ fontSize: '0.68rem' }}>LIVE CATEGORY BREAKDOWN</small>
        <div className="d-flex flex-wrap gap-1" style={{ fontSize: '0.7rem' }}>
          <span className="badge bg-ivory text-maroon border">General: {cats["General"]}</span>
          <span className="badge bg-ivory text-primary border">Special: {cats["Special"]}</span>
          <span className="badge bg-ivory text-danger border">VIP: {cats["VIP"]}</span>
          <span className="badge bg-ivory text-warning border">Senior: {cats["Senior"]}</span>
          <span className="badge bg-ivory text-success border">Divyang: {cats["Divyang"]}</span>
          <span className="badge bg-ivory text-info border">Family: {cats["Family"]}</span>
        </div>
      </div>

      <div className="d-flex flex-column gap-1 mb-2" style={{ fontSize: '0.78rem' }}>
        <div className="d-flex justify-content-between border-bottom border-beige pb-1">
          <span className="text-muted">Anti-Starvation Ratio:</span>
          <span className="fw-semibold text-success">4 Gen : 2 Spc : 1 Prio</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Next Peak Window:</span>
          <span className="fw-semibold text-saffron">{nextPeak}</span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/darshan-tokens')} 
        className="btn btn-warning w-100 fw-bold text-dark btn-sm d-flex align-items-center justify-content-center gap-1 mt-auto"
      >
        <span>MANAGE 100% QUEUE STREAM</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default DarshanStatus;
