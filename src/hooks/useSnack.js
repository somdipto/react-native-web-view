import { useState, useEffect, useRef, useCallback } from 'react';
import { Snack } from 'snack-sdk';

// Enhanced useSnack hook with comprehensive Snack SDK integration
export const useSnack = (initialCode) => {
  const [snack, setSnack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [webPreviewUrl, setWebPreviewUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [connectedClients, setConnectedClients] = useState(0);
  const snackRef = useRef(null);
  const webPreviewRef = useRef(null);
  const initializationAttempts = useRef(0);
  const maxRetries = 3;

  // Enhanced dependency detection from code
  const detectDependencies = useCallback((code) => {
    const dependencies = {};

    // Common React Native dependencies
    const dependencyPatterns = [
      { pattern: /from\s+['"]react-native-vector-icons/, dep: 'react-native-vector-icons' },
      { pattern: /from\s+['"]@expo\/vector-icons/, dep: '@expo/vector-icons' },
      { pattern: /from\s+['"]react-native-maps/, dep: 'react-native-maps' },
      { pattern: /from\s+['"]react-native-camera/, dep: 'react-native-camera' },
      { pattern: /from\s+['"]expo-camera/, dep: 'expo-camera' },
      { pattern: /from\s+['"]expo-location/, dep: 'expo-location' },
      { pattern: /from\s+['"]expo-permissions/, dep: 'expo-permissions' },
      { pattern: /from\s+['"]expo-constants/, dep: 'expo-constants' },
      { pattern: /from\s+['"]expo-linear-gradient/, dep: 'expo-linear-gradient' },
      { pattern: /from\s+['"]react-native-gesture-handler/, dep: 'react-native-gesture-handler' },
      { pattern: /from\s+['"]react-native-reanimated/, dep: 'react-native-reanimated' },
      { pattern: /from\s+['"]@react-navigation/, dep: '@react-navigation/native' },
    ];

    dependencyPatterns.forEach(({ pattern, dep }) => {
      if (pattern.test(code)) {
        dependencies[dep] = 'latest';
      }
    });

    return dependencies;
  }, []);

  // Function to set the web preview iframe reference
  const setWebPreviewRef = useCallback((iframe) => {
    if (iframe) {
      webPreviewRef.current = iframe;
      console.log('Web preview iframe reference set');

      // If snack is already initialized, the iframe will automatically connect
      if (snackRef.current && webPreviewUrl) {
        console.log('Snack instance available with web preview URL:', webPreviewUrl);
      }
    }
  }, [webPreviewUrl]);

  // Enhanced Snack initialization with better error handling and production support
  useEffect(() => {
    const initializeSnack = async () => {
      try {
        setIsLoading(true);
        setError(null);
        initializationAttempts.current += 1;

        console.log(`Initializing Snack (attempt ${initializationAttempts.current}/${maxRetries})`);
        console.log('Code preview:', initialCode.substring(0, 100) + '...');

        // Detect dependencies from code
        const detectedDependencies = detectDependencies(initialCode);
        console.log('Detected dependencies:', detectedDependencies);

        // Enhanced Snack configuration
        const snackConfig = {
          files: {
            'App.js': {
              type: 'CODE',
              contents: initialCode,
            },
          },
          dependencies: detectedDependencies,
          sdkVersion: '50.0.0', // Updated to newer SDK version for better web support
          name: 'React Native Web Editor',
          description: 'Live React Native preview powered by Expo Snack',
          // Enable web preview explicitly
          platforms: ['ios', 'android', 'web'],
        };

        console.log('Creating Snack with enhanced config:', snackConfig);
        const newSnack = new Snack(snackConfig);

        snackRef.current = newSnack;
        setSnack(newSnack);

        // Enhanced state listener with comprehensive state tracking
        const stateListener = (state, prevState) => {
          console.log('Snack state updated:', {
            url: state.url,
            webPreviewURL: state.webPreviewURL,
            online: state.online,
            isSaved: state.isSaved,
            isResolving: state.isResolving,
            connectedClients: Object.keys(state.connectedClients || {}).length,
            errors: state.errors
          });

          // Update state variables
          setIsOnline(state.online || false);
          setIsSaved(state.isSaved || false);
          setConnectedClients(Object.keys(state.connectedClients || {}).length);

          // Handle URL updates
          if (state.url && state.url !== prevState?.url) {
            console.log('Preview URL updated:', state.url);
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL && state.webPreviewURL !== prevState?.webPreviewURL) {
            console.log('Web preview URL updated:', state.webPreviewURL);
            setWebPreviewUrl(state.webPreviewURL);
          }

          // Handle errors
          if (state.errors && state.errors.length > 0) {
            const errorMessage = state.errors.map(e => e.message || e).join(', ');
            console.error('Snack errors:', state.errors);
            setError(errorMessage);
          } else if (state.error && state.error !== prevState?.error) {
            console.error('Snack error:', state.error);
            setError(state.error);
          }
        };

        newSnack.addStateListener(stateListener);

        // Set the snack online to get URLs
        console.log('Setting Snack online...');
        await newSnack.setOnline(true);

        // Enhanced initialization with better timeout and fallback handling
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Snack initialization timeout')), 15000)
        );

        try {
          // Wait for initial state
          const state = await Promise.race([
            newSnack.getStateAsync(),
            timeoutPromise
          ]);

          console.log('Initial snack state:', state);

          // Set initial URLs if available
          if (state.url) {
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL) {
            setWebPreviewUrl(state.webPreviewURL);
          }

          // Enhanced fallback URL generation
          if (!state.webPreviewURL) {
            let fallbackUrl;

            if (state.url) {
              // Extract Snack ID from URL and create embedded web preview
              const snackId = state.url.split('/').pop();
              fallbackUrl = `https://snack.expo.dev/embedded/@snack/${snackId}?preview=true&platform=web&theme=light`;
            } else {
              // Create a new embedded Snack with the current code
              const encodedCode = encodeURIComponent(initialCode);
              const encodedDeps = encodeURIComponent(JSON.stringify(detectedDependencies));
              fallbackUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&code=${encodedCode}&dependencies=${encodedDeps}&sdkVersion=50.0.0&name=${encodeURIComponent('React Native Web Editor')}`;
            }

            console.log('Using enhanced fallback web preview URL:', fallbackUrl);
            setWebPreviewUrl(fallbackUrl);
          }

          setIsLoading(false);
          console.log('Snack initialization completed successfully');

        } catch (timeoutError) {
          console.warn('Snack initialization timed out, attempting fallback...');

          if (initializationAttempts.current < maxRetries) {
            // Retry initialization
            setTimeout(() => {
              initializeSnack();
            }, 2000);
            return;
          }

          // Final fallback: create a working Snack embed URL
          const encodedCode = encodeURIComponent(initialCode);
          const encodedDeps = encodeURIComponent(JSON.stringify(detectedDependencies));
          const fallbackWebUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&code=${encodedCode}&dependencies=${encodedDeps}&sdkVersion=50.0.0&name=${encodeURIComponent('React Native Web Editor')}`;

          console.log('Using final fallback URL:', fallbackWebUrl);
          setWebPreviewUrl(fallbackWebUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize Snack:', err);

        if (initializationAttempts.current < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.pow(2, initializationAttempts.current) * 1000;
          console.log(`Retrying Snack initialization in ${delay}ms...`);
          setTimeout(() => {
            initializeSnack();
          }, delay);
          return;
        }

        setError(err.message || 'Failed to initialize Snack');
        setIsLoading(false);

        // Even on error, provide a fallback URL
        const encodedCode = encodeURIComponent(initialCode);
        const fallbackWebUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&code=${encodedCode}&sdkVersion=50.0.0&name=${encodeURIComponent('React Native Web Editor')}`;
        setWebPreviewUrl(fallbackWebUrl);
      }
    };

    // Reset attempts counter and initialize
    initializationAttempts.current = 0;
    initializeSnack();

    // Cleanup function
    return () => {
      if (snackRef.current) {
        console.log('Cleaning up Snack...');
        try {
          snackRef.current.setOnline(false);
        } catch (err) {
          console.warn('Error during Snack cleanup:', err);
        }
      }
    };
  }, [initialCode, detectDependencies]);

  // Enhanced updateCode function with dependency detection
  const updateCode = useCallback(async (newCode) => {
    if (!snack) {
      console.warn('Snack not initialized, cannot update code');
      return;
    }

    try {
      setError(null);

      // Detect new dependencies
      const newDependencies = detectDependencies(newCode);
      const currentDependencies = snack.getState().dependencies || {};

      // Check if dependencies have changed
      const dependenciesChanged = JSON.stringify(newDependencies) !== JSON.stringify(currentDependencies);

      if (dependenciesChanged) {
        console.log('Dependencies changed, updating:', newDependencies);
        // Update dependencies first
        await snack.updateDependencies(newDependencies);
      }

      // Update the App.js file with new code
      await snack.updateFiles({
        'App.js': {
          type: 'CODE',
          contents: newCode,
        },
      });

      console.log('Code updated successfully');
    } catch (err) {
      console.error('Failed to update code:', err);
      setError(err.message || 'Failed to update code');
    }
  }, [snack, detectDependencies]);

  // Enhanced uploadFile function
  const uploadFile = useCallback(async (fileName, content) => {
    if (!snack) {
      console.warn('Snack not initialized, cannot upload file');
      return;
    }

    try {
      setError(null);

      // Detect dependencies from the uploaded file content
      const fileDependencies = detectDependencies(content);
      const currentDependencies = snack.getState().dependencies || {};
      const mergedDependencies = { ...currentDependencies, ...fileDependencies };

      // Update dependencies if new ones are detected
      if (Object.keys(fileDependencies).length > 0) {
        console.log('New dependencies detected in uploaded file:', fileDependencies);
        await snack.updateDependencies(mergedDependencies);
      }

      // Add or update the file
      await snack.updateFiles({
        [fileName]: {
          type: 'CODE',
          contents: content,
        },
      });

      console.log(`File ${fileName} uploaded successfully`);
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError(err.message || 'Failed to upload file');
    }
  }, [snack, detectDependencies]);

  // Enhanced saveSnack function
  const saveSnack = useCallback(async () => {
    if (!snack) {
      console.warn('Snack not initialized, cannot save');
      return null;
    }

    try {
      setError(null);
      console.log('Saving Snack...');
      const result = await snack.saveAsync();
      console.log('Snack saved successfully:', result);
      return result;
    } catch (err) {
      console.error('Failed to save snack:', err);
      setError(err.message || 'Failed to save snack');
      return null;
    }
  }, [snack]);

  // Return enhanced hook interface
  return {
    snack,
    isLoading,
    error,
    previewUrl,
    webPreviewUrl,
    isOnline,
    isSaved,
    connectedClients,
    setWebPreviewRef,
    updateCode,
    uploadFile,
    saveSnack,
  };
};
