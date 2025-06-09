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

        // Subtle status indicator (much cleaner)
        elements.push(
          React.createElement(Text, {
            key: 'status',
            style: {
              fontSize: 12,
              color: '#95a5a6',
              textAlign: 'center',
              marginTop: 30,
              fontStyle: 'italic'
            }
          }, '✨ Live React Native Preview')
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

  // Clean default demo when no code
  const createDefaultDemo = () => {
    const [count, setCount] = useState(0);

    return React.createElement(View, {
      style: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 40,
        minHeight: '400px'
      }
    }, [
      React.createElement(Text, {
        key: 'title',
        style: {
          fontSize: 32,
          fontWeight: '700',
          marginBottom: 12,
          textAlign: 'center',
          color: '#2c3e50',
          letterSpacing: '-0.5px'
        }
      }, '🚀 React Native'),

      React.createElement(Text, {
        key: 'subtitle',
        style: {
          fontSize: 18,
          color: '#7f8c8d',
          marginBottom: 40,
          textAlign: 'center',
          fontWeight: '400'
        }
      }, 'Start coding to see your app come to life'),

      React.createElement(TouchableOpacity, {
        key: 'button',
        style: {
          backgroundColor: '#667eea',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
        },
        onPress: () => setCount(count + 1)
      }, React.createElement(Text, {
        style: {
          color: 'white',
          fontWeight: '600',
          textAlign: 'center',
          fontSize: 16
        }
      }, `Try Me! (${count})`)),

      React.createElement(Text, {
        key: 'instructions',
        style: {
          fontSize: 14,
          color: '#95a5a6',
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: 20
        }
      }, 'Write React Native code in the editor →')
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
      <div className="preview-content-clean loading">
        <div className="loading-content">
          <RefreshCw size={28} className="loading-spinner" />
          <h3>Loading Preview</h3>
          <p>Analyzing your React Native code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-content-clean error">
        <div className="error-content">
          <AlertCircle size={28} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Clean preview without any headers or footers
  return (
    <div className="preview-content-clean">
      {createSmartPreview && React.createElement(createSmartPreview)}
    </div>
  );
};

export default SmartReactNativePreview;
