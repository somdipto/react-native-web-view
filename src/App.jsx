import React, { useState, useCallback, Suspense } from 'react';
import Split from 'react-split';
import { Code, Smartphone, Upload, Save, Share2, Loader2 } from 'lucide-react';

import CodeEditor from './components/CodeEditor';
import SnackPreview from './components/SnackPreview';
import SnackPoweredPreview from './components/SnackPoweredPreview';
import FileUpload from './components/FileUpload';
import ErrorDisplay from './components/ErrorDisplay';
import DebugPanel from './components/DebugPanel';
import { defaultCode } from './utils/defaultCode';
import { useSnack } from './hooks/useSnack';

// Loading component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <Loader2 className="loading-spinner" size={48} />
    <h2>Loading React Native Web View...</h2>
    <p>Setting up the development environment</p>
  </div>
);

function App() {
  const [code, setCode] = useState(defaultCode);
  const [showUpload, setShowUpload] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [appError, setAppError] = useState(null);
  const [useSnackSDK, setUseSnackSDK] = useState(true); // Toggle between Snack SDK and manual conversion

  // Use the enhanced Snack SDK hook
  const {
    snack,
    isLoading: isSnackLoading,
    error: snackError,
    previewUrl,
    webPreviewUrl,
    isOnline,
    connectedClients,
    setWebPreviewRef,
  } = useSnack(code);

  // Enhanced code update with Snack SDK integration
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    // Code updates are automatically handled by the useSnack hook
  }, []);

  const handleFileUpload = useCallback((fileName, content) => {
    // Update the main code if it's an App file
    if (fileName.toLowerCase().includes('app.')) {
      setCode(content);
    }
  }, []);

  const handleSave = () => {
    // Simple save - copy code to clipboard
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy code');
    });
  };

  const handleShare = () => {
    // Share the current URL
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('App URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL');
    });
  };

  const toggleTheme = () => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  // Handle app-level errors
  if (appError) {
    return (
      <div className="app-error">
        <div className="app-error-content">
          <h1>Application Error</h1>
          <p>{appError}</p>
          <button onClick={() => setAppError(null)}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <div className="logo">
              <Code size={24} />
              <h1>React Native Web View</h1>
            </div>
          </div>
        
        <div className="header-actions">
          <button 
            className="action-button"
            onClick={() => setShowUpload(!showUpload)}
            title="Upload files"
          >
            <Upload size={18} />
            Upload
          </button>
          
          <button
            className="action-button"
            onClick={handleSave}
            title="Copy Code"
          >
            <Save size={18} />
            Copy Code
          </button>

          <button
            className="action-button"
            onClick={handleShare}
            title="Share App"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            className={`action-button ${useSnackSDK ? 'active' : ''}`}
            onClick={() => setUseSnackSDK(!useSnackSDK)}
            title={`Switch to ${useSnackSDK ? 'Manual' : 'Snack SDK'} Preview`}
          >
            {useSnackSDK ? '🚀' : '⚙️'}
            {useSnackSDK ? 'Snack SDK' : 'Manual'}
          </button>

          <button
            className="action-button theme-toggle"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {editorTheme === 'vs-dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <ErrorDisplay error={snackError} />

      {showUpload && (
        <div className="upload-panel">
          <FileUpload
            onFileUpload={handleFileUpload}
            onCodeChange={setCode}
          />
        </div>
      )}

      <main className="app-main">
        <Split
          className="split-container"
          sizes={[50, 50]}
          minSize={300}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
        >
          <div className="editor-panel">
            <div className="panel-header">
              <Code size={16} />
              <span>Code Editor</span>
              <div className="panel-info">
                <span className="file-name">App.js</span>
              </div>
            </div>
            <div className="editor-container">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language="javascript"
                theme={editorTheme}
              />
            </div>
          </div>

          <div className="preview-panel">
            <div className="panel-header">
              <Smartphone size={16} />
              <span>Live Preview</span>
              <div className="panel-info">
                <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>●</span>
                <span>{isOnline ? 'Connected' : 'Connecting...'}</span>
                {connectedClients > 0 && (
                  <span className="clients-count">({connectedClients} devices)</span>
                )}
              </div>
            </div>
            <div className="preview-container">
              {useSnackSDK ? (
                <SnackPoweredPreview
                  code={code}
                  onCodeChange={handleCodeChange}
                />
              ) : (
                <SnackPreview
                  previewUrl={previewUrl}
                  webPreviewUrl={webPreviewUrl}
                  setWebPreviewRef={setWebPreviewRef}
                  isLoading={isSnackLoading}
                  error={snackError}
                  code={code}
                />
              )}
            </div>
          </div>
        </Split>
      </main>

      <DebugPanel
        snack={snack}
        previewUrl={previewUrl}
        webPreviewUrl={webPreviewUrl}
        error={snackError}
        isLoading={isSnackLoading}
        isOnline={isOnline}
        connectedClients={connectedClients}
      />
    </div>
    </Suspense>
  );
}

export default App;
