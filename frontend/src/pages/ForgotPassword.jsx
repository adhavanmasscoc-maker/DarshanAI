import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DarshanLogo from '../components/DarshanLogo';
import { Mail, Building, KeyRound, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [templeId, setTempleId] = useState('TEMPLE-001');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await API.post('/auth/forgot-password', { email, temple_id: templeId });
      setMessage(res.data.message);
      if (res.data.reset_token) {
        setResetToken(res.data.reset_token);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to process password reset request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-ivory align-items-center justify-content-center p-4">
      <div className="temple-card p-4 p-md-5 gold-glow" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-4">
          <DarshanLogo size={52} className="mb-2" />
          <h4 className="fw-bold text-maroon m-0">Reset DarshanAI Password</h4>
          <p className="text-muted small">Enter your email and Temple ID to issue a secure reset link</p>
        </div>

        {message && (
          <div className="alert alert-info py-2 text-center small">
            {message}
          </div>
        )}

        {resetToken && (
          <div className="p-3 bg-ivory rounded border border-gold mb-3 text-center">
            <small className="text-muted d-block mb-1">DEMO RESET TOKEN GENERATED</small>
            <Link to={`/reset-password?token=${resetToken}`} className="btn btn-warning btn-sm fw-bold text-dark w-100">
              Click here to Reset Password
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark-brown small fw-bold">TEMPLE ID</label>
            <div className="input-group">
              <span className="input-group-text bg-ivory border-beige text-maroon"><Building size={18} /></span>
              <input type="text" className="form-control" required value={templeId} onChange={e => setTempleId(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-dark-brown small fw-bold">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-ivory border-beige text-maroon"><Mail size={18} /></span>
              <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn-maroon text-gold fw-bold w-100 py-2" disabled={submitting}>
            {submitting ? 'Generating link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-maroon text-decoration-none small fw-semibold">
            Remember password? Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
