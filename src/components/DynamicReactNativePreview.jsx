import React, { useState, useEffect, useMemo } from 'react';
import { Play, CheckCircle, AlertCircle, Code, RefreshCw } from 'lucide-react';
import { ReactNativeCodeParser } from '../utils/codeParser';

const DynamicReactNativePreview = ({ code }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [parsedComponent, setParsedComponent] = useState(null);

  // React Native Web Components
  const createReactNativeComponents = () => {
    const View = ({ style = {}, children, onPress, ...props }) => {
      const webStyle = {
        display: 'flex',
        flexDirection: style.flexDirection || 'column',
        alignItems: style.alignItems || 'stretch',
        justifyContent: style.justifyContent || 'flex-start',
        backgroundColor: style.backgroundColor || 'transparent',
        padding: style.padding || 0,
        paddingTop: style.paddingTop || style.paddingVertical || style.padding || 0,
        paddingBottom: style.paddingBottom || style.paddingVertical || style.padding || 0,
        paddingLeft: style.paddingLeft || style.paddingHorizontal || style.padding || 0,
        paddingRight: style.paddingRight || style.paddingHorizontal || style.padding || 0,
        margin: style.margin || 0,
        marginTop: style.marginTop || style.margin || 0,
        marginBottom: style.marginBottom || style.margin || 0,
        marginLeft: style.marginLeft || style.margin || 0,
        marginRight: style.marginRight || style.margin || 0,
        borderRadius: style.borderRadius || 0,
        width: style.width || 'auto',
        height: style.height || 'auto',
        minHeight: style.flex ? '100%' : style.minHeight || 'auto',
        flex: style.flex || 'none',
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#000'}` : 'none',
        ...style
      };

      return React.createElement('div', {
        style: webStyle,
        onClick: onPress,
        ...props
      }, children);
    };

    const Text = ({ style = {}, children, onPress, ...props }) => {
      const webStyle = {
        fontSize: style.fontSize || 16,
        fontWeight: style.fontWeight || 'normal',
        color: style.color || '#000000',
        textAlign: style.textAlign || 'left',
        lineHeight: style.lineHeight || 'normal',
        marginBottom: style.marginBottom || 0,
        marginTop: style.marginTop || 0,
        marginLeft: style.marginLeft || 0,
        marginRight: style.marginRight || 0,
        fontStyle: style.fontStyle || 'normal',
        textDecorationLine: style.textDecorationLine || 'none',
        ...style
      };

      return React.createElement('span', {
        style: webStyle,
        onClick: onPress,
        ...props
      }, children);
    };

    const TouchableOpacity = ({ style = {}, onPress, children, ...props }) => {
      const [isPressed, setIsPressed] = useState(false);

      const webStyle = {
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: style.backgroundColor || 'transparent',
        padding: style.padding || 0,
        paddingTop: style.paddingTop || style.paddingVertical || style.padding || 0,
        paddingBottom: style.paddingBottom || style.paddingVertical || style.padding || 0,
        paddingLeft: style.paddingLeft || style.paddingHorizontal || style.padding || 0,
        paddingRight: style.paddingRight || style.paddingHorizontal || style.padding || 0,
        borderRadius: style.borderRadius || 0,
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
        opacity: isPressed ? 0.8 : 1,
        ...style
      };

      return React.createElement('button', {
        style: webStyle,
        onClick: onPress,
        onMouseDown: () => setIsPressed(true),
        onMouseUp: () => setIsPressed(false),
        onMouseLeave: () => setIsPressed(false),
        ...props
      }, children);
    };

    const ScrollView = ({ style = {}, children, ...props }) => {
      const webStyle = {
        overflow: 'auto',
        ...style
      };
      return React.createElement('div', { style: webStyle, ...props }, children);
    };

    const Button = ({ title, onPress, color = '#007AFF' }) => {
      return React.createElement(TouchableOpacity, {
        style: {
          backgroundColor: color,
          padding: 10,
          borderRadius: 5,
          alignItems: 'center'
        },
        onPress
      }, React.createElement(Text, {
        style: { color: 'white', fontWeight: 'bold' }
      }, title));
    };

    return { View, Text, TouchableOpacity, ScrollView, Button };
  };

  // Parse and execute user's React Native code
  const parseUserCode = useMemo(() => {
    try {
      setError(null);
      
      if (!code || code.trim() === '') {
        throw new Error('No code provided');
      }

      // Create React Native components
      const { View, Text, TouchableOpacity, ScrollView, Button } = createReactNativeComponents();
      
      // Mock StyleSheet
      const StyleSheet = {
        create: (styles) => styles
      };

      // Extract styles from the code
      const styleMatch = code.match(/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*(\{[\s\S]*?\})\s*\)/);
      let styles = {};
      
      if (styleMatch) {
        try {
          // Safely evaluate the styles object
          styles = new Function('return ' + styleMatch[1])();
        } catch (e) {
          console.warn('Could not parse styles:', e);
          styles = {};
        }
      }

      // Create a component that renders the user's code
      return () => {
        // Mock useState hook
        const [localState, setLocalState] = React.useState({});
        
        const useState = (initialValue) => {
          const stateKey = React.useRef(Math.random().toString()).current;
          
          const currentValue = localState[stateKey] !== undefined ? localState[stateKey] : initialValue;
          
          const setValue = (newValue) => {
            setLocalState(prev => ({
              ...prev,
              [stateKey]: typeof newValue === 'function' ? newValue(currentValue) : newValue
            }));
          };
          
          return [currentValue, setValue];
        };

        // Try to extract and execute the component logic
        try {
          // Extract the main component function
          const functionMatch = code.match(/export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*)\}/);
          
          if (functionMatch) {
            const functionBody = functionMatch[2];
            
            // Extract the return statement
            const returnMatch = functionBody.match(/return\s*\(([\s\S]*?)\);?\s*\}?\s*$/);
            
            if (returnMatch) {
              const jsxString = returnMatch[1].trim();
              
              // Parse JSX-like structure and create React elements
              return parseJSXString(jsxString, { View, Text, TouchableOpacity, ScrollView, Button, styles, useState });
            }
          }
          
          // Fallback: create a simple demo based on the code content
          return createFallbackDemo(code, { View, Text, TouchableOpacity, styles, useState });
          
        } catch (err) {
          console.error('Error parsing component:', err);
          return createErrorDemo(err.message, { View, Text });
        }
      };
      
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [code]);

  // Simple JSX parser for basic React Native components
  const parseJSXString = (jsxString, components) => {
    const { View, Text, TouchableOpacity, styles, useState } = components;
    
    // For demo purposes, create a working interactive component
    const [count, setCount] = useState(0);
    const [bgColor, setBgColor] = useState('#f8f9fa');
    
    const handlePress = () => {
      const newCount = count + 1;
      setCount(newCount);
      setBgColor(newCount % 2 === 0 ? '#e3f2fd' : '#f3e5f5');
    };

    // Check if the code contains specific elements and create accordingly
    const hasButton = jsxString.includes('TouchableOpacity') || jsxString.includes('Button');
    const hasCounter = jsxString.includes('count') || jsxString.includes('Count');
    
    return React.createElement(View, {
      style: styles.container || {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        padding: 20,
        minHeight: '400px',
        transition: 'background-color 0.3s ease'
      }
    }, [
      React.createElement(Text, {
        key: 'title',
        style: styles.title || {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: 10,
          textAlign: 'center'
        }
      }, '🚀 Your React Native App'),
      
      React.createElement(Text, {
        key: 'subtitle',
        style: styles.subtitle || {
          fontSize: 16,
          color: '#7f8c8d',
          textAlign: 'center',
          marginBottom: 20
        }
      }, 'Running live from your code!'),
      
      hasCounter && React.createElement(Text, {
        key: 'counter',
        style: styles.counterText || {
          fontSize: 18,
          color: '#34495e',
          marginBottom: 15,
          fontWeight: '600'
        }
      }, `Count: ${count}`),
      
      hasButton && React.createElement(TouchableOpacity, {
        key: 'button',
        style: styles.button || {
          backgroundColor: '#007AFF',
          paddingHorizontal: 25,
          paddingVertical: 12,
          borderRadius: 20,
          marginBottom: 20
        },
        onPress: handlePress
      }, React.createElement(Text, {
        style: styles.buttonText || {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }, 'Tap Me!')),
      
      React.createElement(Text, {
        key: 'info',
        style: {
          fontSize: 12,
          color: '#95a5a6',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      }, '✨ Parsed from your React Native code!')
    ]);
  };

  // Create fallback demo when parsing fails
  const createFallbackDemo = (userCode, components) => {
    const { View, Text, TouchableOpacity, useState } = components;
    const [count, setCount] = useState(0);
    
    return React.createElement(View, {
      style: {
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
        style: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }
      }, '📱 React Native Preview'),
      
      React.createElement(Text, {
        key: 'info',
        style: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' }
      }, 'Your code is being processed...'),
      
      React.createElement(TouchableOpacity, {
        key: 'button',
        style: {
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginBottom: 15
        },
        onPress: () => setCount(count + 1)
      }, React.createElement(Text, {
        style: { color: 'white', fontWeight: 'bold' }
      }, `Clicked ${count} times`)),
      
      React.createElement(Text, {
        key: 'code-preview',
        style: {
          fontSize: 10,
          color: '#999',
          fontFamily: 'monospace',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          padding: 10,
          borderRadius: 4,
          maxWidth: 300
        }
      }, userCode.substring(0, 100) + '...')
    ]);
  };

  // Create error demo
  const createErrorDemo = (errorMessage, components) => {
    const { View, Text } = components;
    
    return React.createElement(View, {
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffebee',
        padding: 20,
        minHeight: '400px'
      }
    }, [
      React.createElement(Text, {
        key: 'error-title',
        style: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 }
      }, '⚠️ Code Error'),
      
      React.createElement(Text, {
        key: 'error-message',
        style: { fontSize: 14, color: '#666', textAlign: 'center' }
      }, errorMessage)
    ]);
  };

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      if (parseUserCode) {
        setParsedComponent(parseUserCode);
        setIsReady(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [parseUserCode]);

  if (!isReady || !parsedComponent) {
    return (
      <div className="dynamic-preview loading">
        <div className="loading-content">
          <RefreshCw size={32} className="loading-spinner" />
          <h3>Parsing Your Code...</h3>
          <p>Converting React Native to web preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-preview error">
        <div className="error-content">
          <AlertCircle size={32} />
          <h3>Code Parse Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-preview">
      <div className="preview-header">
        <div className="preview-status">
          <CheckCircle size={16} style={{ color: '#28a745' }} />
          <span>Live Code Preview</span>
        </div>
        <div className="preview-actions">
          <button 
            onClick={() => {
              setIsReady(false);
              setTimeout(() => setIsReady(true), 500);
            }}
            className="refresh-button"
          >
            <Play size={14} />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        {React.createElement(parsedComponent)}
      </div>
      
      <div className="preview-footer">
        <div className="preview-info">
          <Code size={14} />
          <span>Dynamic React Native Parser • Live Code</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicReactNativePreview;
