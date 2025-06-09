import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Smartphone, AlertCircle, Monitor } from 'lucide-react';
import SmartReactNativePreview from './SmartReactNativePreview';

const SnackPreview = ({ previewUrl, webPreviewUrl, setWebPreviewRef, isLoading, error, code }) => {
  const [previewMode, setPreviewMode] = useState('web'); // Default to web for cleaner experience
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const iframeRef = useRef(null);

  // Handle iframe load events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeLoading(false);
      setIframeError(null);
      if (setWebPreviewRef) {
        setWebPreviewRef(iframe);
      }
    };

    const handleError = () => {
      setIframeLoading(false);
      setIframeError('Failed to load preview');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [setWebPreviewRef]);

  // Reset loading state when webPreviewUrl changes
  useEffect(() => {
    if (webPreviewUrl) {
      setIframeLoading(true);
      setIframeError(null);
    }
  }, [webPreviewUrl]);

  if (isLoading) {
    return (
      <div className="preview-container loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={40} />
          <h3>Loading Preview</h3>
          <p>Preparing your React Native app...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-container error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={40} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Clean web preview without clutter
  const renderWebPreview = () => {
    return (
      <div className="web-preview-container">
        <SmartReactNativePreview code={code} />
      </div>
    );
  };

  // Simplified mobile preview
  const renderMobilePreview = () => {
    return (
      <div className="mobile-preview-container">
        <div className="phone-frame">
          <div className="phone-screen">
            <SmartReactNativePreview code={code} />
          </div>
          <div className="phone-home-indicator"></div>
        </div>

        {previewUrl && (
          <div className="mobile-options">
            <div className="qr-section">
              <h4>📱 Test on Device</h4>
              <p>Scan with Expo Go to test on your phone</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="preview-title">
          {previewMode === 'web' ? <Monitor size={18} /> : <Smartphone size={18} />}
          <span>Preview</span>
        </div>
        <div className="preview-controls">
          <div className="preview-mode-toggle">
            <button
              className={`mode-button ${previewMode === 'web' ? 'active' : ''}`}
              onClick={() => setPreviewMode('web')}
            >
              <Monitor size={14} />
              Web
            </button>
            <button
              className={`mode-button ${previewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone size={14} />
              Mobile
            </button>
          </div>
        </div>
      </div>
      {previewMode === 'web' ? renderWebPreview() : renderMobilePreview()}
    </div>
  );
};

export default SnackPreview;
