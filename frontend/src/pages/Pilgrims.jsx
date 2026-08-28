import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Loading from '../components/Loading';
import { useDebounce } from '../hooks/useDebounce';
import { UserCheck, Plus, Search, Ticket, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const Pilgrims = () => {
  const [pilgrims, setPilgrims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState('');
  const [age, setAge] = useState(35);
  const [phone, setPhone] = useState('+91-9876543210');
  const [groupSize, setGroupSize] = useState(2);
  const [category, setCategory] = useState('General Darshan');
  const [zone, setZone] = useState('Queue Complex');

  const categories = [
    'General Darshan',
    'Special Darshan',
    'VIP',
    'Senior Citizen',
    'Divyang',
    'Children / Family',
    'Medical / Emergency',
    'Other'
  ];

  const fetchPilgrims = async () => {
    setLoading(true);
    try {
      let url = `/pilgrims?page=${page}&limit=${limit}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      if (categoryFilter !== 'ALL') url += `&category=${encodeURIComponent(categoryFilter)}`;
      if (statusFilter !== 'ALL') url += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await API.get(url);
      setPilgrims(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilgrims();
  }, [page, limit, debouncedSearch, categoryFilter, statusFilter]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/pilgrims', {
        name, age: parseInt(age), phone, group_size: parseInt(groupSize), category, zone
      });
      setShowModal(false);
      setName('');
      fetchPilgrims();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <UserCheck size={24} /> Devotee registration & token directory
          </h4>
          <small className="text-muted">High-performance server-side paginated directory across all 8 devotee categories</small>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Debounced Search Input */}
          <div className="input-group" style={{ width: '260px' }}>
            <span className="input-group-text bg-ivory border-beige text-maroon"><Search size={16} /></span>
            <input 
              type="text" 
              className="form-control form-control-sm"
              placeholder="Search Name / Phone / Token..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Category Filter */}
          <select 
            className="form-select form-select-sm"
            value={categoryFilter}
            onChange={e => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: '160px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status Filter */}
          <select 
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: '130px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="WAITING">WAITING</option>
            <option value="CALLED">CALLED</option>
            <option value="SERVING">SERVING</option>
            <option value="IN_DARSHAN">IN_DARSHAN</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <button onClick={() => setShowModal(true)} className="btn btn-warning btn-sm fw-bold text-dark d-flex align-items-center gap-1">
            <Plus size={16} /> Issue Devotee Token
          </button>
        </div>
      </div>

      {/* Devotees Directory Table */}
      <div className="temple-card p-3 gold-glow">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="text-maroon small">
                <th>TOKEN NO</th>
                <th>DEVOTEE NAME</th>
                <th>AGE</th>
                <th>GROUP SIZE</th>
                <th>DEVOTEE CATEGORY</th>
                <th>COUNTER / ZONE</th>
                <th>REGISTRATION TIME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-maroon me-2"></span>
                    Loading page records...
                  </td>
                </tr>
              ) : pilgrims.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No devotees found matching criteria.
                  </td>
                </tr>
              ) : (
                pilgrims.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span className="badge bg-ivory border border-gold text-maroon px-2 py-1 fs-6 fw-bold">
                        <Ticket size={12} className="me-1" />
                        {p.token}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark-brown">{p.name}</td>
                    <td>{p.age} yrs</td>
                    <td>{p.group_size} devotees</td>
                    <td><span className="badge bg-maroon text-gold">{p.category}</span></td>
                    <td>
                      <div className="small fw-semibold">{p.counter}</div>
                      <small className="text-muted">{p.zone}</small>
                    </td>
                    <td className="text-muted small">{new Date(p.registration_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><span className="badge bg-success">{p.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top border-beige">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Rows per page:</span>
            <select 
              className="form-select form-select-sm"
              value={limit}
              onChange={e => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              style={{ width: '70px' }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-dark-brown small fw-semibold">Page {page}</span>
            <button 
              className="btn btn-outline-secondary btn-sm p-1"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm p-1"
              disabled={pilgrims.length < limit}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content temple-card border-gold">
              <div className="modal-header border-beige">
                <h5 className="modal-title text-maroon fw-bold">Register Devotee (Unified Queue)</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleRegister}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-maroon small fw-bold">Devotee Name</label>
                    <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-maroon small fw-bold">Age</label>
                      <input type="number" className="form-control" required value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-maroon small fw-bold">Group Size</label>
                      <input type="number" className="form-control" required value={groupSize} onChange={e => setGroupSize(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-maroon small fw-bold">Phone Number</label>
                    <input type="text" className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-maroon small fw-bold">Devotee Category (8 Categories)</label>
                    <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-maroon small fw-bold">Initial Entry Zone</label>
                    <select className="form-select" value={zone} onChange={e => setZone(e.target.value)}>
                      <option value="Queue Complex">Queue Complex</option>
                      <option value="Main Entrance">Main Entrance</option>
                      <option value="VIP Gate">VIP Gate</option>
                      <option value="Sanctum Corridor">Sanctum Corridor</option>
                      <option value="Medical Aid Station">Medical Aid Station</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-beige">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning text-dark fw-bold">Generate Token</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pilgrims;
