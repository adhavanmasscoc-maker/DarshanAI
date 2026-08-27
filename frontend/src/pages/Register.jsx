import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import DarshanLogo from '../components/DarshanLogo';
import { UserPlus, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    temple_id: 'TEMPLE-001',
    temple_name: 'Sri Somnath Jyotirlinga Temple',
    role: 'Temple Admin',
    password: '',
    confirm_password: '',
    city: 'Somnath',
    state: 'Gujarat',
    capacity: 18000
  });

  const [isNewTemple, setIsNewTemple] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/auth/register', formData);
      setSuccess(`Account registered successfully for ${res.data.full_name}! Redirecting to login...`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please verify input fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-ivory">
      <div className="container-fluid p-0 d-flex flex-column flex-md-row">
        {/* Left Side: Gopuram Visual Banner */}
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-center p-5 text-center" style={{ backgroundColor: '#FDFBF7', borderRight: '2px solid #E0D5C7' }}>
          <div className="gopuram-border mb-4"></div>
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-4 mb-3 border border-gold gold-glow">
            <DarshanLogo size={64} />
          </div>
          <h2 className="fw-bold text-maroon mb-1">DarshanAI</h2>
          <h6 className="text-saffron fw-semibold mb-3">Temple Intelligence</h6>
          
          <div className="p-3 rounded bg-white border border-beige shadow-sm my-3" style={{ maxWidth: '380px' }}>
            <p className="fst-italic text-dark-brown m-0" style={{ fontSize: '0.95rem' }}>
              "Register your temple account to access DarshanAI Multi-Tenant Intelligence Engine"
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="col-md-7 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="temple-card p-4 p-md-5 gold-glow" style={{ width: '100%', maxWidth: '620px', backgroundColor: '#FFFFFF' }}>
            <div className="mb-4">
              <h3 className="fw-bold text-maroon m-0">Create your account</h3>
              <p className="text-muted small">Enter your details to register for DarshanAI</p>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Arun Kumar"
                    required 
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="arun@temple.com"
                    required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Mobile Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="+91-9876543210"
                    required 
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Role</label>
                  <select 
                    className="form-select"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Temple Admin">Temple Admin</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Queue Manager">Queue Manager</option>
                    <option value="Security">Security</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Temple ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. TEMPLE-001"
                    required 
                    value={formData.temple_id}
                    onChange={e => setFormData({ ...formData, temple_id: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Temple Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Sri Kapaleeshwarar Temple"
                    required 
                    value={formData.temple_name}
                    onChange={e => setFormData({ ...formData, temple_name: e.target.value })}
                  />
                </div>

                {/* Inline New Temple Checkbox */}
                <div className="col-12">
                  <div className="form-check form-switch bg-ivory p-2 rounded border border-beige ms-1">
                    <input 
                      className="form-check-input ms-1" 
                      type="checkbox" 
                      id="newTempleCheck"
                      checked={isNewTemple}
                      onChange={e => setIsNewTemple(e.target.checked)}
                    />
                    <label className="form-check-label text-dark-brown fw-semibold ms-2" htmlFor="newTempleCheck">
                      Registering a brand new temple tenant?
                    </label>
                  </div>
                </div>

                {isNewTemple && (
                  <>
                    <div className="col-md-4">
                      <label className="form-label text-dark-brown small fw-bold">City</label>
                      <input type="text" className="form-control" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark-brown small fw-bold">State</label>
                      <input type="text" className="form-control" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-dark-brown small fw-bold">Capacity</label>
                      <input type="number" className="form-control" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} />
                    </div>
                  </>
                )}

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••••••"
                    required 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark-brown small fw-bold">Confirm Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••••••"
                    required 
                    value={formData.confirm_password}
                    onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-maroon text-gold fw-bold w-100 py-2 mt-4 d-flex align-items-center justify-content-center gap-2" 
                disabled={submitting}
              >
                <UserPlus size={18} />
                <span>{submitting ? 'Creating account...' : 'Sign up'}</span>
              </button>

              <div className="text-center mt-3 pt-2 border-top border-beige">
                <span className="text-muted small d-block mb-1">Already have an account?</span>
                <Link to="/login" className="text-maroon text-decoration-none fw-bold small d-inline-flex align-items-center gap-1">
                  <ArrowLeft size={14} /> Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
