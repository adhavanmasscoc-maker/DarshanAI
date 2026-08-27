import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarshanLogo from '../components/DarshanLogo';
import { Eye, EyeOff, Lock, Mail, Building, ShieldCheck, UserPlus } from 'lucide-react';

const Login = () => {
  const [templeId, setTempleId] = useState('TEMPLE-001');
  const [email, setEmail] = useState('admin@temple001.com');
  const [password, setPassword] = useState('TempleAdmin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(templeId, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoAccount = (tId, em, pw) => {
    setTempleId(tId);
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="d-flex min-vh-100 bg-ivory">
      <div className="container-fluid p-0 d-flex flex-column flex-md-row">
        {/* Left Side: Gopuram Visual & Tagline Banner */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5 position-relative text-center" style={{ backgroundColor: '#FDFBF7', borderRight: '2px solid #E0D5C7' }}>
          <div className="gopuram-border mb-4"></div>
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-4 mb-3 border border-gold gold-glow">
            <DarshanLogo size={64} />
          </div>
          <h1 className="fw-bold text-maroon mb-1" style={{ fontSize: '2.5rem' }}>DarshanAI</h1>
          <h5 className="text-saffron fw-semibold mb-3">Temple Intelligence</h5>
          
          <div className="p-3 rounded bg-white border border-beige shadow-sm my-3" style={{ maxWidth: '420px' }}>
            <p className="fst-italic text-dark-brown m-0" style={{ fontSize: '0.95rem' }}>
              "AI-powered temple crowd intelligence"
            </p>
            <small className="text-muted d-block mt-1">Predict. Prevent. Protect.</small>
          </div>

          <div className="d-flex gap-2 justify-content-center mt-2" style={{ fontSize: '0.8rem' }}>
            <span className="badge badge-low">Predict</span>
            <span className="badge badge-moderate">Prevent</span>
            <span className="badge badge-high">Protect</span>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="temple-card p-4 p-md-5 gold-glow" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF' }}>
            <div className="mb-4">
              <h3 className="fw-bold text-maroon m-0">Welcome to DarshanAI</h3>
              <p className="text-muted small">Authorized temple personnel authentication portal</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-center" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-maroon small fw-semibold">Temple ID</label>
                <div className="input-group">
                  <span className="input-group-text bg-ivory border-beige text-maroon">
                    <Building size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TEMPLE-001"
                    value={templeId}
                    onChange={(e) => setTempleId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-maroon small fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-ivory border-beige text-maroon">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@temple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="form-label text-maroon small fw-semibold">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-ivory border-beige text-maroon">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-beige text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-maroon w-100 py-2 fw-bold text-gold d-flex align-items-center justify-content-center gap-2 mb-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Login</span>
                  </>
                )}
              </button>

              <div className="text-end mb-3">
                <Link to="/forgot-password" className="text-muted small text-decoration-none">
                  Forgot password?
                </Link>
              </div>
            </form>

            <hr className="border-beige my-4" />

            {/* Clearly Visible Sign Up Section */}
            <div className="text-center">
              <span className="text-muted small d-block mb-2">Don't have an account?</span>
              <Link 
                to="/register" 
                className="btn btn-outline-warning w-100 fw-bold text-maroon border-gold d-flex align-items-center justify-content-center gap-2 py-2"
              >
                <UserPlus size={18} />
                <span>Sign up</span>
              </Link>
            </div>

            {/* Quick Autofill Buttons */}
            <div className="mt-4 pt-3 border-top border-beige text-center">
              <small className="text-muted d-block mb-2">QUICK DEMO ACCOUNTS (Autofill)</small>
              <div className="d-flex flex-wrap gap-1 justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => setDemoAccount('TEMPLE-001', 'admin@temple001.com', 'TempleAdmin123!')}
                  style={{ fontSize: '0.72rem' }}
                >
                  Temple Admin (Temple 1)
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary" 
                  onClick={() => setDemoAccount('TEMPLE-002', 'admin@temple002.com', 'TempleAdmin123!')}
                  style={{ fontSize: '0.72rem' }}
                >
                  Temple Admin (Temple 2)
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-dark" 
                  onClick={() => setDemoAccount('', 'superadmin@darshanai.com', 'SuperAdmin123!')}
                  style={{ fontSize: '0.72rem' }}
                >
                  Super Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
