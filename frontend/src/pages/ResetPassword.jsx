import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import DarshanLogo from '../components/DarshanLogo';
import { Lock, KeyRound, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/auth/reset-password', {
        reset_token: token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Reset failed. Token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-ivory align-items-center justify-content-center p-4">
      <div className="temple-card p-4 p-md-5 gold-glow" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-4">
          <DarshanLogo size={52} className="mb-2" />
          <h4 className="fw-bold text-maroon m-0">Set New Password</h4>
          <p className="text-muted small">Enter your new secure account password</p>
        </div>

        {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}
        {message && <div className="alert alert-success py-2 text-center small">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark-brown small fw-bold">NEW PASSWORD</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-dark-brown small fw-bold">CONFIRM NEW PASSWORD</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn btn-maroon text-gold fw-bold w-100 py-2" disabled={submitting}>
            {submitting ? 'Updating password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
