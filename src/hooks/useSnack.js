import { useState, useEffect, useRef, useCallback } from 'react';
import { Snack } from 'snack-sdk';

// Pure Snack SDK hook - no manual component conversion
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
  const maxRetries = 2; // Reduced retries for faster feedback

  // Enhanced dependency detection from code
  const detectDependencies = useCallback((code) => {
    const dependencies = {};

    // Common React Native and Expo dependencies that work well with Snack
    const dependencyPatterns = [
      { pattern: /from\s+['"]@expo\/vector-icons/, dep: '@expo/vector-icons', version: '~13.0.0' },
      { pattern: /from\s+['"]expo-camera/, dep: 'expo-camera', version: '~13.4.4' },
      { pattern: /from\s+['"]expo-location/, dep: 'expo-location', version: '~16.1.0' },
      { pattern: /from\s+['"]expo-constants/, dep: 'expo-constants', version: '~14.4.2' },
      { pattern: /from\s+['"]expo-linear-gradient/, dep: 'expo-linear-gradient', version: '~12.3.0' },
      { pattern: /from\s+['"]expo-font/, dep: 'expo-font', version: '~11.4.0' },
      { pattern: /from\s+['"]expo-asset/, dep: 'expo-asset', version: '~8.10.1' },
      { pattern: /from\s+['"]react-native-gesture-handler/, dep: 'react-native-gesture-handler', version: '~2.12.0' },
      { pattern: /from\s+['"]react-native-reanimated/, dep: 'react-native-reanimated', version: '~3.3.0' },
      { pattern: /from\s+['"]@react-navigation\/native/, dep: '@react-navigation/native', version: '^6.0.0' },
      { pattern: /from\s+['"]@react-navigation\/stack/, dep: '@react-navigation/stack', version: '^6.0.0' },
      { pattern: /from\s+['"]react-native-safe-area-context/, dep: 'react-native-safe-area-context', version: '4.6.3' },
      { pattern: /from\s+['"]react-native-screens/, dep: 'react-native-screens', version: '~3.22.0' },
    ];

    dependencyPatterns.forEach(({ pattern, dep, version }) => {
      if (pattern.test(code)) {
        dependencies[dep] = version;
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

        // Proper Snack SDK configuration for reliable web preview
        const snackConfig = {
          files: {
            'App.js': {
              type: 'CODE',
              contents: initialCode,
            },
          },
          dependencies: detectedDependencies,
          sdkVersion: '49.0.0', // Use stable SDK version that works reliably with web
          name: 'React Native Web Editor',
          description: 'Live React Native preview powered by Expo Snack SDK',
        };

        console.log('Creating Snack with enhanced config:', snackConfig);
        const newSnack = new Snack(snackConfig);

        snackRef.current = newSnack;
        setSnack(newSnack);

        // Enhanced state listener with proper error handling
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

          // Handle URL updates with validation
          if (state.url && state.url !== prevState?.url) {
            console.log('Preview URL updated:', state.url);
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL && state.webPreviewURL !== prevState?.webPreviewURL) {
            console.log('Web preview URL updated:', state.webPreviewURL);
            setWebPreviewUrl(state.webPreviewURL);
          }

          // Clear errors when state is healthy
          if (state.online && !state.errors?.length && !state.error) {
            setError(null);
          }

          // Handle errors with better messaging
          if (state.errors && state.errors.length > 0) {
            const errorMessage = state.errors.map(e => e.message || e.toString()).join(', ');
            console.error('Snack errors:', state.errors);
            setError(`Snack SDK Error: ${errorMessage}`);
          } else if (state.error && state.error !== prevState?.error) {
            console.error('Snack error:', state.error);
            setError(`Snack Error: ${state.error}`);
          }
        };

        newSnack.addStateListener(stateListener);

        // Set the snack online to get URLs
        console.log('Setting Snack online...');
        await newSnack.setOnline(true);

        // Wait for Snack to be ready with proper timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Snack SDK initialization timeout after 20 seconds')), 20000)
        );

        try {
          // Wait for initial state with longer timeout for Snack SDK
          const state = await Promise.race([
            newSnack.getStateAsync(),
            timeoutPromise
          ]);

          console.log('Initial snack state:', state);

          // Set initial URLs if available
          if (state.url) {
            console.log('Got Snack URL:', state.url);
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL) {
            console.log('Got web preview URL:', state.webPreviewURL);
            setWebPreviewUrl(state.webPreviewURL);
          }

          // If no web preview URL, wait a bit more for it to be generated
          if (!state.webPreviewURL && state.url) {
            console.log('Waiting for web preview URL to be generated...');

            // Wait up to 10 more seconds for web preview URL
            let attempts = 0;
            const maxWaitAttempts = 20; // 10 seconds (500ms * 20)

            const waitForWebPreview = async () => {
              while (attempts < maxWaitAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const currentState = newSnack.getState();

                if (currentState.webPreviewURL) {
                  console.log('Web preview URL generated:', currentState.webPreviewURL);
                  setWebPreviewUrl(currentState.webPreviewURL);
                  break;
                }
                attempts++;
              }

              // If still no web preview URL, create fallback
              if (attempts >= maxWaitAttempts && !newSnack.getState().webPreviewURL) {
                console.log('Creating fallback web preview URL...');
                const snackId = state.url.split('/').pop();
                const fallbackUrl = `https://snack.expo.dev/embedded/@snack/${snackId}?preview=true&platform=web&theme=light`;
                console.log('Fallback URL:', fallbackUrl);
                setWebPreviewUrl(fallbackUrl);
              }
            };

            waitForWebPreview();
          }

          setIsLoading(false);
          console.log('Snack SDK initialization completed successfully');

        } catch (timeoutError) {
          console.warn('Snack SDK initialization timed out:', timeoutError.message);

          if (initializationAttempts.current < maxRetries) {
            console.log(`Retrying Snack initialization (attempt ${initializationAttempts.current + 1}/${maxRetries})`);
            setTimeout(() => {
              initializeSnack();
            }, 3000);
            return;
          }

          // Create a direct Snack embed URL as final fallback
          console.log('Creating direct Snack embed URL as fallback...');
          const fallbackWebUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&name=${encodeURIComponent('React Native Web Editor')}&sdkVersion=49.0.0`;

          console.log('Using final fallback URL:', fallbackWebUrl);
          setWebPreviewUrl(fallbackWebUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize Snack SDK:', err);

        if (initializationAttempts.current < maxRetries) {
          // Retry with exponential backoff
          const delay = Math.pow(2, initializationAttempts.current) * 2000;
          console.log(`Retrying Snack SDK initialization in ${delay}ms...`);
          setTimeout(() => {
            initializeSnack();
          }, delay);
          return;
        }

        setError(`Snack SDK initialization failed: ${err.message || 'Unknown error'}`);
        setIsLoading(false);

        // Provide a working fallback URL that doesn't require Snack SDK
        console.log('Creating fallback Snack embed URL...');
        const fallbackWebUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&theme=light&name=${encodeURIComponent('React Native Web Editor')}&sdkVersion=49.0.0`;
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
