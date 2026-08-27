import React from 'react';

const Loading = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-maroon" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading DARSHANAI...</span>
      </div>
      <span className="mt-3 text-maroon fw-bold tracking-wider" style={{ fontSize: '0.9rem' }}>
        INITIALIZING DARSHANAI INTELLIGENCE ENGINE...
      </span>
    </div>
  );
};

export default Loading;
