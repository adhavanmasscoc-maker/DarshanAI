import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, Bell, Radio, UserCheck, Clock, Building } from 'lucide-react';

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const templeName = user?.temple_name || 'Sri Kapaleeshwarar Temple';
  const templeId = user?.temple_id || 'TEMPLE-001';

  return (
    <header className="navbar px-4 py-2 border-bottom border-beige d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left: Menu & Active Temple */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 border-beige text-dark-brown">
          <Menu size={18} className="text-maroon" />
          <span className="d-none d-md-inline fw-semibold">Menu</span>
        </button>

        <div className="d-flex align-items-center gap-2 ps-2 border-start border-beige">
          <Building size={20} className="text-maroon" />
          <div>
            <div className="fw-bold text-maroon" style={{ fontSize: '0.92rem' }}>
              {templeName}
            </div>
            <div className="text-gold" style={{ fontSize: '0.75rem' }}>
              Temple ID: <span className="fw-bold text-dark-brown">{templeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Notifications, System Status, User Avatar */}
      <div className="d-flex align-items-center gap-3">
        {/* System Online Status */}
        <div className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1 d-flex align-items-center gap-1 fw-bold">
          <Radio size={14} className="spin text-success" />
          <span>🟢 System Online</span>
        </div>

        {/* Notifications */}
        <button className="btn btn-outline-secondary btn-sm position-relative text-maroon border-beige p-2">
          <Bell size={18} />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>

        {/* Live Clock */}
        <div className="d-none d-lg-flex align-items-center gap-2 text-maroon fw-mono ms-2">
          <Clock size={16} />
          <span className="fw-bold" style={{ fontSize: '0.88rem' }}>{timeStr}</span>
        </div>

        {/* User Profile */}
        <div className="d-flex align-items-center gap-2 ps-3 border-start border-beige">
          <div className="p-2 bg-maroon rounded-circle text-gold border border-gold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            <UserCheck size={18} />
          </div>
          <div className="d-none d-md-block text-end">
            <div className="fw-bold text-dark-brown" style={{ fontSize: '0.82rem' }}>{user?.full_name?.split(' ')[0] || 'Temple Admin'}</div>
            <div className="text-gold fw-semibold" style={{ fontSize: '0.7rem' }}>{user?.role || 'TEMPLE_ADMIN'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
