import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Smartphone, AlertCircle, Monitor, QrCode, RefreshCw } from 'lucide-react';
import ProductionPreview from './ProductionPreview';
import QRCodeGenerator from './QRCodeGenerator';

const SnackPreview = ({ previewUrl, webPreviewUrl, setWebPreviewRef, isLoading, error, code }) => {
  const [previewMode, setPreviewMode] = useState('mobile'); // 'web' or 'mobile'
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const iframeRef = useRef(null);

  // Check if we're in production (Vercel) - skip Snack SDK dependencies
  const isProduction = typeof window !== 'undefined' &&
    (window.location.hostname.includes('vercel.app') ||
     window.location.hostname.includes('netlify.app') ||
     window.location.hostname !== 'localhost');

  // Handle iframe load events
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('Iframe loaded successfully');
      setIframeLoading(false);
      setIframeError(null);

      // Set the iframe reference for Snack SDK
      if (setWebPreviewRef) {
        setWebPreviewRef(iframe);
      }
    };

    const handleError = () => {
      console.error('Iframe failed to load');
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
          <Loader2 className="loading-spinner" size={48} />
          <h3>Initializing Expo Snack...</h3>
          <p>Setting up your React Native preview environment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-container error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={48} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Always show preview - don't wait for external URLs
  const renderWebPreview = () => {
    return (
      <div className="web-preview-container">
        <ProductionPreview code={code} />
      </div>
    );
  };

  const renderMobilePreview = () => {
    return (
      <div className="mobile-preview-container">
        <div className="phone-frame">
          <div className="phone-screen">
            <ProductionPreview code={code} />
          </div>
          <div className="phone-home-indicator"></div>
        </div>

        <div className="mobile-options">
          <div className="qr-section">
            <h4>Test on your device</h4>
            <div className="qr-code-container">
              {previewUrl ? (
                <QRCodeGenerator value={previewUrl} size={80} />
              ) : (
                <div className="qr-placeholder">
                  <QrCode size={80} />
                </div>
              )}
              <p className="small-text">Scan with Expo Go</p>
              {previewUrl && (
                <p className="preview-url small">{previewUrl}</p>
              )}
            </div>
            <p className="small-text">
              Install Expo Go app and scan the QR code to test on your phone
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="preview-title">
          {previewMode === 'web' ? <Monitor size={20} /> : <Smartphone size={20} />}
          <span>Live Preview</span>
        </div>
        <div className="preview-controls">
          <div className="preview-mode-toggle">
            <button
              className={`mode-button ${previewMode === 'web' ? 'active' : ''}`}
              onClick={() => setPreviewMode('web')}
            >
              <Monitor size={16} />
              Web
            </button>
            <button
              className={`mode-button ${previewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone size={16} />
              Mobile
            </button>
          </div>
          <div className="preview-actions">
            {previewMode === 'web' && webPreviewUrl && (
              <a
                href={webPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="open-link"
              >
                Open in New Tab
              </a>
            )}
            {previewMode === 'mobile' && previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="open-link"
              >
                Open URL
              </a>
            )}
          </div>
        </div>
      </div>
      {previewMode === 'web' ? renderWebPreview() : renderMobilePreview()}
    </div>
  );
};

export default SnackPreview;
