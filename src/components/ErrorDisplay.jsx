import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorDisplay = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div className="error-content">
        <AlertTriangle className="error-icon" size={20} />
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        {onDismiss && (
          <button 
            className="error-dismiss"
            onClick={onDismiss}
            title="Dismiss error"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
