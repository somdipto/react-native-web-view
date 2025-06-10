import React from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';

// Fallback component - should NOT do manual component conversion
// This is only shown when Snack SDK is not available
const SmartReactNativePreview = ({ code }) => {

  // This component should NOT do manual React Native component conversion
  // It's only a fallback when Snack SDK is unavailable
  return (
    <div className="preview-content-clean error">
      <div className="error-content">
        <AlertTriangle className="error-icon" size={32} />
        <h3>Snack SDK Required</h3>
        <p>
          This preview requires the Snack SDK for proper React Native component rendering.
          Manual component conversion has been removed to ensure 80-90% compatibility.
        </p>
        <div className="error-actions">
          <a
            href="https://snack.expo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="retry-button"
          >
            <ExternalLink size={16} />
            Open in Expo Snack
          </a>
          <button
            className="retry-button secondary"
            onClick={() => window.location.reload()}
          >
            Retry Snack SDK
          </button>
        </div>
        <div className="code-preview">
          <h4>Your Code:</h4>
          <pre className="code-snippet">
            {code.substring(0, 200)}
            {code.length > 200 ? '...' : ''}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SmartReactNativePreview;
