import React, { useState } from 'react';
import API from '../services/api';
import { UserPlus, Users, Zap, FileSpreadsheet, AlertTriangle, CheckCircle, Ticket, Upload } from 'lucide-react';

const DevoteeRegistration = () => {
  const [activeTab, setActiveTab] = useState('INDIVIDUAL');
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Individual Registration State
  const [indForm, setIndForm] = useState({
    name: '',
    age: 35,
    gender: 'Male',
    mobile: '+91-9876543210',
    group_size: 1,
    darshan_type: 'General Darshan',
    preferred_time: '10:00 AM',
    special_requirements: 'None'
  });

  // 2. Group Registration State
  const [groupName, setGroupName] = useState('Family Group A');
  const [groupDarshanType, setGroupDarshanType] = useState('Children / Family');
  const [groupMembers, setGroupMembers] = useState([
    { name: 'Rajesh Sharma', age: 40, gender: 'Male' },
    { name: 'Sunita Sharma', age: 36, gender: 'Female' },
    { name: 'Aarav Sharma', age: 10, gender: 'Male' }
  ]);

  // 3. Quick Registration State
  const [quickForm, setQuickForm] = useState({
    name: 'Karan Patel',
    mobile: '+91-9811122233',
    age: 28,
    group_size: 1,
    darshan_type: 'General Darshan'
  });

  // 4. Bulk Registration State
  const [parsedRows, setParsedRows] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [submittingBulk, setSubmittingBulk] = useState(false);

  // Handle Mobile Duplicate Check
  const checkDuplicate = async (mobile) => {
    if (!mobile || mobile.length < 10) return;
    try {
      const res = await API.get(`/pilgrims?search=${encodeURIComponent(mobile)}`);
      if (res.data && res.data.length > 0) {
        setDuplicateWarning(res.data[0]);
      } else {
        setDuplicateWarning(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Individual Registration
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/pilgrims', {
        name: indForm.name,
        age: parseInt(indForm.age),
        phone: indForm.mobile,
        group_size: parseInt(indForm.group_size),
        category: indForm.darshan_type,
        zone: 'Queue Complex'
      });
      setSuccessMessage(`Devotee registered successfully! Issued Token: ${res.data.token}`);
      setIndForm({ ...indForm, name: '' });
      setDuplicateWarning(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Group Registration
  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      let tokensArr = [];
      for (const m of groupMembers) {
        const res = await API.post('/pilgrims', {
          name: `${m.name} (${groupName})`,
          age: parseInt(m.age),
          phone: indForm.mobile || '+91-9800011122',
          group_size: 1,
          category: groupDarshanType,
          zone: 'Queue Complex'
        });
        tokensArr.push(res.data.token);
      }
      setSuccessMessage(`Group ${groupName} registered! Issued Tokens: ${tokensArr.join(', ')}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Quick Registration
  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/pilgrims', {
        name: quickForm.name,
        age: parseInt(quickForm.age),
        phone: quickForm.mobile,
        group_size: parseInt(quickForm.group_size),
        category: quickForm.darshan_type,
        zone: 'Main Entrance'
      });
      setSuccessMessage(`Quick Registration Complete! Issued Token: ${res.data.token}`);
      setQuickForm({ ...quickForm, name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // Parse CSV Content
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) {
        setBulkError('CSV file is empty or invalid.');
        return;
      }
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 4) {
          rows.push({
            name: cols[0] || `Devotee ${i}`,
            age: parseInt(cols[1]) || 30,
            phone: cols[3] || '+91-9800000000',
            group_size: parseInt(cols[4]) || 1,
            category: cols[5] || 'General Darshan',
            zone: 'Queue Complex'
          });
        }
      }
      setParsedRows(rows);
      setBulkError('');
    };
    reader.readAsText(file);
  };

  // High-Performance Single Bulk API Endpoint Submit
  const handleBulkSubmit = async () => {
    if (parsedRows.length === 0) return;
    setSubmittingBulk(true);
    try {
      const res = await API.post('/pilgrims/bulk', parsedRows);
      setSuccessMessage(`Bulk Registration Success! Fast atomic batch registered ${res.data.registered_count} devotees.`);
      setParsedRows([]);
    } catch (err) {
      setBulkError('Bulk registration failed.');
      console.error(err);
    } finally {
      setSubmittingBulk(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Title Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <UserPlus size={24} /> Devotee registration
          </h4>
          <small className="text-muted">Register devotees into DarshanAI Unified Queue System</small>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => { setActiveTab('INDIVIDUAL'); setSuccessMessage(''); }} 
          className={`btn btn-sm ${activeTab === 'INDIVIDUAL' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
        >
          Individual registration
        </button>
        <button 
          onClick={() => { setActiveTab('GROUP'); setSuccessMessage(''); }} 
          className={`btn btn-sm ${activeTab === 'GROUP' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
        >
          Group registration
        </button>
        <button 
          onClick={() => { setActiveTab('QUICK'); setSuccessMessage(''); }} 
          className={`btn btn-sm ${activeTab === 'QUICK' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
        >
          Quick registration
        </button>
        <button 
          onClick={() => { setActiveTab('BULK'); setSuccessMessage(''); }} 
          className={`btn btn-sm ${activeTab === 'BULK' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}
        >
          Bulk CSV registration
        </button>
      </div>

      {/* Duplicate Warning Banner */}
      {duplicateWarning && (
        <div className="alert alert-warning p-3 mb-4 border-warning d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <AlertTriangle className="text-danger" size={22} />
            <div>
              <strong className="text-danger">Possible duplicate devotee detected!</strong>
              <div className="small text-dark-brown">
                Devotee <strong>{duplicateWarning.name}</strong> ({duplicateWarning.phone}) is already registered with Token <strong>{duplicateWarning.token}</strong>.
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDuplicateWarning(null)}>View existing</button>
            <button className="btn btn-sm btn-warning fw-bold text-dark" onClick={() => setDuplicateWarning(null)}>Continue registration</button>
          </div>
        </div>
      )}

      {/* TAB 1: INDIVIDUAL REGISTRATION */}
      {activeTab === 'INDIVIDUAL' && (
        <div className="temple-card p-4 gold-glow" style={{ maxWidth: '720px' }}>
          <h6 className="fw-bold text-maroon mb-3">Individual Devotee Registration</h6>
          <form onSubmit={handleIndividualSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={indForm.name}
                  onChange={e => setIndForm({ ...indForm, name: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark-brown small fw-bold">Age</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  value={indForm.age}
                  onChange={e => setIndForm({ ...indForm, age: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark-brown small fw-bold">Gender</label>
                <select 
                  className="form-select"
                  value={indForm.gender}
                  onChange={e => setIndForm({ ...indForm, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Mobile Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={indForm.mobile}
                  onChange={e => {
                    setIndForm({ ...indForm, mobile: e.target.value });
                    checkDuplicate(e.target.value);
                  }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Number of Members</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={indForm.group_size}
                  onChange={e => setIndForm({ ...indForm, group_size: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Darshan Type</label>
                <select 
                  className="form-select"
                  value={indForm.darshan_type}
                  onChange={e => setIndForm({ ...indForm, darshan_type: e.target.value })}
                >
                  <option value="General Darshan">General Darshan</option>
                  <option value="Special Darshan">Special Darshan</option>
                  <option value="VIP">VIP Fast Pass</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Divyang">Divyang (Special Needs)</option>
                  <option value="Children / Family">Children / Family</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Special Requirements</label>
                <select 
                  className="form-select"
                  value={indForm.special_requirements}
                  onChange={e => setIndForm({ ...indForm, special_requirements: e.target.value })}
                >
                  <option value="None">None</option>
                  <option value="Wheelchair">Wheelchair assistance</option>
                  <option value="Medical assistance">Medical assistance</option>
                  <option value="Elderly assistance">Elderly assistance</option>
                  <option value="Child assistance">Child assistance</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setIndForm({ name: '', age: 35, gender: 'Male', mobile: '', group_size: 1, darshan_type: 'General Darshan', preferred_time: '10:00 AM', special_requirements: 'None' })}>
                Clear
              </button>
              <button type="submit" className="btn btn-maroon text-gold fw-bold d-flex align-items-center gap-2">
                <Ticket size={18} /> Register devotee
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: GROUP REGISTRATION */}
      {activeTab === 'GROUP' && (
        <div className="temple-card p-4 gold-glow" style={{ maxWidth: '720px' }}>
          <h6 className="fw-bold text-maroon mb-3">Family / Group Registration</h6>
          <form onSubmit={handleGroupSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Group Name</label>
                <input type="text" className="form-control" value={groupName} onChange={e => setGroupName(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-dark-brown small fw-bold">Darshan Type</label>
                <select className="form-select" value={groupDarshanType} onChange={e => setGroupDarshanType(e.target.value)}>
                  <option value="Children / Family">Children / Family</option>
                  <option value="General Darshan">General Darshan</option>
                  <option value="Special Darshan">Special Darshan</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <h6 className="fw-bold text-maroon mb-2 small">Group Members ({groupMembers.length})</h6>
            {groupMembers.map((m, idx) => (
              <div className="row g-2 mb-2 p-2 bg-ivory rounded border border-beige align-items-center" key={idx}>
                <div className="col-5">
                  <input type="text" className="form-control form-control-sm" placeholder="Member name" value={m.name} onChange={e => {
                    const copy = [...groupMembers];
                    copy[idx].name = e.target.value;
                    setGroupMembers(copy);
                  }} />
                </div>
                <div className="col-3">
                  <input type="number" className="form-control form-control-sm" placeholder="Age" value={m.age} onChange={e => {
                    const copy = [...groupMembers];
                    copy[idx].age = e.target.value;
                    setGroupMembers(copy);
                  }} />
                </div>
                <div className="col-4">
                  <select className="form-select form-select-sm" value={m.gender} onChange={e => {
                    const copy = [...groupMembers];
                    copy[idx].gender = e.target.value;
                    setGroupMembers(copy);
                  }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setGroupMembers([...groupMembers, { name: `Member ${groupMembers.length + 1}`, age: 25, gender: 'Male' }])}
              >
                + Add member
              </button>
              <button type="submit" className="btn btn-maroon text-gold fw-bold d-flex align-items-center gap-2">
                <Ticket size={18} /> Register group tokens
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: QUICK REGISTRATION */}
      {activeTab === 'QUICK' && (
        <div className="temple-card p-4 gold-glow" style={{ maxWidth: '540px' }}>
          <h6 className="fw-bold text-maroon mb-3 d-flex align-items-center gap-2">
            <Zap className="text-saffron" size={20} /> High-Volume Quick Registration
          </h6>
          <form onSubmit={handleQuickSubmit}>
            <div className="mb-3">
              <label className="form-label text-dark-brown small fw-bold">Name</label>
              <input type="text" className="form-control" required value={quickForm.name} onChange={e => setQuickForm({ ...quickForm, name: e.target.value })} />
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label text-dark-brown small fw-bold">Mobile</label>
                <input type="text" className="form-control" required value={quickForm.mobile} onChange={e => setQuickForm({ ...quickForm, mobile: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label text-dark-brown small fw-bold">Age</label>
                <input type="number" className="form-control" required value={quickForm.age} onChange={e => setQuickForm({ ...quickForm, age: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-dark-brown small fw-bold">Darshan Type</label>
              <select className="form-select" value={quickForm.darshan_type} onChange={e => setQuickForm({ ...quickForm, darshan_type: e.target.value })}>
                <option value="General Darshan">General Darshan</option>
                <option value="Special Darshan">Special Darshan</option>
                <option value="VIP">VIP</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Divyang">Divyang</option>
              </select>
            </div>
            <button type="submit" className="btn btn-warning text-dark fw-bold w-100 py-2">
              Quick register & Issue token
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: BULK CSV REGISTRATION */}
      {activeTab === 'BULK' && (
        <div className="temple-card p-4 gold-glow">
          <h6 className="fw-bold text-maroon mb-2 d-flex align-items-center gap-2">
            <FileSpreadsheet className="text-primary" size={20} /> Bulk CSV Devotee Registration
          </h6>
          <p className="text-muted small mb-3">
            Upload CSV containing columns: <code>name, age, gender, mobile, group_size, darshan_type</code>
          </p>

          <div className="mb-4">
            <input type="file" accept=".csv" className="form-control" onChange={handleCSVUpload} />
          </div>

          {bulkError && <div className="alert alert-danger py-2">{bulkError}</div>}

          {parsedRows.length > 0 && (
            <div>
              <h6 className="fw-bold text-maroon mb-2">CSV Preview ({parsedRows.length} devotees detected)</h6>
              <div className="table-responsive mb-3" style={{ maxHeight: '250px' }}>
                <table className="table table-sm table-hover align-middle">
                  <thead>
                    <tr className="text-maroon small">
                      <th>NAME</th>
                      <th>AGE</th>
                      <th>MOBILE</th>
                      <th>GROUP SIZE</th>
                      <th>DARSHAN TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td className="fw-bold text-dark-brown">{r.name}</td>
                        <td>{r.age}</td>
                        <td>{r.phone}</td>
                        <td>{r.group_size}</td>
                        <td><span className="badge bg-maroon text-gold">{r.category}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button 
                onClick={handleBulkSubmit} 
                disabled={submittingBulk}
                className="btn btn-maroon text-gold fw-bold d-flex align-items-center gap-2"
              >
                {submittingBulk ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <Upload size={18} /> Confirm & Bulk Register {parsedRows.length} Devotees
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevoteeRegistration;
