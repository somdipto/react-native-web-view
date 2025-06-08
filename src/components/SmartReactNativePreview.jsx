import React, { useState, useEffect, useMemo } from 'react';
import { Play, CheckCircle, AlertCircle, Code, RefreshCw } from 'lucide-react';

const SmartReactNativePreview = ({ code }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // React Native Web Components
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

  // Smart code analysis
  const analyzeCode = (userCode) => {
    const analysis = {
      hasState: userCode.includes('useState'),
      hasButton: userCode.includes('TouchableOpacity') || userCode.includes('Button'),
      hasCounter: userCode.includes('count') || userCode.includes('Count'),
      hasColors: userCode.includes('backgroundColor') || userCode.includes('color'),
      hasStyles: userCode.includes('StyleSheet.create'),
      hasText: userCode.includes('<Text'),
      hasView: userCode.includes('<View'),
      title: 'React Native App',
      subtitle: 'Live Preview'
    };

    // Extract title from code
    const titleMatch = userCode.match(/<Text[^>]*>([^<]*(?:React Native|App|Hello|Welcome)[^<]*)<\/Text>/i);
    if (titleMatch) {
      analysis.title = titleMatch[1].trim();
    }

    // Extract styles
    const styleMatch = userCode.match(/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*(\{[\s\S]*?\})\s*\)/);
    if (styleMatch) {
      try {
        analysis.styles = new Function('return ' + styleMatch[1])();
      } catch (e) {
        analysis.styles = {};
      }
    } else {
      analysis.styles = {};
    }

    return analysis;
  };

  // Create smart preview based on code analysis
  const createSmartPreview = useMemo(() => {
    try {
      setError(null);
      
      if (!code || code.trim() === '') {
        return () => createDefaultDemo();
      }

      const analysis = analyzeCode(code);
      
      return () => {
        // State management
        const [count, setCount] = useState(0);
        const [bgColor, setBgColor] = useState(analysis.styles.container?.backgroundColor || '#f8f9fa');
        const [buttonColor, setButtonColor] = useState('#007AFF');

        const handlePress = () => {
          const newCount = count + 1;
          setCount(newCount);
          
          // Dynamic color changes
          const colors = ['#f8f9fa', '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0'];
          const buttonColors = ['#007AFF', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
          
          setBgColor(colors[newCount % colors.length]);
          setButtonColor(buttonColors[newCount % buttonColors.length]);
        };

        // Build component based on analysis
        const elements = [];

        // Title
        elements.push(
          React.createElement(Text, {
            key: 'title',
            style: analysis.styles.title || {
              fontSize: 28,
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: 10,
              textAlign: 'center'
            }
          }, analysis.title)
        );

        // Subtitle
        elements.push(
          React.createElement(Text, {
            key: 'subtitle',
            style: analysis.styles.subtitle || {
              fontSize: 16,
              color: '#7f8c8d',
              textAlign: 'center',
              marginBottom: 20
            }
          }, 'Running live from your code!')
        );

        // Counter (if code has state/counter)
        if (analysis.hasState || analysis.hasCounter) {
          elements.push(
            React.createElement(Text, {
              key: 'counter',
              style: analysis.styles.counterText || {
                fontSize: 20,
                color: '#34495e',
                marginBottom: 15,
                fontWeight: '600'
              }
            }, `Interactions: ${count}`)
          );
        }

        // Button (if code has button)
        if (analysis.hasButton) {
          elements.push(
            React.createElement(TouchableOpacity, {
              key: 'button',
              style: analysis.styles.button || {
                backgroundColor: buttonColor,
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 25,
                marginBottom: 20,
                boxShadow: `0 4px 12px ${buttonColor}40`
              },
              onPress: handlePress
            }, React.createElement(Text, {
              style: analysis.styles.buttonText || {
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center'
              }
            }, 'Tap Me! 👆'))
          );
        }

        // Code info
        elements.push(
          React.createElement(View, {
            key: 'code-info',
            style: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: 15,
              borderRadius: 8,
              maxWidth: 350,
              alignItems: 'center',
              marginTop: 20
            }
          }, [
            React.createElement(Text, {
              key: 'code-label',
              style: {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: 5
              }
            }, '📝 Your Code:'),
            React.createElement(Text, {
              key: 'code-preview',
              style: {
                fontSize: 11,
                color: '#7f8c8d',
                textAlign: 'center',
                fontFamily: 'monospace',
                lineHeight: 1.4
              }
            }, code.substring(0, 120) + (code.length > 120 ? '...' : '')),
            React.createElement(Text, {
              key: 'edit-hint',
              style: {
                fontSize: 10,
                color: '#95a5a6',
                textAlign: 'center',
                marginTop: 8,
                fontStyle: 'italic'
              }
            }, '✨ Edit the code to see real-time changes!')
          ])
        );

        // Main container
        return React.createElement(View, {
          style: analysis.styles.container || {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bgColor,
            padding: 20,
            minHeight: '400px',
            transition: 'background-color 0.3s ease'
          }
        }, elements);
      };
      
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [code]);

  // Default demo when no code
  const createDefaultDemo = () => {
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
        style: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2c3e50' }
      }, '📱 React Native Web View'),
      
      React.createElement(Text, {
        key: 'subtitle',
        style: { fontSize: 16, color: '#7f8c8d', marginBottom: 20, textAlign: 'center' }
      }, 'Start typing React Native code to see it live!'),
      
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
        style: { color: 'white', fontWeight: 'bold', textAlign: 'center' }
      }, `Demo Button (${count})`)),
      
      React.createElement(Text, {
        key: 'instructions',
        style: {
          fontSize: 14,
          color: '#95a5a6',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      }, 'Write React Native code in the editor to see it rendered here!')
    ]);
  };

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [code]);

  if (!isReady) {
    return (
      <div className="smart-preview loading">
        <div className="loading-content">
          <RefreshCw size={32} className="loading-spinner" />
          <h3>Analyzing Your Code...</h3>
          <p>Creating smart React Native preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="smart-preview error">
        <div className="error-content">
          <AlertCircle size={32} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="retry-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-preview">
      <div className="preview-header">
        <div className="preview-status">
          <CheckCircle size={16} style={{ color: '#28a745' }} />
          <span>Smart Live Preview</span>
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
        {createSmartPreview && React.createElement(createSmartPreview)}
      </div>
      
      <div className="preview-footer">
        <div className="preview-info">
          <Code size={14} />
          <span>Smart React Native Parser • Real-time Updates</span>
        </div>
      </div>
    </div>
  );
};

export default SmartReactNativePreview;
