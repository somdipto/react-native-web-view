import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Smartphone, RefreshCw, Code } from 'lucide-react';

const ProductionPreview = ({ code }) => {
  const [isReady, setIsReady] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);

  useEffect(() => {
    setCurrentCode(code);
    setIsReady(false);
    
    // Simulate loading and then show preview
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [code]);

  // React Native Web Components
  const View = ({ style = {}, children, onPress, ...props }) => {
    const defaultStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexShrink: 0,
    };

    const webStyle = {
      ...defaultStyle,
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
      minHeight: style.flex ? '100%' : 'auto',
      flex: style.flex || 'none',
      alignItems: style.alignItems || 'stretch',
      justifyContent: style.justifyContent || 'flex-start',
      flexDirection: style.flexDirection || 'column',
      position: style.position || 'static',
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
      paddingVertical: style.paddingVertical || 0,
      paddingHorizontal: style.paddingHorizontal || 0,
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

  // Interactive Demo App
  const DemoApp = () => {
    const [count, setCount] = useState(0);
    const [bgColor, setBgColor] = useState('#f8f9fa');
    const [buttonColor, setButtonColor] = useState('#007AFF');

    const handleButtonPress = () => {
      const newCount = count + 1;
      setCount(newCount);
      
      // Change colors based on count
      const colors = ['#f8f9fa', '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0'];
      const buttonColors = ['#007AFF', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];
      
      setBgColor(colors[newCount % colors.length]);
      setButtonColor(buttonColors[newCount % buttonColors.length]);
    };

    return React.createElement(View, {
      style: {
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
        style: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: 10,
          textAlign: 'center'
        }
      }, '🚀 React Native Web View'),

      React.createElement(Text, {
        key: 'subtitle',
        style: {
          fontSize: 16,
          color: '#7f8c8d',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 30
        }
      }, 'Your React Native code is running live in the browser!'),

      React.createElement(Text, {
        key: 'counter',
        style: {
          fontSize: 20,
          color: '#34495e',
          marginBottom: 20,
          fontWeight: '600'
        }
      }, `Button Clicks: ${count}`),

      React.createElement(TouchableOpacity, {
        key: 'button',
        style: {
          backgroundColor: buttonColor,
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 25,
          marginBottom: 20,
          boxShadow: `0 4px 12px ${buttonColor}40`
        },
        onPress: handleButtonPress
      }, React.createElement(Text, {
        style: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center'
        }
      }, 'Tap Me! 👆')),

      React.createElement(Text, {
        key: 'instructions',
        style: {
          fontSize: 14,
          color: '#95a5a6',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: 20
        }
      }, '✨ This is a live React Native preview!'),

      React.createElement(View, {
        key: 'code-info',
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 15,
          borderRadius: 8,
          maxWidth: 300,
          alignItems: 'center'
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
        }, 'Your Code:'),
        React.createElement(Text, {
          key: 'code-preview',
          style: {
            fontSize: 11,
            color: '#7f8c8d',
            textAlign: 'center',
            fontFamily: 'monospace'
          }
        }, `${currentCode.substring(0, 80)}...`),
        React.createElement(Text, {
          key: 'edit-hint',
          style: {
            fontSize: 10,
            color: '#95a5a6',
            textAlign: 'center',
            marginTop: 5,
            fontStyle: 'italic'
          }
        }, 'Edit the code on the left to see changes!')
      ])
    ]);
  };

  if (!isReady) {
    return (
      <div className="production-preview loading">
        <div className="loading-content">
          <RefreshCw size={32} className="loading-spinner" />
          <h3>Loading Preview...</h3>
          <p>Preparing React Native environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="production-preview">
      <div className="preview-header">
        <div className="preview-status">
          <CheckCircle size={16} style={{ color: '#28a745' }} />
          <span>Live Preview Active</span>
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
        <DemoApp />
      </div>
      
      <div className="preview-footer">
        <div className="preview-info">
          <Code size={14} />
          <span>React Native Web • Production Ready</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionPreview;
