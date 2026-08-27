import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarshanLogo from './DarshanLogo';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  PlayCircle, 
  Map, 
  Cpu, 
  UserCheck, 
  Building2, 
  Settings,
  Ticket,
  UserCog,
  FileSpreadsheet,
  LogOut,
  UserPlus
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role || 'VOLUNTEER';

  const templeName = user?.temple_name || 'Sri Kapaleeshwarar Temple';
  const templeCity = user?.temple_id === 'TEMPLE-001' ? 'Somnath, GJ' : 'Chennai, TN';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'SECURITY', 'MEDICAL', 'RECEPTIONIST', 'VOLUNTEER'] },
    { path: '/devotee-registration', label: 'Devotee registration', icon: UserPlus, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'RECEPTIONIST'] },
    { path: '/queue-management', label: 'Queue management', icon: Ticket, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'RECEPTIONIST'] },
    { path: '/crowd-monitoring', label: 'Crowd monitoring', icon: Activity, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'SECURITY', 'VOLUNTEER'] },
    { path: '/predictions', label: 'AI predictions', icon: TrendingUp, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER'] },
    { path: '/risk-analysis', label: 'Risk analysis', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'SECURITY', 'MEDICAL'] },
    { path: '/temple-map', label: 'Temple map', icon: Map, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'SECURITY', 'MEDICAL', 'VOLUNTEER'] },
    { path: '/simulation', label: 'Live simulation', icon: PlayCircle, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER'] },
    { path: '/model-performance', label: 'ML analytics', icon: Cpu, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER'] },
    { path: '/pilgrims', label: 'Devotee directory', icon: UserCheck, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'RECEPTIONIST'] },
    { path: '/staff', label: 'Staff & volunteers', icon: UserCog, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER'] },
    { path: '/alerts', label: 'Alerts', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER', 'SECURITY'] },
    { path: '/reports', label: 'Reports', icon: FileSpreadsheet, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN', 'MANAGER'] },
    { path: '/users', label: 'User directory', icon: Users, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN'] },
    { path: '/temples-management', label: 'Temple platform', icon: Building2, roles: ['SUPER_ADMIN'] },
    { path: '/settings', label: 'Temple settings', icon: Settings, roles: ['SUPER_ADMIN', 'TEMPLE_ADMIN'] },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 border-end" style={{ width: '270px', minHeight: '100vh', backgroundColor: '#FFFFFF', borderColor: '#E0D5C7' }}>
      {/* Brand Header */}
      <div className="d-flex align-items-center mb-3 px-2 text-decoration-none">
        <DarshanLogo size={38} className="me-2" />
        <div>
          <h5 className="m-0 fw-bold text-maroon" style={{ letterSpacing: '0.3px', fontFamily: 'Segoe UI, sans-serif' }}>DarshanAI</h5>
          <small className="text-saffron fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>Temple Intelligence</small>
        </div>
      </div>

      {/* Temple Tenant Info Badge */}
      <div className="p-2 rounded bg-ivory border border-beige mb-3 px-3">
        <div className="fw-bold text-dark-brown text-truncate" style={{ fontSize: '0.85rem' }}>{templeName}</div>
        <div className="text-gold small d-flex justify-content-between" style={{ fontSize: '0.75rem' }}>
          <span className="text-muted">{templeCity}</span>
          <span className="fw-bold text-maroon">ID: {user?.temple_id || 'TEMPLE-001'}</span>
        </div>
      </div>

      <hr className="border-beige my-1" />

      {/* Navigation List */}
      <ul className="nav nav-pills flex-column mb-auto mt-2 overflow-auto pe-1" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {navItems.filter(item => item.roles.includes(role)).map((item) => {
          const Icon = item.icon;
          return (
            <li className="nav-item mb-1" key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 rounded ${isActive ? 'bg-maroon text-gold fw-bold shadow-sm' : 'text-dark-brown hover-overlay'}`}
              >
                <Icon size={18} className="text-gold" />
                <span style={{ fontSize: '0.88rem' }}>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <hr className="border-beige" />

      {/* Profile & Logout */}
      <div className="px-2 d-flex align-items-center justify-content-between">
        <div className="text-truncate">
          <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>LOGGED IN AS</small>
          <span className="fw-bold text-maroon" style={{ fontSize: '0.8rem' }}>{user?.full_name?.split(' ')[0] || 'Admin'}</span>
          <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>{role}</span>
        </div>
        <button onClick={logout} className="btn btn-outline-danger btn-sm p-1 px-2" title="Log Out">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
