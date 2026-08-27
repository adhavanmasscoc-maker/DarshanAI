import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Loading from '../components/Loading';
import { Ticket, Users, Play, ShieldAlert, CheckCircle2, RefreshCw, Flame, ArrowRight, HeartPulse, UserCheck } from 'lucide-react';

const DarshanTokens = () => {
  const [summary, setSummary] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [callingBatch, setCallingBatch] = useState(false);

  const fetchQueueData = async () => {
    try {
      const summaryRes = await API.get('/pilgrims/queue-summary');
      setSummary(summaryRes.data);

      let url = '/pilgrims';
      const params = [];
      if (statusFilter !== 'ALL') params.push(`status=${statusFilter}`);
      if (categoryFilter !== 'ALL') params.push(`category=${encodeURIComponent(categoryFilter)}`);
      if (params.length) url += `?${params.join('&')}`;

      const tokensRes = await API.get(url);
      setTokens(tokensRes.data);
    } catch (err) {
      console.error('Failed to fetch queue tokens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 4000);
    return () => clearInterval(interval);
  }, [statusFilter, categoryFilter]);

  const handleStatusTransition = async (tokenId, newStatus) => {
    try {
      await API.put(`/pilgrims/${tokenId}/status`, { status: newStatus });
      fetchQueueData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCallNextBatch = async () => {
    setCallingBatch(true);
    try {
      await API.post('/pilgrims/call-next');
      fetchQueueData();
    } catch (err) {
      console.error(err);
    } finally {
      setCallingBatch(false);
    }
  };

  if (loading || !summary) return <Loading />;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'General Darshan': return 'text-maroon border-maroon';
      case 'Special Darshan': return 'text-primary border-primary';
      case 'VIP': return 'text-danger border-danger';
      case 'Senior Citizen': return 'text-warning border-warning';
      case 'Divyang': return 'text-success border-success';
      case 'Children / Family': return 'text-info border-info';
      case 'Medical / Emergency': return 'text-danger border-danger';
      default: return 'text-secondary border-secondary';
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'WAITING': return 'bg-warning text-dark fw-bold';
      case 'CALLED': return 'bg-info text-dark fw-bold';
      case 'SERVING': return 'bg-primary text-light fw-bold';
      case 'IN_DARSHAN': return 'bg-success text-light fw-bold';
      case 'COMPLETED': return 'bg-secondary text-light';
      case 'SKIPPED': return 'bg-dark text-warning border border-warning';
      case 'CANCELLED': return 'bg-danger text-light';
      case 'EXITED': return 'bg-dark text-muted border border-secondary';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <Ticket size={24} /> 100% UNIFIED DEVOTEE QUEUE & TOKEN ENGINE
          </h4>
          <small className="text-muted">Total Temple Devotee Coverage Across All 8 Categories from Entry to Exit</small>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button onClick={fetchQueueData} className="btn btn-outline-secondary btn-sm p-2">
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={handleCallNextBatch} 
            disabled={callingBatch}
            className="btn btn-maroon text-gold fw-bold btn-sm d-flex align-items-center gap-2 gold-glow"
          >
            {callingBatch ? <span className="spinner-border spinner-border-sm"></span> : <><Play size={16} /> CALL NEXT ANTI-STARVATION BATCH</>}
          </button>
        </div>
      </div>

      {/* KPI Row & Anti-Starvation Banner */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="temple-card p-3 gold-glow text-center">
            <small className="text-maroon fw-bold">TOTAL QUEUED DEVOTTEES (100%)</small>
            <h2 className="fw-bold text-maroon my-1">{summary.total_active_devotees?.toLocaleString()}</h2>
            <small className="text-muted">100% Temple Crowd Represented</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="temple-card p-3 border-success text-center">
            <small className="text-success fw-bold">NOW SERVING AT SANCTUM</small>
            <h2 className="fw-bold text-success my-1">{summary.current_token_serving}</h2>
            <small className="text-muted">Batch Position #14</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="temple-card p-3 text-center">
            <small className="text-muted fw-semibold">ESTIMATED WAITING TIME</small>
            <h2 className="fw-bold text-saffron my-1">{summary.estimated_avg_wait_min} min</h2>
            <small className="text-muted">General Queue Baseline</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="temple-card p-3 border-gold text-center">
            <small className="text-muted fw-semibold">NON-STARVATION POLICY</small>
            <div className="fw-bold text-maroon mt-1" style={{ fontSize: '0.85rem' }}>
              4 General : 2 Special : 1 Priority
            </div>
            <small className="text-success fw-bold">Active & Enforced</small>
          </div>
        </div>
      </div>

      {/* 8-Category Live Breakdown Grid */}
      <h6 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
        <Users size={18} /> 8-Category Live Devotee Distribution
      </h6>
      <div className="row g-2 mb-4">
        {Object.entries(summary.category_breakdown || {}).map(([cat, count]) => (
          <div className="col-6 col-md-3 col-lg-1-5" key={cat}>
            <div className={`temple-card p-2 text-center border ${categoryFilter === cat ? 'gold-glow bg-ivory' : ''}`}
                 style={{ cursor: 'pointer' }}
                 onClick={() => setCategoryFilter(categoryFilter === cat ? 'ALL' : cat)}>
              <small className="text-muted d-block text-truncate" style={{ fontSize: '0.7rem' }}>{cat}</small>
              <h5 className="fw-bold text-maroon m-0">{count}</h5>
              <small className="text-gold" style={{ fontSize: '0.68rem' }}>
                {Math.round((count / (summary.total_active_devotees || 1)) * 100)}%
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Devotee Stream & Filter Controls */}
      <div className="temple-card p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <h6 className="fw-bold text-maroon m-0">Unified Devotee Token Lifecycle Stream</h6>
          
          {/* Status Filter Tabs */}
          <div className="btn-group flex-wrap">
            {['ALL', 'WAITING', 'CALLED', 'SERVING', 'IN_DARSHAN', 'COMPLETED', 'SKIPPED', 'CANCELLED', 'EXITED'].map(st => (
              <button 
                key={st} 
                onClick={() => setStatusFilter(st)} 
                className={`btn btn-xs ${statusFilter === st ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                {st} ({st === 'ALL' ? tokens.length : summary.status_breakdown[st] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Live Token Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="text-maroon small">
                <th>TOKEN CODE</th>
                <th>DEVOTEE / GROUP</th>
                <th>CATEGORY</th>
                <th>POS</th>
                <th>ZONE / COUNTER</th>
                <th>EST. WAIT</th>
                <th>LIFECYCLE STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length > 0 ? (
                tokens.map(t => (
                  <tr key={t.id}>
                    <td>
                      <span className="badge bg-ivory border border-gold text-maroon px-2 py-1 fs-6 fw-bold">
                        {t.token}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark-brown">{t.name}</div>
                      <small className="text-muted">{t.group_size} Devotees (Age: {t.age})</small>
                    </td>
                    <td>
                      <span className={`badge border ${getCategoryColor(t.category)}`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="fw-bold text-maroon">#{t.queue_position}</td>
                    <td>
                      <div className="small text-dark-brown fw-semibold">{t.counter}</div>
                      <small className="text-muted">{t.zone}</small>
                    </td>
                    <td className="fw-semibold text-saffron">{t.estimated_wait_min} min</td>
                    <td>
                      <span className={`badge ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {t.status === 'WAITING' && (
                          <button onClick={() => handleStatusTransition(t.id, 'CALLED')} className="btn btn-outline-info btn-xs py-0" title="Call Devotee">
                            Call
                          </button>
                        )}
                        {t.status === 'CALLED' && (
                          <button onClick={() => handleStatusTransition(t.id, 'SERVING')} className="btn btn-outline-primary btn-xs py-0" title="Serve Counter">
                            Serve
                          </button>
                        )}
                        {t.status === 'SERVING' && (
                          <button onClick={() => handleStatusTransition(t.id, 'IN_DARSHAN')} className="btn btn-outline-success btn-xs py-0" title="Enter Darshan">
                            Enter
                          </button>
                        )}
                        {t.status === 'IN_DARSHAN' && (
                          <button onClick={() => handleStatusTransition(t.id, 'COMPLETED')} className="btn btn-outline-secondary btn-xs py-0" title="Complete Darshan">
                            Complete
                          </button>
                        )}
                        {t.status === 'COMPLETED' && (
                          <button onClick={() => handleStatusTransition(t.id, 'EXITED')} className="btn btn-outline-dark btn-xs py-0" title="Log Exit">
                            Exit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No active devotee tokens found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DarshanTokens;
