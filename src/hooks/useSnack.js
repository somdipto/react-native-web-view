import { useState, useEffect, useRef, useCallback } from 'react';
import { Snack } from 'snack-sdk';

export const useSnack = (initialCode) => {
  const [snack, setSnack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [webPreviewUrl, setWebPreviewUrl] = useState('');
  const snackRef = useRef(null);
  const webPreviewRef = useRef(null);

  // Function to set the web preview iframe reference
  const setWebPreviewRef = useCallback((iframe) => {
    if (iframe && iframe.contentWindow) {
      webPreviewRef.current = iframe.contentWindow;
      console.log('Setting web preview ref:', iframe.contentWindow);

      // If snack is already initialized, try to set the web preview
      if (snackRef.current) {
        try {
          // The Snack SDK might not have a direct setWebPreviewRef method
          // Instead, we need to create a new transport or reinitialize
          console.log('Snack instance available, attempting to set web preview');
        } catch (err) {
          console.warn('Could not set web preview ref:', err);
        }
      }
    }
  }, []);

  useEffect(() => {
    const initializeSnack = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Skip Snack initialization in production to avoid errors
        if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
          console.log('Skipping Snack SDK in production environment');
          setIsLoading(false);
          return;
        }

        console.log('Initializing Snack with code:', initialCode.substring(0, 100) + '...');

        // Create a new Snack instance
        const snackConfig = {
          files: {
            'App.js': {
              type: 'CODE',
              contents: initialCode,
            },
          },
          dependencies: {},
          sdkVersion: '49.0.0', // Use a stable SDK version that supports web preview
          name: 'React Native Web Editor',
          description: 'Created with Expo Snack Web Editor',
        };

        console.log('Creating Snack with config:', snackConfig);
        const newSnack = new Snack(snackConfig);

        snackRef.current = newSnack;
        setSnack(newSnack);

        // Listen for state changes
        const stateListener = (state, prevState) => {
          console.log('Snack state updated:', {
            url: state.url,
            webPreviewURL: state.webPreviewURL,
            online: state.online,
            isSaved: state.isSaved,
            isResolving: state.isResolving,
            connectedClients: Object.keys(state.connectedClients || {}).length
          });

          if (state.url && state.url !== prevState?.url) {
            console.log('Preview URL updated:', state.url);
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL && state.webPreviewURL !== prevState?.webPreviewURL) {
            console.log('Web preview URL updated:', state.webPreviewURL);
            setWebPreviewUrl(state.webPreviewURL);
          }

          if (state.error && state.error !== prevState?.error) {
            console.error('Snack error:', state.error);
            setError(state.error);
          }
        };

        newSnack.addStateListener(stateListener);

        // Set the snack online to get URLs
        newSnack.setOnline(true);

        // Wait for the snack to be ready with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Snack initialization timeout')), 10000)
        );

        try {
          const state = await Promise.race([
            newSnack.getStateAsync(),
            timeoutPromise
          ]);

          console.log('Initial snack state:', state);

          if (state.url) {
            setPreviewUrl(state.url);
          }

          if (state.webPreviewURL) {
            setWebPreviewUrl(state.webPreviewURL);
          }

          // If we don't have a webPreviewURL, try to create one manually
          if (!state.webPreviewURL && state.url) {
            // Create a fallback web preview URL
            const fallbackUrl = `https://snack.expo.dev/embedded/@snack/${state.url.split('/').pop()}?preview=true&platform=web`;
            console.log('Using fallback web preview URL:', fallbackUrl);
            setWebPreviewUrl(fallbackUrl);
          }

          setIsLoading(false);
        } catch (timeoutError) {
          console.warn('Snack initialization timed out, using fallback approach');

          // Fallback: create a direct Snack embed URL
          const fallbackId = 'temp-' + Date.now();
          const fallbackWebUrl = `https://snack.expo.dev/embedded?preview=true&platform=web&name=${encodeURIComponent('React Native Web Editor')}&dependencies=&sdkVersion=49.0.0`;

          setWebPreviewUrl(fallbackWebUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize Snack:', err);
        setError(err.message || 'Failed to initialize Snack');
        setIsLoading(false);
      }
    };

    initializeSnack();

    // Cleanup function
    return () => {
      if (snackRef.current) {
        console.log('Cleaning up Snack...');
        snackRef.current.setOnline(false);
      }
    };
  }, []);

  const updateCode = async (newCode) => {
    if (!snack) return;

    try {
      setError(null);

      // Update the App.js file with new code
      snack.updateFiles({
        'App.js': {
          type: 'CODE',
          contents: newCode,
        },
      });

      // The changes are automatically sent to connected clients
      // No need to manually save for live updates
    } catch (err) {
      console.error('Failed to update code:', err);
      setError(err.message || 'Failed to update code');
    }
  };

  const uploadFile = async (fileName, content) => {
    if (!snack) return;

    try {
      setError(null);

      // Add or update the file
      snack.updateFiles({
        [fileName]: {
          type: 'CODE',
          contents: content,
        },
      });
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError(err.message || 'Failed to upload file');
    }
  };

  const saveSnack = async () => {
    if (!snack) return null;

    try {
      setError(null);
      const result = await snack.saveAsync();
      return result;
    } catch (err) {
      console.error('Failed to save snack:', err);
      setError(err.message || 'Failed to save snack');
      return null;
    }
  };

  return {
    snack,
    isLoading,
    error,
    previewUrl,
    webPreviewUrl,
    setWebPreviewRef,
    updateCode,
    uploadFile,
    saveSnack,
  };
};
