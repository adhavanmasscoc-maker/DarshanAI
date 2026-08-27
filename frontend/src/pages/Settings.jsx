import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('INFO');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-maroon m-0 d-flex align-items-center gap-2">
            <SettingsIcon size={24} /> TEMPLE SETTINGS
          </h4>
          <small className="text-muted">Configure temple profile, operational parameters, and alert thresholds</small>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success py-2 mb-3">
          Temple settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button onClick={() => setActiveTab('INFO')} className={`btn btn-sm ${activeTab === 'INFO' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Temple Information</button>
        <button onClick={() => setActiveTab('OPS')} className={`btn btn-sm ${activeTab === 'OPS' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Temple Operations</button>
        <button onClick={() => setActiveTab('THRESHOLDS')} className={`btn btn-sm ${activeTab === 'THRESHOLDS' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Crowd Thresholds</button>
        <button onClick={() => setActiveTab('DARSHAN')} className={`btn btn-sm ${activeTab === 'DARSHAN' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Darshan Configuration</button>
        <button onClick={() => setActiveTab('NOTIF')} className={`btn btn-sm ${activeTab === 'NOTIF' ? 'btn-maroon text-gold fw-bold' : 'btn-outline-secondary'}`}>Notification Settings</button>
      </div>

      <div className="temple-card p-4 gold-glow" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSave}>
          {activeTab === 'INFO' && (
            <div>
              <h6 className="fw-bold text-maroon mb-3">Temple Information</h6>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">TEMPLE NAME</label>
                <input type="text" className="form-control" defaultValue="Sri Somnath Jyotirlinga Temple" />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">CITY</label>
                  <input type="text" className="form-control" defaultValue="Somnath" />
                </div>
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">STATE</label>
                  <input type="text" className="form-control" defaultValue="Gujarat" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OPS' && (
            <div>
              <h6 className="fw-bold text-maroon mb-3">Temple Operations</h6>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">OPENING TIME</label>
                  <input type="text" className="form-control" defaultValue="04:00 AM" />
                </div>
                <div className="col-6">
                  <label className="form-label text-dark-brown small fw-bold">CLOSING TIME</label>
                  <input type="text" className="form-control" defaultValue="10:00 PM" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">DEFAULT ACTIVE GATES</label>
                <input type="number" className="form-control" defaultValue={5} />
              </div>
            </div>
          )}

          {activeTab === 'THRESHOLDS' && (
            <div>
              <h6 className="fw-bold text-maroon mb-3">Crowd Thresholds</h6>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">MAX PREMISES CAPACITY</label>
                <input type="number" className="form-control" defaultValue={18000} />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">CRITICAL RISK QUEUE LENGTH</label>
                <input type="number" className="form-control" defaultValue={2500} />
              </div>
            </div>
          )}

          {activeTab === 'DARSHAN' && (
            <div>
              <h6 className="fw-bold text-maroon mb-3">Darshan Configuration</h6>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">AVERAGE SANCTUM TIME PER BATCH</label>
                <input type="number" className="form-control" defaultValue={4} />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark-brown small fw-bold">EXPRESS QUEUE STATUS</label>
                <select className="form-select">
                  <option>ENABLED</option>
                  <option>DISABLED</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'NOTIF' && (
            <div>
              <h6 className="fw-bold text-maroon mb-3">Notification Settings</h6>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="smsAlert" defaultChecked />
                <label className="form-check-label text-dark-brown fw-semibold" htmlFor="smsAlert">SMS Alerts for Security Lead</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="aiPush" defaultChecked />
                <label className="form-check-label text-dark-brown fw-semibold" htmlFor="aiPush">AI Anomaly Push Notifications</label>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-maroon text-gold fw-bold d-flex align-items-center gap-2 mt-4">
            <Save size={18} /> SAVE SETTINGS
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
