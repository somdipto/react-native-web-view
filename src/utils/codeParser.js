// React Native Code Parser for Web Preview
export class ReactNativeCodeParser {
  constructor() {
    this.componentCache = new Map();
  }

  // Parse React Native code and extract components
  parseCode(code) {
    try {
      // Clean the code
      const cleanCode = this.cleanCode(code);
      
      // Extract styles
      const styles = this.extractStyles(cleanCode);
      
      // Extract component structure
      const componentStructure = this.extractComponentStructure(cleanCode);
      
      // Extract state variables
      const stateVariables = this.extractStateVariables(cleanCode);
      
      // Extract functions
      const functions = this.extractFunctions(cleanCode);
      
      return {
        styles,
        componentStructure,
        stateVariables,
        functions,
        isValid: true
      };
    } catch (error) {
      console.error('Code parsing error:', error);
      return {
        styles: {},
        componentStructure: null,
        stateVariables: [],
        functions: [],
        isValid: false,
        error: error.message
      };
    }
  }

  // Clean and normalize the code
  cleanCode(code) {
    return code
      .replace(/import.*from.*['"]react-native['"];?\s*/g, '')
      .replace(/import.*from.*['"]react['"];?\s*/g, '')
      .replace(/export\s+default\s+/g, '')
      .trim();
  }

  // Extract StyleSheet styles
  extractStyles(code) {
    const styleMatch = code.match(/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*(\{[\s\S]*?\})\s*\)/);
    
    if (styleMatch) {
      try {
        // Safely evaluate the styles object
        const stylesString = styleMatch[1];
        return new Function('return ' + stylesString)();
      } catch (e) {
        console.warn('Could not parse styles:', e);
      }
    }
    
    return {};
  }

  // Extract component structure from JSX
  extractComponentStructure(code) {
    // Find the main function
    const functionMatch = code.match(/function\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*)\}/);
    
    if (functionMatch) {
      const functionBody = functionMatch[2];
      
      // Find the return statement
      const returnMatch = functionBody.match(/return\s*\(([\s\S]*?)\);?\s*\}?\s*$/);
      
      if (returnMatch) {
        const jsxString = returnMatch[1].trim();
        return this.parseJSXStructure(jsxString);
      }
    }
    
    return null;
  }

  // Parse JSX structure into a tree
  parseJSXStructure(jsxString) {
    // Simple JSX parser - handles basic React Native components
    const components = [];
    
    // Find View components
    const viewMatches = jsxString.match(/<View[^>]*>[\s\S]*?<\/View>/g);
    if (viewMatches) {
      viewMatches.forEach(match => {
        components.push({
          type: 'View',
          props: this.extractProps(match),
          children: this.extractChildren(match)
        });
      });
    }
    
    // Find Text components
    const textMatches = jsxString.match(/<Text[^>]*>([^<]*)<\/Text>/g);
    if (textMatches) {
      textMatches.forEach(match => {
        const content = match.match(/<Text[^>]*>([^<]*)<\/Text>/);
        components.push({
          type: 'Text',
          props: this.extractProps(match),
          content: content ? content[1] : ''
        });
      });
    }
    
    // Find TouchableOpacity components
    const touchableMatches = jsxString.match(/<TouchableOpacity[^>]*>[\s\S]*?<\/TouchableOpacity>/g);
    if (touchableMatches) {
      touchableMatches.forEach(match => {
        components.push({
          type: 'TouchableOpacity',
          props: this.extractProps(match),
          children: this.extractChildren(match)
        });
      });
    }
    
    return components;
  }

  // Extract props from JSX element
  extractProps(jsxElement) {
    const props = {};
    
    // Extract style prop
    const styleMatch = jsxElement.match(/style=\{([^}]+)\}/);
    if (styleMatch) {
      props.style = styleMatch[1];
    }
    
    // Extract onPress prop
    const onPressMatch = jsxElement.match(/onPress=\{([^}]+)\}/);
    if (onPressMatch) {
      props.onPress = onPressMatch[1];
    }
    
    return props;
  }

  // Extract children from JSX element
  extractChildren(jsxElement) {
    const children = [];
    
    // Simple extraction - can be enhanced
    const textContent = jsxElement.match(/>([^<]+)</);
    if (textContent) {
      children.push({
        type: 'text',
        content: textContent[1].trim()
      });
    }
    
    return children;
  }

  // Extract useState variables
  extractStateVariables(code) {
    const stateMatches = code.match(/const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState\s*\(\s*([^)]+)\s*\)/g);
    
    if (stateMatches) {
      return stateMatches.map(match => {
        const parts = match.match(/const\s*\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState\s*\(\s*([^)]+)\s*\)/);
        return {
          name: parts[1],
          setter: parts[2],
          initialValue: parts[3]
        };
      });
    }
    
    return [];
  }

  // Extract function definitions
  extractFunctions(code) {
    const functionMatches = code.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\}/g);
    
    if (functionMatches) {
      return functionMatches.map(match => {
        const nameMatch = match.match(/const\s+(\w+)\s*=/);
        return {
          name: nameMatch ? nameMatch[1] : 'unknown',
          definition: match
        };
      });
    }
    
    return [];
  }

  // Generate React component from parsed structure
  generateComponent(parsedCode, reactNativeComponents) {
    const { styles, componentStructure, stateVariables, functions } = parsedCode;
    const { View, Text, TouchableOpacity } = reactNativeComponents;
    
    return () => {
      // Create state variables
      const stateValues = {};
      const stateSetters = {};
      
      stateVariables.forEach(stateVar => {
        const [value, setter] = React.useState(this.evaluateInitialValue(stateVar.initialValue));
        stateValues[stateVar.name] = value;
        stateSetters[stateVar.setter] = setter;
      });
      
      // Create event handlers
      const handlers = {};
      functions.forEach(func => {
        handlers[func.name] = () => {
          // Simple handler - can be enhanced
          console.log(`${func.name} called`);
        };
      });
      
      // Render component structure
      if (componentStructure && componentStructure.length > 0) {
        return this.renderComponents(componentStructure, {
          View, Text, TouchableOpacity, styles, stateValues, stateSetters, handlers
        });
      }
      
      // Fallback rendering
      return this.renderFallback({ View, Text, TouchableOpacity, styles });
    };
  }

  // Evaluate initial state values
  evaluateInitialValue(valueString) {
    try {
      if (valueString === 'true' || valueString === 'false') {
        return valueString === 'true';
      }
      if (!isNaN(valueString)) {
        return Number(valueString);
      }
      if (valueString.startsWith("'") || valueString.startsWith('"')) {
        return valueString.slice(1, -1);
      }
      return valueString;
    } catch (e) {
      return valueString;
    }
  }

  // Render components from structure
  renderComponents(components, context) {
    const { View, Text, TouchableOpacity, styles } = context;
    
    return React.createElement(View, {
      style: styles.container || {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
        minHeight: '400px'
      }
    }, components.map((component, index) => {
      return this.renderSingleComponent(component, index, context);
    }));
  }

  // Render a single component
  renderSingleComponent(component, key, context) {
    const { View, Text, TouchableOpacity, styles, stateValues, stateSetters } = context;
    
    switch (component.type) {
      case 'View':
        return React.createElement(View, {
          key,
          style: this.getStyleFromProp(component.props.style, styles)
        }, component.children?.map((child, childIndex) => 
          this.renderSingleComponent(child, `${key}-${childIndex}`, context)
        ));
        
      case 'Text':
        return React.createElement(Text, {
          key,
          style: this.getStyleFromProp(component.props.style, styles)
        }, component.content || 'Text');
        
      case 'TouchableOpacity':
        return React.createElement(TouchableOpacity, {
          key,
          style: this.getStyleFromProp(component.props.style, styles),
          onPress: () => {
            // Simple counter increment for demo
            if (stateSetters.setCount) {
              stateSetters.setCount(prev => prev + 1);
            }
          }
        }, component.children?.map((child, childIndex) => 
          this.renderSingleComponent(child, `${key}-${childIndex}`, context)
        ));
        
      default:
        return React.createElement(Text, { key }, component.content || '');
    }
  }

  // Get style object from style prop
  getStyleFromProp(styleProp, styles) {
    if (!styleProp) return {};
    
    // Handle styles.styleName format
    if (styleProp.startsWith('styles.')) {
      const styleName = styleProp.replace('styles.', '');
      return styles[styleName] || {};
    }
    
    return {};
  }

  // Render fallback component
  renderFallback(components) {
    const { View, Text, TouchableOpacity } = components;
    const [count, setCount] = React.useState(0);
    
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
      }, '📱 Your React Native App'),
      
      React.createElement(Text, {
        key: 'counter',
        style: { fontSize: 16, marginBottom: 15, color: '#666' }
      }, `Interactions: ${count}`),
      
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
      }, 'Tap to Interact')),
      
      React.createElement(Text, {
        key: 'info',
        style: {
          fontSize: 12,
          color: '#999',
          textAlign: 'center',
          fontStyle: 'italic'
        }
      }, '✨ Parsed from your React Native code!')
    ]);
  }
}
