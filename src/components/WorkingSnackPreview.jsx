import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

const WorkingSnackPreview = ({ code }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackUrl, setSnackUrl] = useState(null);
  const iframeRef = useRef(null);

  // Create a working Snack URL that actually runs the code
  const createWorkingSnack = async (sourceCode) => {
    try {
      setIsLoading(true);
      setError(null);

      // Method 1: Try to create a new Snack via POST request
      const response = await fetch('https://snack.expo.dev/--/api/v2/snack/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manifest: {
            name: 'React Native Web Editor',
            description: 'Created with Expo Snack Web Editor',
            sdkVersion: '49.0.0',
            platforms: ['ios', 'android', 'web'],
          },
          code: {
            'App.js': sourceCode,
          },
          dependencies: {},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const embedUrl = `https://snack.expo.dev/embedded/${result.id}?preview=true&platform=web&theme=light`;
        setSnackUrl(embedUrl);
        setIsLoading(false);
        return embedUrl;
      } else {
        throw new Error('Failed to create Snack via API');
      }
    } catch (err) {
      console.log('API method failed, trying alternative approach:', err.message);

      // Method 2: Use URL encoding approach
      try {
        const encodedCode = encodeURIComponent(sourceCode);
        const urlWithCode = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&code=${encodedCode}&name=${encodeURIComponent('React Native Web Editor')}&sdkVersion=49.0.0`;

        setSnackUrl(urlWithCode);
        setIsLoading(false);
        return urlWithCode;
      } catch (urlError) {
        console.error('URL encoding method failed:', urlError);

        // Method 3: Use a working demo Snack with explanation
        const demoUrl = 'https://snack.expo.dev/embedded/@snack/hello-world?preview=true&platform=web&theme=light';
        setSnackUrl(demoUrl);
        setIsLoading(false);
        return demoUrl;
      }
    }
  };

  // Initialize the Snack when component mounts
  useEffect(() => {
    createWorkingSnack(code);
  }, []);

  // Update the Snack when code changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (code) {
        createWorkingSnack(code);
      }
    }, 3000); // 3 second debounce to avoid too many requests

    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleIframeLoad = () => {
    console.log('Snack preview loaded successfully');
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    console.error('Snack preview failed to load');
    setIsLoading(false);
    setError('Failed to load preview');
  };

  const handleRetry = () => {
    setError(null);
    createWorkingSnack(code);
  };

  if (error) {
    return (
      <div className="working-snack-preview error">
        <div className="error-content">
          <AlertCircle className="error-icon" size={48} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            <RefreshCw size={16} />
            Retry
          </button>
          <div className="fallback-info">
            <p className="small-text">
              <strong>Note:</strong> This is a demo implementation. In a production app, 
              you would need to implement proper Expo Snack API integration with authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !snackUrl) {
    return (
      <div className="working-snack-preview loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={48} />
          <h3>Creating Snack Preview...</h3>
          <p>Setting up your React Native app preview</p>
          <div className="loading-steps">
            <div className="step">✓ Parsing React Native code</div>
            <div className="step">⏳ Creating Snack instance</div>
            <div className="step">⏳ Loading preview environment</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="working-snack-preview">
      <div className="preview-header">
        <div className="preview-info">
          <span className="status-dot online"></span>
          <span>Live Preview Active</span>
        </div>
        <div className="preview-actions">
          <a
            href={snackUrl.replace('/embedded', '')}
            target="_blank"
            rel="noopener noreferrer"
            className="open-snack-link"
          >
            <ExternalLink size={14} />
            Open in Snack
          </a>
        </div>
      </div>

      <div className="iframe-container">
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
      </div>

      <div className="code-indicator">
        <div className="code-preview">
          <strong>Your Code:</strong> {code.substring(0, 100)}
          {code.length > 100 && '...'}
        </div>
        <div className="status-notice">
          <strong>Status:</strong> {snackUrl.includes('hello-world') ? 'Demo Mode - Showing sample Snack' : 'Live Mode - Your custom code'}
        </div>
      </div>
    </div>
  );
};

export default WorkingSnackPreview;
