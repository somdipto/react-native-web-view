import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle } from 'lucide-react';

const SimpleReactNativePreview = ({ code }) => {
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Simple React Native to HTML converter
  const convertReactNativeToHTML = (sourceCode) => {
    try {
      // Extract the component content
      let processedCode = sourceCode;
      
      // Replace React Native imports
      processedCode = processedCode.replace(
        /import.*from\s+['"]react-native['"];?/g,
        '// React Native components mocked'
      );
      
      // Replace StyleSheet.create
      processedCode = processedCode.replace(
        /StyleSheet\.create\(/g,
        'Object.freeze('
      );
      
      // Extract styles if they exist
      const styleMatch = processedCode.match(/const\s+styles\s*=\s*.*?(\{[\s\S]*?\});/);
      const styles = styleMatch ? styleMatch[1] : '{}';
      
      // Extract the component JSX
      const returnMatch = processedCode.match(/return\s*\(([\s\S]*?)\);/);
      if (!returnMatch) {
        throw new Error('Could not find return statement in component');
      }
      
      let jsx = returnMatch[1].trim();
      
      // Convert React Native components to HTML equivalents
      jsx = jsx
        .replace(/<View/g, '<div')
        .replace(/<\/View>/g, '</div>')
        .replace(/<Text/g, '<span')
        .replace(/<\/Text>/g, '</span>')
        .replace(/<ScrollView/g, '<div')
        .replace(/<\/ScrollView>/g, '</div>')
        .replace(/style=\{styles\.(\w+)\}/g, (match, styleName) => {
          return `className="${styleName}"`;
        });
      
      return { jsx, styles, error: null };
    } catch (err) {
      return { jsx: null, styles: null, error: err.message };
    }
  };

  // Convert styles object to CSS
  const stylesToCSS = (stylesStr) => {
    try {
      // Safer alternative to eval - use Function constructor
      const styles = new Function('return ' + stylesStr)();
      let css = '';

      Object.keys(styles).forEach(className => {
        const style = styles[className];
        css += `.${className} {\n`;

        Object.keys(style).forEach(prop => {
          let cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          let value = style[prop];

          // Convert React Native style properties to CSS
          if (cssProp === 'justify-content') cssProp = 'justify-content';
          if (cssProp === 'align-items') cssProp = 'align-items';
          if (cssProp === 'flex-direction') cssProp = 'flex-direction';
          if (cssProp === 'background-color') cssProp = 'background-color';
          if (cssProp === 'font-size') value = typeof value === 'number' ? `${value}px` : value;
          if (cssProp === 'font-weight') cssProp = 'font-weight';
          if (cssProp === 'text-align') cssProp = 'text-align';
          if (cssProp === 'line-height') value = typeof value === 'number' ? `${value}px` : value;
          if (cssProp === 'margin-bottom') value = typeof value === 'number' ? `${value}px` : value;
          if (typeof value === 'number' && ['padding', 'margin', 'width', 'height'].some(p => cssProp.includes(p))) {
            value = `${value}px`;
          }

          css += `  ${cssProp}: ${value};\n`;
        });

        css += '}\n\n';
      });

      return css;
    } catch (err) {
      return `/* Error parsing styles: ${err.message} */`;
    }
  };

  const runPreview = () => {
    setIsRunning(true);
    setError(null);
    
    setTimeout(() => {
      const result = convertReactNativeToHTML(code);
      
      if (result.error) {
        setError(result.error);
        setOutput(null);
      } else {
        const css = stylesToCSS(result.styles);
        setOutput({ jsx: result.jsx, css });
        setError(null);
      }
      
      setIsRunning(false);
    }, 500);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      runPreview();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [code]);

  const renderPreview = () => {
    if (error) {
      return (
        <div className="preview-error">
          <AlertCircle size={24} />
          <h3>Preview Error</h3>
          <p>{error}</p>
          <button onClick={runPreview} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    if (!output) {
      return (
        <div className="preview-placeholder">
          <div className="placeholder-content">
            <h3>React Native Preview</h3>
            <p>Your app will appear here</p>
            <button onClick={runPreview} className="run-button">
              <Play size={16} />
              Run Preview
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="preview-output">
        <style dangerouslySetInnerHTML={{ __html: output.css }} />
        <div 
          className="app-container"
          dangerouslySetInnerHTML={{ __html: output.jsx }}
        />
      </div>
    );
  };

  return (
    <div className="simple-react-native-preview">
      <div className="preview-header">
        <div className="preview-status">
          {isRunning ? (
            <>
              <div className="status-dot running"></div>
              <span>Running...</span>
            </>
          ) : error ? (
            <>
              <AlertCircle size={16} className="status-error" />
              <span>Error</span>
            </>
          ) : output ? (
            <>
              <CheckCircle size={16} className="status-success" />
              <span>Ready</span>
            </>
          ) : (
            <>
              <div className="status-dot idle"></div>
              <span>Idle</span>
            </>
          )}
        </div>
        <div className="preview-actions">
          <button 
            onClick={runPreview} 
            disabled={isRunning}
            className="refresh-button"
          >
            <Play size={14} />
            Run
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        {renderPreview()}
      </div>
      
      <div className="preview-footer">
        <div className="code-info">
          <span>React Native → HTML Preview</span>
          <span className="code-length">{code.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleReactNativePreview;
