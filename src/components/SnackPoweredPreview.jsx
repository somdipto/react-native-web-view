import React, { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, ExternalLink, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useSnack } from '../hooks/useSnack';

const SnackPoweredPreview = ({ code, onCodeChange }) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const [lastValidUrl, setLastValidUrl] = useState(null);
  const iframeRef = useRef(null);

  // Use the pure Snack SDK hook - no manual component conversion
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

  // Update code when it changes with debouncing
  useEffect(() => {
    if (snack && code) {
      const timeoutId = setTimeout(() => {
        console.log('Updating Snack code...');
        updateCode(code);
      }, 1500); // Longer debounce for stability

      return () => clearTimeout(timeoutId);
    }
  }, [code, snack, updateCode]);

  // Track valid URLs for fallback
  useEffect(() => {
    if (webPreviewUrl && !webPreviewUrl.includes('undefined') && !webPreviewUrl.includes('null')) {
      setLastValidUrl(webPreviewUrl);
    }
  }, [webPreviewUrl]);

  // Handle iframe events with better error detection
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('Snack iframe loaded successfully');
      setIframeLoading(false);
      setIframeError(null);
      setWebPreviewRef(iframe);

      // Check if the iframe content is actually valid
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc && iframeDoc.body) {
            const bodyText = iframeDoc.body.innerText || '';
            if (bodyText.includes("couldn't find the Snack") || bodyText.includes("Snack not found")) {
              console.error('Snack not found error detected in iframe');
              setIframeError('Snack not found - the preview URL may be invalid');
            }
          }
        } catch (e) {
          // Cross-origin restrictions prevent access, which is normal
          console.log('Cannot access iframe content (cross-origin)');
        }
      }, 2000);
    };

    const handleError = () => {
      console.error('Snack iframe failed to load');
      setIframeLoading(false);
      setIframeError('Failed to load Snack preview iframe');
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
    if (webPreviewUrl && webPreviewUrl !== lastValidUrl) {
      console.log('Web preview URL changed:', webPreviewUrl);
      setIframeLoading(true);
      setIframeError(null);
    }
  }, [webPreviewUrl, lastValidUrl]);

  // Retry function for failed Snack initialization
  const retrySnackInitialization = () => {
    console.log('Retrying Snack initialization...');
    window.location.reload();
  };

  // Show loading state
  if (snackLoading) {
    return (
      <div className="preview-content-clean loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={32} />
          <h3>Initializing Snack SDK</h3>
          <p>Setting up React Native preview with Expo Snack...</p>
          <div className="loading-steps">
            <div className="step">🔧 Creating Snack instance</div>
            <div className="step">📦 Analyzing dependencies</div>
            <div className="step">🚀 Starting preview server</div>
            <div className="step">🌐 Generating web preview URL</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with better messaging
  if (snackError) {
    return (
      <div className="preview-content-clean error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={32} />
          <h3>Snack SDK Error</h3>
          <p>{snackError}</p>
          <div className="error-actions">
            <button
              className="retry-button"
              onClick={retrySnackInitialization}
            >
              <RefreshCw size={16} />
              Retry Snack SDK
            </button>
            {lastValidUrl && (
              <a
                href={lastValidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retry-button secondary"
              >
                <ExternalLink size={16} />
                Open Last Valid Preview
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show iframe error with recovery options
  if (iframeError) {
    return (
      <div className="preview-content-clean error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={32} />
          <h3>Preview Load Error</h3>
          <p>{iframeError}</p>
          <div className="error-actions">
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
            <button
              className="retry-button secondary"
              onClick={() => {
                setIframeError(null);
                setIframeLoading(true);
              }}
            >
              <RefreshCw size={16} />
              Retry Preview
            </button>
          </div>
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
          <h3>Generating Preview URL</h3>
          <p>Waiting for Snack SDK to create preview...</p>
        </div>
      </div>
    );
  }

  // Main preview with pure Snack SDK iframe - no manual component conversion
  return (
    <div className="snack-powered-preview">
      {/* Clean status bar */}
      <div className="snack-status-bar">
        <div className="status-info">
          <div className="connection-status">
            {isOnline ? (
              <><Wifi size={12} /> Snack SDK Connected</>
            ) : (
              <><WifiOff size={12} /> Connecting to Snack</>
            )}
          </div>
          {connectedClients > 0 && (
            <div className="clients-info">
              {connectedClients} device{connectedClients !== 1 ? 's' : ''} connected
            </div>
          )}
          {isSaved && (
            <div className="save-status">
              ✓ Saved
            </div>
          )}
        </div>
        <div className="status-actions">
          {webPreviewUrl && (
            <a
              href={webPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-external"
              title="Open in new tab"
            >
              <ExternalLink size={12} />
            </a>
          )}
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-external"
              title="Open Snack"
            >
              📱
            </a>
          )}
        </div>
      </div>

      {/* Pure Snack SDK iframe container */}
      <div className="snack-iframe-container">
        {iframeLoading && (
          <div className="iframe-loading-overlay">
            <Loader2 className="loading-spinner" size={24} />
            <span>Loading Snack SDK preview...</span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={webPreviewUrl}
          className="snack-iframe"
          title="Expo Snack SDK Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="geolocation; camera; microphone; clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default SnackPoweredPreview;
