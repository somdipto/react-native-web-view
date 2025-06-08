import React, { useState, useCallback } from 'react';
import Split from 'react-split';
import { Code, Smartphone, Upload, Save, Share2 } from 'lucide-react';

import CodeEditor from './components/CodeEditor';
import SnackPreview from './components/SnackPreview';
import FileUpload from './components/FileUpload';
import ErrorDisplay from './components/ErrorDisplay';
import DebugPanel from './components/DebugPanel';
import { useSnack } from './hooks/useSnack';
import { defaultCode } from './utils/defaultCode';

function App() {
  const [code, setCode] = useState(defaultCode);
  const [showUpload, setShowUpload] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  
  const {
    snack,
    isLoading,
    error,
    previewUrl,
    webPreviewUrl,
    setWebPreviewRef,
    updateCode,
    uploadFile,
    saveSnack
  } = useSnack(defaultCode);

  // Debounced code update to avoid too many API calls
  const [updateTimeout, setUpdateTimeout] = useState(null);
  
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    
    // Clear existing timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    
    // Set new timeout to update Snack after user stops typing
    const timeout = setTimeout(() => {
      updateCode(newCode);
    }, 1000); // 1 second delay
    
    setUpdateTimeout(timeout);
  }, [updateCode, updateTimeout]);

  const handleFileUpload = useCallback((fileName, content) => {
    uploadFile(fileName, content);
  }, [uploadFile]);

  const handleSave = async () => {
    const result = await saveSnack();
    if (result) {
      alert('Snack saved successfully!');
    }
  };

  const handleShare = () => {
    const urlToShare = webPreviewUrl || previewUrl;
    if (urlToShare) {
      navigator.clipboard.writeText(urlToShare).then(() => {
        alert('Snack URL copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy URL. URL: ' + urlToShare);
      });
    }
  };

  const toggleTheme = () => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark');
  };

  return (
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
            disabled={!snack}
            title="Save Snack"
          >
            <Save size={18} />
            Save
          </button>
          
          <button
            className="action-button"
            onClick={handleShare}
            disabled={!previewUrl && !webPreviewUrl}
            title="Share Snack"
          >
            <Share2 size={18} />
            Share
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

      <ErrorDisplay error={error} />

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
              {(previewUrl || webPreviewUrl) && (
                <div className="panel-info">
                  <span className="status-indicator online">●</span>
                  <span>Connected</span>
                </div>
              )}
            </div>
            <div className="preview-container">
              <SnackPreview
                previewUrl={previewUrl}
                webPreviewUrl={webPreviewUrl}
                setWebPreviewRef={setWebPreviewRef}
                isLoading={isLoading}
                error={error}
                code={code}
              />
            </div>
          </div>
        </Split>
      </main>

      <DebugPanel
        snack={snack}
        previewUrl={previewUrl}
        webPreviewUrl={webPreviewUrl}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
