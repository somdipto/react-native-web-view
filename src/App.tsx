import React, { useState, useCallback, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodeEditor from './components/CodeEditor';
import SnackPreview from './components/SnackPreview';
import { 
  Code, 
  Play, 
  Moon, 
  Sun, 
  Settings, 
  Download,
  Share,
  Copy,
  Check,
  Github,
  ExternalLink
} from 'lucide-react';

const DEFAULT_CODE = `import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  SafeAreaView
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [count, setCount] = useState(0);
  const [colors] = useState(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']);

  const incrementCount = () => {
    setCount(prev => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🚀 React Native Playground</Text>
          <Text style={styles.subtitle}>
            Welcome to the interactive React Native web viewer!
          </Text>
        </View>

        <View style={styles.counterSection}>
          <Text style={styles.counterLabel}>Counter Value</Text>
          <View style={[
            styles.counterDisplay, 
            { backgroundColor: colors[count % colors.length] }
          ]}>
            <Text style={styles.counterText}>{count}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={incrementCount}
            >
              <Text style={styles.buttonText}>Increment (+1)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={resetCount}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>✨ Features Showcase</Text>
          
          <View style={styles.featureGrid}>
            {[
              { icon: '🎨', title: 'Styling', desc: 'FlexBox & StyleSheet' },
              { icon: '📱', title: 'Responsive', desc: 'Multi-device support' },
              { icon: '⚡', title: 'Interactive', desc: 'Touch & gestures' },
              { icon: '🔄', title: 'State', desc: 'React hooks' }
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Edit the code on the left to see changes here! 👈
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  counterSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  counterLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  counterDisplay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  counterText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  infoSection: {
    width: '100%',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 70) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});`;

const COMMON_DEPENDENCIES = [
  'expo-constants',
  '@expo/vector-icons',
  'react-native-vector-icons',
  'expo-linear-gradient',
  'expo-font',
  'expo-asset',
  'expo-permissions',
  'expo-camera',
  'expo-image-picker',
  'expo-location',
  'expo-sensors',
  'expo-av',
  'expo-notifications',
  'expo-sharing',
  'expo-file-system',
  'expo-sqlite',
  'expo-secure-store',
  'expo-async-storage',
  'react-navigation',
  '@react-navigation/native',
  '@react-navigation/stack',
  '@react-navigation/bottom-tabs',
  '@react-navigation/drawer',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-paper',
  'react-native-elements',
  'native-base',
  'styled-components',
  'lodash',
  'moment',
  'axios'
];

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dependencies, setDependencies] = useState('expo-constants');
  const [showSettings, setShowSettings] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareSnack = async () => {
    const encodedCode = encodeURIComponent(code);
    const encodedName = encodeURIComponent('React Native Playground');
    const url = `https://snack.expo.dev/?code=${encodedCode}&dependencies=${dependencies}&name=${encodedName}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'React Native Playground',
          text: 'Check out this React Native code!',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.title = 'React Native Web Viewer - Interactive Playground';
  }, []);

  return (
    <div className={`h-screen w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-3 flex items-center justify-between shadow-sm`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                React Native Web Viewer
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Interactive playground with live preview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyCode}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Copy Code"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={shareSnack}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Share Snack"
          >
            {isShared ? <Check className="w-4 h-4 text-green-500" /> : <Share className="w-4 h-4" />}
          </button>

          <button
            onClick={downloadCode}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Download Code"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
          <div className="max-w-4xl mx-auto">
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
              Dependencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_DEPENDENCIES.map((dep) => (
                <button
                  key={dep}
                  onClick={() => {
                    const currentDeps = dependencies.split(',').filter(d => d.trim());
                    if (currentDeps.includes(dep)) {
                      setDependencies(currentDeps.filter(d => d !== dep).join(','));
                    } else {
                      setDependencies([...currentDeps, dep].join(','));
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    dependencies.includes(dep)
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full p-4">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                theme={theme}
                language="javascript"
                height="100%"
              />
            </div>
          </Panel>
          
          <PanelResizeHandle className={`w-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} hover:bg-blue-400 transition-colors cursor-col-resize`} />
          
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full p-4">
              <SnackPreview
                code={code}
                dependencies={dependencies}
                theme={theme}
                platform="ios"
                name="React Native Playground"
                description="Interactive React Native code playground"
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} border-t px-6 py-2 text-center text-sm`}>
        <div className="flex items-center justify-center space-x-4">
          <span>Built with React Native Web Viewer</span>
          <div className="w-px h-4 bg-gray-400"></div>
          <a
            href="https://snack.expo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          >
            <span>Powered by Expo Snack</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;