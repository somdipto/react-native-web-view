import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';

const DebugPanel = ({ snack, previewUrl, webPreviewUrl, error, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="debug-panel collapsed">
        <button 
          className="debug-toggle"
          onClick={() => setIsExpanded(true)}
        >
          <Bug size={16} />
          Debug Info
          <ChevronDown size={16} />
        </button>
      </div>
    );
  }

  const snackState = snack ? snack.getState() : null;

  return (
    <div className="debug-panel expanded">
      <div className="debug-header">
        <button 
          className="debug-toggle"
          onClick={() => setIsExpanded(false)}
        >
          <Bug size={16} />
          Debug Info
          <ChevronUp size={16} />
        </button>
      </div>
      
      <div className="debug-content">
        <div className="debug-section">
          <h4>Hook State</h4>
          <pre>{JSON.stringify({
            isLoading,
            error,
            previewUrl,
            webPreviewUrl,
            hasSnack: !!snack
          }, null, 2)}</pre>
        </div>

        {snackState && (
          <div className="debug-section">
            <h4>Snack State</h4>
            <pre>{JSON.stringify({
              url: snackState.url,
              webPreviewURL: snackState.webPreviewURL,
              online: snackState.online,
              isSaved: snackState.isSaved,
              isResolving: snackState.isResolving,
              sdkVersion: snackState.sdkVersion,
              connectedClients: Object.keys(snackState.connectedClients || {}).length,
              dependencies: Object.keys(snackState.dependencies || {}),
              files: Object.keys(snackState.files || {})
            }, null, 2)}</pre>
          </div>
        )}

        <div className="debug-section">
          <h4>Actions</h4>
          <div className="debug-actions">
            <button 
              onClick={() => {
                if (snack) {
                  console.log('Full Snack State:', snack.getState());
                }
              }}
              className="debug-button"
            >
              Log Full State
            </button>
            <button 
              onClick={() => {
                if (snack) {
                  snack.setOnline(!snackState?.online);
                }
              }}
              className="debug-button"
              disabled={!snack}
            >
              Toggle Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
