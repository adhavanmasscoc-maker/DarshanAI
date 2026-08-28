import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DARSHANAI ERROR BOUNDARY]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          <div className="temple-card p-4 text-center gold-glow" style={{ maxWidth: '500px' }}>
            <div className="p-3 bg-ivory rounded-circle d-inline-flex mb-3 text-maroon border border-beige">
              <AlertTriangle size={36} />
            </div>
            <h5 className="fw-bold text-maroon mb-2">Component Temporary Load Issue</h5>
            <p className="text-muted small mb-4">
              An unexpected display error occurred while rendering this view. Your session data and database records remain safe.
            </p>
            <button 
              onClick={this.handleRetry} 
              className="btn btn-maroon text-gold fw-bold d-inline-flex align-items-center gap-2 px-4 py-2"
            >
              <RefreshCw size={16} /> Reload view
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
