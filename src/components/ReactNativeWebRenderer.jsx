import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw, Play } from 'lucide-react';

const ReactNativeWebRenderer = ({ code }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState(null);
  const iframeRef = useRef(null);

  // Create HTML that runs React Native code using React Native Web
  const createReactNativeWebHTML = (sourceCode) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Native Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f0f0f0;
            overflow: hidden;
        }
        #root {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .error-container {
            padding: 20px;
            background-color: #ffebee;
            color: #c62828;
            border-left: 4px solid #f44336;
            margin: 20px;
            border-radius: 4px;
        }
        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            color: #666;
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading-container">
            <div>Loading React Native App...</div>
        </div>
    </div>

    <script type="text/babel">
        // Mock React Native components for web
        const { useState, useEffect, createElement: h } = React;

        // Mock StyleSheet
        const StyleSheet = {
            create: (styles) => styles
        };

        // Mock View component
        const View = ({ style, children, ...props }) => {
            const webStyle = {
                display: 'flex',
                flexDirection: 'column',
                ...style
            };
            return h('div', { style: webStyle, ...props }, children);
        };

        // Mock Text component
        const Text = ({ style, children, ...props }) => {
            const webStyle = {
                fontSize: 16,
                color: '#000',
                ...style
            };
            return h('span', { style: webStyle, ...props }, children);
        };

        // Mock ScrollView component
        const ScrollView = ({ style, children, ...props }) => {
            const webStyle = {
                overflow: 'auto',
                ...style
            };
            return h('div', { style: webStyle, ...props }, children);
        };

        // Mock TouchableOpacity component
        const TouchableOpacity = ({ style, onPress, children, ...props }) => {
            const webStyle = {
                cursor: 'pointer',
                ...style
            };
            return h('div', { 
                style: webStyle, 
                onClick: onPress,
                ...props 
            }, children);
        };

        // Mock Button component
        const Button = ({ title, onPress, color = '#007AFF' }) => {
            const buttonStyle = {
                backgroundColor: color,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
            };
            return h('button', { 
                style: buttonStyle, 
                onClick: onPress 
            }, title);
        };

        // Mock TextInput component
        const TextInput = ({ style, value, onChangeText, placeholder, ...props }) => {
            const webStyle = {
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '16px',
                ...style
            };
            return h('input', { 
                style: webStyle,
                value: value,
                onChange: (e) => onChangeText && onChangeText(e.target.value),
                placeholder: placeholder,
                ...props 
            });
        };

        try {
            // User's code will be inserted here
            ${sourceCode}

            // Render the app
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(h(App));
        } catch (error) {
            console.error('Error rendering React Native app:', error);
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
                h('div', { className: 'error-container' }, [
                    h('h3', { key: 'title' }, 'Error in React Native Code'),
                    h('p', { key: 'message' }, error.message),
                    h('pre', { key: 'stack', style: { fontSize: '12px', overflow: 'auto' } }, error.stack)
                ])
            );
        }
    </script>
</body>
</html>`;
  };

  const runCode = () => {
    setIsLoading(true);
    setError(null);

    try {
      const html = createReactNativeWebHTML(code);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      runCode();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load preview');
    setIsLoading(false);
  };

  return (
    <div className="react-native-web-renderer">
      <div className="renderer-header">
        <div className="renderer-info">
          <span className="status-dot online"></span>
          <span>React Native Web Preview</span>
        </div>
        <div className="renderer-actions">
          <button 
            className="run-button"
            onClick={runCode}
            disabled={isLoading}
          >
            <Play size={14} />
            Run Code
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={runCode} className="retry-btn">
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <Loader2 className="loading-spinner" size={32} />
            <p>Running React Native code...</p>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className="preview-iframe"
          title="React Native Web Preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default ReactNativeWebRenderer;
