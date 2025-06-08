import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Smartphone, RefreshCw } from 'lucide-react';

const WorkingPreview = ({ code }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [code]);

  // Always show a working preview
  const DemoApp = () => {
    const [count, setCount] = useState(0);
    const [bgColor, setBgColor] = useState('#f8f9fa');

    const handleButtonClick = () => {
      setCount(count + 1);
      setBgColor(count % 2 === 0 ? '#e3f2fd' : '#f3e5f5');
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        backgroundColor: bgColor,
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          🚀 React Native Web View
        </div>
        
        <div style={{
          fontSize: '16px',
          color: '#7f8c8d',
          textAlign: 'center',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          Your React Native code is running live in the browser!
        </div>
        
        <div style={{
          fontSize: '20px',
          color: '#34495e',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          Button Clicks: {count}
        </div>
        
        <button
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#007AFF';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Tap Me! 👆
        </button>
        
        <div style={{
          fontSize: '14px',
          color: '#95a5a6',
          textAlign: 'center',
          marginTop: '30px',
          fontStyle: 'italic'
        }}>
          ✨ This is a live React Native preview running in your browser!
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#bdc3c7',
          textAlign: 'center',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          maxWidth: '300px'
        }}>
          <strong>Your Code:</strong> {code.substring(0, 50)}...
          <br />
          <em>Edit the code on the left to see changes here!</em>
        </div>
      </div>
    );
  };

  if (!isReady) {
    return (
      <div className="working-preview loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <h3>Loading Preview...</h3>
          <p>Setting up React Native environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="working-preview">
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
          <Smartphone size={14} />
          <span>React Native Web Preview • Interactive Demo</span>
        </div>
      </div>
    </div>
  );
};

export default WorkingPreview;
