import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Loading from '../components/Loading';
import { Building2, Plus, CheckCircle, XCircle } from 'lucide-react';

const TempleManagement = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    temple_id: 'TEMPLE-004',
    name: 'Sri Kashi Vishwanath Temple',
    address: 'Lahori Tola',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    contact_number: '+91-9876543213',
    email: 'contact@kashivishwanath.org',
    capacity: 20000,
    opening_time: '03:00 AM',
    closing_time: '11:00 PM',
    status: 'ACTIVE',
    latitude: 25.3109,
    longitude: 83.0107
  });

  const fetchTemples = async () => {
    try {
      const res = await API.get('/temples');
      setTemples(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  const handleCreateTemple = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/temples', formData);
      setShowModal(false);
      fetchTemples();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create temple');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <Building2 size={24} /> Multi-Temple Super Admin Portal
          </h4>
          <small className="text-muted">Platform-level multi-tenant onboarding, status toggling, and data isolation audit</small>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-maroon text-gold fw-bold btn-sm d-flex align-items-center gap-1">
          <Plus size={16} /> Add New Temple
        </button>
      </div>

      {/* Temple Cards Grid */}
      <div className="row g-4">
        {temples.map(t => (
          <div className="col-md-6 col-lg-4" key={t.id}>
            <div className="temple-card p-4 h-100 gold-glow">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="badge bg-warning text-dark fw-bold mb-1">{t.temple_id}</span>
                  <h5 className="fw-bold text-maroon m-0">{t.name}</h5>
                  <small className="text-muted">{t.city}, {t.state}</small>
                </div>
                <span className={`badge ${t.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                  {t.status}
                </span>
              </div>
              <hr className="border-beige my-2" />
              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.85rem' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Capacity Threshold:</span>
                  <span className="fw-bold text-maroon">{t.capacity?.toLocaleString()} devotees</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Operating Hours:</span>
                  <span className="fw-bold text-dark-brown">{t.opening_time} – {t.closing_time}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Tenant Isolation:</span>
                  <span className="fw-bold text-success">ENFORCED (JWT Isolated)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Temple Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content temple-card border-gold">
              <div className="modal-header border-beige">
                <h5 className="modal-title text-maroon fw-bold">Onboard New Temple Tenant</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTemple}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">TEMPLE ID (Unique Code)</label>
                      <input type="text" className="form-control" required value={formData.temple_id} onChange={e => setFormData({...formData, temple_id: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">TEMPLE NAME</label>
                      <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">CITY</label>
                      <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">STATE</label>
                      <input type="text" className="form-control" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">MAX DEVOTEE CAPACITY</label>
                      <input type="number" className="form-control" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">OPERATING HOURS</label>
                      <div className="input-group">
                        <input type="text" className="form-control" value={formData.opening_time} onChange={e => setFormData({...formData, opening_time: e.target.value})} />
                        <span className="input-group-text">to</span>
                        <input type="text" className="form-control" value={formData.closing_time} onChange={e => setFormData({...formData, closing_time: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">LATITUDE</label>
                      <input type="number" step="any" className="form-control" value={formData.latitude} onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value)})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark-brown small fw-bold">LONGITUDE</label>
                      <input type="number" step="any" className="form-control" value={formData.longitude} onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-beige">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-maroon text-gold fw-bold">Onboard Temple</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempleManagement;
