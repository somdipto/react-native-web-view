import React, { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { useSnack } from '../hooks/useSnack';

const SnackPoweredPreview = ({ code, onCodeChange }) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const iframeRef = useRef(null);

  // Use the enhanced Snack SDK hook
  const {
    snack,
    isLoading: snackLoading,
    error: snackError,
    previewUrl,
    webPreviewUrl,
    isOnline,
    isSaved,
    connectedClients,
    setWebPreviewRef,
    updateCode,
  } = useSnack(code);

  // Update code when it changes
  useEffect(() => {
    if (snack && code) {
      const timeoutId = setTimeout(() => {
        updateCode(code);
      }, 1000); // Debounce code updates

      return () => clearTimeout(timeoutId);
    }
  }, [code, snack, updateCode]);

  // Handle iframe events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('Snack iframe loaded successfully');
      setIframeLoading(false);
      setIframeError(null);
      setWebPreviewRef(iframe);
    };

    const handleError = () => {
      console.error('Snack iframe failed to load');
      setIframeLoading(false);
      setIframeError('Failed to load Snack preview');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [setWebPreviewRef]);

  // Reset iframe loading state when URL changes
  useEffect(() => {
    if (webPreviewUrl) {
      setIframeLoading(true);
      setIframeError(null);
    }
  }, [webPreviewUrl]);

  // Show loading state
  if (snackLoading) {
    return (
      <div className="preview-content-clean loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={32} />
          <h3>Initializing Snack SDK</h3>
          <p>Setting up comprehensive React Native preview...</p>
          <div className="loading-steps">
            <div className="step">🔧 Analyzing your code</div>
            <div className="step">📦 Detecting dependencies</div>
            <div className="step">🚀 Creating Snack instance</div>
            <div className="step">🌐 Generating web preview</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (snackError) {
    return (
      <div className="preview-content-clean error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={32} />
          <h3>Snack SDK Error</h3>
          <p>{snackError}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  // Show iframe error
  if (iframeError) {
    return (
      <div className="preview-content-clean error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={32} />
          <h3>Preview Error</h3>
          <p>{iframeError}</p>
          {webPreviewUrl && (
            <a 
              href={webPreviewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="retry-button"
            >
              <ExternalLink size={16} />
              Open in New Tab
            </a>
          )}
        </div>
      </div>
    );
  }

  // Show waiting state if no URL yet
  if (!webPreviewUrl) {
    return (
      <div className="preview-content-clean loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={28} />
          <h3>Generating Preview</h3>
          <p>Creating your React Native web preview...</p>
        </div>
      </div>
    );
  }

  // Main preview with Snack SDK iframe
  return (
    <div className="snack-powered-preview">
      {/* Optional status bar - can be hidden for cleaner look */}
      <div className="snack-status-bar">
        <div className="status-info">
          <div className="connection-status">
            {isOnline ? (
              <><Wifi size={12} /> Online</>
            ) : (
              <><WifiOff size={12} /> Offline</>
            )}
          </div>
          {connectedClients > 0 && (
            <div className="clients-info">
              {connectedClients} device{connectedClients !== 1 ? 's' : ''} connected
            </div>
          )}
        </div>
        {webPreviewUrl && (
          <a 
            href={webPreviewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="open-external"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Snack iframe container */}
      <div className="snack-iframe-container">
        {iframeLoading && (
          <div className="iframe-loading-overlay">
            <Loader2 className="loading-spinner" size={24} />
            <span>Loading Snack preview...</span>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={webPreviewUrl}
          className="snack-iframe"
          title="Expo Snack Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="geolocation; camera; microphone; clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default SnackPoweredPreview;
