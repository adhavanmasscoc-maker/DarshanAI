import React from 'react';
import { UserCog, Shield, Users, HeartPulse, UserCheck } from 'lucide-react';

const Staff = () => {
  const staffGroups = [
    { title: 'SECURITY PERSONNEL', active: 18, total: 20, icon: Shield, color: 'danger', desc: 'Main Gopuram & Queue Gate security officers' },
    { title: 'TEMPLE VOLUNTEERS', active: 32, total: 40, icon: Users, color: 'warning', desc: 'Darshan Hall & Prasadam queue guidance team' },
    { title: 'MEDICAL EMERGENCY AID', active: 6, total: 8, icon: HeartPulse, color: 'info', desc: 'First aid, heat exhaustion care & paramedics' },
    { title: 'QUEUE MANAGERS', active: 12, total: 15, icon: UserCheck, color: 'success', desc: 'Batch flow supervisors & counter managers' },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <UserCog size={24} /> TEMPLE STAFF & VOLUNTEERS
          </h4>
          <small className="text-muted">Real-time duty deployments across temple zones</small>
        </div>
      </div>

      <div className="row g-4">
        {staffGroups.map((group, idx) => {
          const Icon = group.icon;
          const percentage = Math.round((group.active / group.total) * 100);
          return (
            <div className="col-md-6" key={idx}>
              <div className="temple-card p-4 gold-glow">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-ivory rounded border border-beige text-maroon">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-maroon mb-1">{group.title}</h6>
                      <small className="text-muted d-block">{group.desc}</small>
                    </div>
                  </div>
                  <span className="badge bg-warning text-dark fw-bold px-3 py-2 fs-6">
                    {group.active} / {group.total} Active
                  </span>
                </div>

                <div className="my-2">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Deployment Capacity</span>
                    <span className="fw-bold text-maroon">{percentage}%</span>
                  </div>
                  <div className="progress bg-ivory border border-beige" style={{ height: '10px' }}>
                    <div 
                      className={`progress-bar bg-${group.color}`} 
                      role="progressbar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Staff;
