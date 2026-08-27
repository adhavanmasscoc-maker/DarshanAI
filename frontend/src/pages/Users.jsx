import React, { useState } from 'react';
import { Users } from 'lucide-react';

const UsersPage = () => {
  const [users] = useState([
    { id: 1, name: 'Global Platform Super Admin', email: 'superadmin@darshanai.com', role: 'SUPER_ADMIN', temple: 'Platform Global' },
    { id: 2, name: 'Somnath Temple Administrator', email: 'admin@temple001.com', role: 'TEMPLE_ADMIN', temple: 'Sri Somnath Temple (TEMPLE-001)' },
    { id: 3, name: 'Rajesh Kumar (Operations Manager)', email: 'manager@temple001.com', role: 'MANAGER', temple: 'Sri Somnath Temple (TEMPLE-001)' },
    { id: 4, name: 'Vikram Singh (Chief Security Officer)', email: 'security@temple001.com', role: 'SECURITY', temple: 'Sri Somnath Temple (TEMPLE-001)' },
    { id: 5, name: 'Dr. Ananya Sharma (First Aid Lead)', email: 'medical@temple001.com', role: 'MEDICAL', temple: 'Sri Somnath Temple (TEMPLE-001)' },
    { id: 6, name: 'Suresh Patel (Token Receptionist)', email: 'reception@temple001.com', role: 'RECEPTIONIST', temple: 'Sri Somnath Temple (TEMPLE-001)' },
    { id: 7, name: 'Amit Verma (Queue Volunteer Lead)', email: 'volunteer@temple001.com', role: 'VOLUNTEER', temple: 'Sri Somnath Temple (TEMPLE-001)' }
  ]);

  return (
    <div className="container-fluid p-4">
      <h4 className="fw-bold text-maroon mb-1 d-flex align-items-center gap-2">
        <Users size={24} /> Staff User Directory & Access Roles
      </h4>
      <p className="text-muted mb-4">Multi-tenant role authorizations (SUPER_ADMIN, TEMPLE_ADMIN, MANAGER, SECURITY, MEDICAL, RECEPTIONIST, VOLUNTEER)</p>

      <div className="temple-card p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="text-maroon small">
                <th>USER NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>ASSIGNED ROLE</th>
                <th>TENANT SCOPE</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="fw-semibold text-dark-brown">{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'SUPER_ADMIN' ? 'bg-danger' : u.role === 'TEMPLE_ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-maroon fw-semibold">{u.temple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
