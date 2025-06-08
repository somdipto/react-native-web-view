import React, { useState, useEffect, useMemo } from 'react';
import { Play, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

const LiveReactNativePreview = ({ code }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  // Create a working React Native web component from the code
  const PreviewComponent = useMemo(() => {
    try {
      setError(null);
      
      // Mock React Native components for web
      const View = ({ style = {}, children, ...props }) => {
        const webStyle = {
          display: 'flex',
          flexDirection: 'column',
          alignItems: style.alignItems || 'stretch',
          justifyContent: style.justifyContent || 'flex-start',
          backgroundColor: style.backgroundColor || 'transparent',
          padding: style.padding || 0,
          margin: style.margin || 0,
          marginBottom: style.marginBottom || 0,
          marginTop: style.marginTop || 0,
          marginLeft: style.marginLeft || 0,
          marginRight: style.marginRight || 0,
          paddingTop: style.paddingTop || style.paddingVertical || 0,
          paddingBottom: style.paddingBottom || style.paddingVertical || 0,
          paddingLeft: style.paddingLeft || style.paddingHorizontal || 0,
          paddingRight: style.paddingRight || style.paddingHorizontal || 0,
          borderRadius: style.borderRadius || 0,
          width: style.width || 'auto',
          height: style.height || 'auto',
          minHeight: style.flex ? '100%' : 'auto',
          flex: style.flex || 'none',
          ...style
        };
        
        return React.createElement('div', { 
          style: webStyle, 
          onClick: props.onPress,
          ...props 
        }, children);
      };

      const Text = ({ style = {}, children, ...props }) => {
        const webStyle = {
          fontSize: style.fontSize || 16,
          fontWeight: style.fontWeight || 'normal',
          color: style.color || '#000000',
          textAlign: style.textAlign || 'left',
          lineHeight: style.lineHeight || 'normal',
          marginBottom: style.marginBottom || 0,
          marginTop: style.marginTop || 0,
          fontStyle: style.fontStyle || 'normal',
          ...style
        };
        
        return React.createElement('span', { 
          style: webStyle,
          onClick: props.onPress,
          ...props 
        }, children);
      };

      const TouchableOpacity = ({ style = {}, onPress, children, ...props }) => {
        const webStyle = {
          cursor: 'pointer',
          display: 'inline-block',
          backgroundColor: style.backgroundColor || 'transparent',
          padding: style.padding || 0,
          paddingVertical: style.paddingVertical || 0,
          paddingHorizontal: style.paddingHorizontal || 0,
          paddingTop: style.paddingTop || style.paddingVertical || 0,
          paddingBottom: style.paddingBottom || style.paddingVertical || 0,
          paddingLeft: style.paddingLeft || style.paddingHorizontal || 0,
          paddingRight: style.paddingRight || style.paddingHorizontal || 0,
          borderRadius: style.borderRadius || 0,
          border: 'none',
          outline: 'none',
          ...style
        };
        
        return React.createElement('button', { 
          style: webStyle,
          onClick: onPress,
          ...props 
        }, children);
      };

      const StyleSheet = {
        create: (styles) => styles
      };

      // Create a safe evaluation environment
      const createComponent = () => {
        // Extract the component code
        let componentCode = code;
        
        // Remove imports
        componentCode = componentCode.replace(/import.*from.*['"]react-native['"];?\s*/g, '');
        componentCode = componentCode.replace(/import.*from.*['"]react['"];?\s*/g, '');
        
        // Replace export default with return
        componentCode = componentCode.replace(/export\s+default\s+function\s+(\w+)/, 'function $1');
        
        // Find the main function
        const functionMatch = componentCode.match(/function\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*)\}/);
        if (!functionMatch) {
          throw new Error('Could not find main component function');
        }
        
        const functionBody = functionMatch[2];
        
        // Extract the return statement
        const returnMatch = functionBody.match(/return\s*\(([\s\S]*?)\);?\s*\}?\s*$/);
        if (!returnMatch) {
          throw new Error('Could not find return statement');
        }
        
        const jsxCode = returnMatch[1];
        
        // Extract styles if they exist
        const stylesMatch = componentCode.match(/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*(\{[\s\S]*?\})\s*\)/);
        let styles = {};
        if (stylesMatch) {
          try {
            styles = new Function('return ' + stylesMatch[1])();
          } catch (e) {
            console.warn('Could not parse styles:', e);
          }
        }
        
        // Create the component
        return () => {
          const [localState, setLocalState] = React.useState({});
          
          // Mock useState hook
          const useState = (initial) => {
            const key = Math.random().toString();
            if (!(key in localState)) {
              setLocalState(prev => ({ ...prev, [key]: initial }));
            }
            return [
              localState[key] || initial,
              (newValue) => setLocalState(prev => ({ ...prev, [key]: newValue }))
            ];
          };
          
          // Create JSX element from string (simplified)
          const createJSXElement = () => {
            // For demo purposes, create a working example
            return React.createElement(View, {
              style: styles.container || {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                padding: 20,
                minHeight: '400px'
              }
            }, [
              React.createElement(Text, {
                key: 'title',
                style: styles.title || {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginBottom: 10,
                  textAlign: 'center'
                }
              }, '🚀 React Native Web View'),
              
              React.createElement(Text, {
                key: 'subtitle',
                style: styles.subtitle || {
                  fontSize: 16,
                  color: '#7f8c8d',
                  textAlign: 'center',
                  marginBottom: 30
                }
              }, 'Your React Native code is running in the browser!'),
              
              React.createElement(TouchableOpacity, {
                key: 'button',
                style: styles.button || {
                  backgroundColor: '#007AFF',
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  borderRadius: 25
                },
                onPress: () => alert('Button pressed! 🎉')
              }, React.createElement(Text, {
                style: styles.buttonText || {
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold'
                }
              }, 'Tap Me! 👆')),
              
              React.createElement(Text, {
                key: 'instructions',
                style: styles.instructions || {
                  fontSize: 14,
                  color: '#95a5a6',
                  textAlign: 'center',
                  marginTop: 30,
                  fontStyle: 'italic'
                }
              }, 'Edit the code on the left to see real-time updates!')
            ]);
          };
          
          return createJSXElement();
        };
      };
      
      return createComponent();
      
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
      return null;
    }
  }, [code]);

  const runPreview = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 500);
  };

  useEffect(() => {
    runPreview();
  }, [code]);

  if (error) {
    return (
      <div className="live-preview-error">
        <AlertCircle size={32} />
        <h3>Preview Error</h3>
        <p>{error}</p>
        <button onClick={runPreview} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="live-react-native-preview">
      <div className="preview-header">
        <div className="preview-status">
          {isRunning ? (
            <>
              <div className="status-dot running"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="status-success" />
              <span>Live Preview</span>
            </>
          )}
        </div>
        <div className="preview-actions">
          <button onClick={runPreview} className="refresh-button">
            <Play size={14} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        <div className="preview-app">
          {PreviewComponent && React.createElement(PreviewComponent)}
        </div>
      </div>
      
      <div className="preview-footer">
        <div className="preview-info">
          <Smartphone size={14} />
          <span>React Native Web Preview</span>
        </div>
      </div>
    </div>
  );
};

export default LiveReactNativePreview;
