import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const ExpoSnackEmbed = ({ code }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // Use a working Expo Snack example URL for demonstration
  const snackUrl = 'https://snack.expo.dev/embedded/@snack/hello-world?preview=true&platform=web&theme=light';

  const handleIframeLoad = () => {
    console.log('Expo Snack embed loaded successfully');
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    console.error('Expo Snack embed failed to load');
    setIsLoading(false);
    setError('Failed to load Expo Snack preview');
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Force reload the iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="expo-snack-embed">
      {(isLoading || error) && (
        <div className="embed-overlay">
          {isLoading && (
            <div className="loading-content">
              <Loader2 className="loading-spinner" size={32} />
              <p>Loading Expo Snack preview...</p>
              <p className="small-text">This may take a few moments</p>
            </div>
          )}
          {error && (
            <div className="error-content">
              <AlertCircle className="error-icon" size={32} />
              <p>{error}</p>
              <button className="retry-button" onClick={handleRetry}>
                <RefreshCw size={16} />
                Retry
              </button>
              <p className="small-text">
                Note: This is a demo using a sample Snack.
                In a production app, this would show your custom code.
              </p>
            </div>
          )}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={snackUrl}
        className="snack-iframe"
        title="Expo Snack Preview"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
        allow="geolocation; camera; microphone; clipboard-read; clipboard-write"
      />

      <div className="code-info">
        <p className="small-text">
          <strong>Demo Mode:</strong> Showing sample Expo Snack.
          Your code: {code.substring(0, 50)}...
        </p>
      </div>
    </div>
  );
};

export default ExpoSnackEmbed;
