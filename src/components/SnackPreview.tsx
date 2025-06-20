import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Smartphone, Monitor, Tablet, RefreshCw, ChevronDown } from 'lucide-react';

interface SnackPreviewProps {
  code: string;
  dependencies?: string;
  name?: string;
  description?: string;
  theme?: 'light' | 'dark';
  platform?: 'web' | 'ios' | 'android' | 'mydevice';
  sdkVersion?: string;
}

const SnackPreview: React.FC<SnackPreviewProps> = ({
  code,
  dependencies = '',
  name = 'React Native Playground',
  description = 'Live React Native code preview',
  theme = 'light',
  platform = 'web',
  sdkVersion = '49.0.0'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [error, setError] = useState<string | null>(null);
  const [selectedIOSDevice, setSelectedIOSDevice] = useState('iphone15pro');
  const [selectedAndroidDevice, setSelectedAndroidDevice] = useState('pixel8');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const snackIdRef = useRef<string>('');

  const platformIcons = {
    web: Monitor,
    ios: Smartphone,
    android: Tablet,
    mydevice: Smartphone
  };

  const platformColors = {
    web: 'bg-blue-500',
    ios: 'bg-gray-800',
    android: 'bg-green-600',
    mydevice: 'bg-purple-600'
  };

  const iosDevices = [
    { value: 'iphone16promax', label: 'iPhone 16 Pro Max' },
    { value: 'iphone16pro', label: 'iPhone 16 Pro' },
    { value: 'iphone15promax', label: 'iPhone 15 Pro Max' },
    { value: 'iphone15pro', label: 'iPhone 15 Pro' },
    { value: 'iphone14promax', label: 'iPhone 14 Pro Max' },
    { value: 'iphone14pro', label: 'iPhone 14 Pro' },
    { value: 'iphone13promax', label: 'iPhone 13 Pro Max' },
    { value: 'iphone13pro', label: 'iPhone 13 Pro' },
    { value: 'iphone12', label: 'iPhone 12' },
    { value: 'iphone11pro', label: 'iPhone 11 Pro' },
    { value: 'iphone8plus', label: 'iPhone 8+' },
    { value: 'iphone8', label: 'iPhone 8' },
    { value: 'ipadpro129inch5thgeneration', label: 'iPad Pro 12.9"' },
    { value: 'ipadair4thgeneration', label: 'iPad Air' },
    { value: 'ipad9thgeneration', label: 'iPad' },
    { value: 'ipadmini6thgeneration', label: 'iPad Mini' }
  ];

  const androidDevices = [
    { value: 'pixel9xl', label: 'Pixel 9 XL' },
    { value: 'pixel9pro', label: 'Pixel 9 Pro' },
    { value: 'pixel8pro', label: 'Pixel 8 Pro' },
    { value: 'pixel8', label: 'Pixel 8' },
    { value: 'pixel7pro', label: 'Pixel 7 Pro' },
    { value: 'pixel7', label: 'Pixel 7' },
    { value: 'pixel6pro', label: 'Pixel 6 Pro' },
    { value: 'pixel6', label: 'Pixel 6' },
    { value: 'pixel4xl', label: 'Pixel 4 XL' },
    { value: 'pixel4', label: 'Pixel 4' },
    { value: 'pixeltablet', label: 'Pixel Tablet' },
    { value: 'galaxytabs7', label: 'Galaxy Tab S7' },
    { value: 'nexus5', label: 'Nexus 5' }
  ];

  const refreshPreview = () => {
    setIsLoading(true);
    setError(null);
    updateSnack();
  };

  const updateSnack = () => {
    if (!containerRef.current) return;

    try {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create new div for Snack embed
      const snackDiv = document.createElement('div');
      snackIdRef.current = `snack-${Date.now()}`;
      snackDiv.id = snackIdRef.current;
      
      // Encode the code for URL
      const encodedCode = encodeURIComponent(code);
      const encodedName = encodeURIComponent(name);
      const encodedDescription = encodeURIComponent(description);
      
      // Set data attributes for Snack embedding
      snackDiv.setAttribute('data-snack-code', encodedCode);
      snackDiv.setAttribute('data-snack-name', encodedName);
      snackDiv.setAttribute('data-snack-description', encodedDescription);
      snackDiv.setAttribute('data-snack-dependencies', dependencies);
      snackDiv.setAttribute('data-snack-platform', currentPlatform);
      snackDiv.setAttribute('data-snack-theme', theme);
      snackDiv.setAttribute('data-snack-sdk-version', sdkVersion);
      snackDiv.setAttribute('data-snack-preview', 'true');
      snackDiv.setAttribute('data-snack-loading', 'eager');
      snackDiv.setAttribute('data-snack-supported-platforms', 'ios,android,web');
      snackDiv.setAttribute('data-snack-device-ios', selectedIOSDevice);
      snackDiv.setAttribute('data-snack-device-android', selectedAndroidDevice);
      snackDiv.setAttribute('data-snack-device-frame', 'true');
      snackDiv.setAttribute('data-snack-device-ios-scale', '75');
      snackDiv.setAttribute('data-snack-device-android-scale', '75');
      
      // Style the container to match official Expo embed examples
      snackDiv.style.cssText = `
        overflow: hidden;
        background: ${theme === 'dark' ? '#1a1a1a' : '#fafafa'};
        border: 1px solid ${theme === 'dark' ? '#333' : 'rgba(0,0,0,.08)'};
        border-radius: 4px;
        height: 100%;
        width: 100%;
        min-height: 505px;
      `;
      
      containerRef.current.appendChild(snackDiv);
      
      // Load the Snack embed script with improved handling
      const loadSnackScript = () => {
        return new Promise((resolve, reject) => {
          const existingScript = document.querySelector('script[src="https://snack.expo.dev/embed.js"]');
          
          if (existingScript) {
            // If script already exists, just resolve immediately
            resolve(true);
            return;
          }
          
          const script = document.createElement('script');
          script.src = 'https://snack.expo.dev/embed.js';
          script.async = true;
          
          const timeoutId = setTimeout(() => {
            reject(new Error('Script loading timeout'));
          }, 10000); // 10 second timeout
          
          script.onload = () => {
            clearTimeout(timeoutId);
            // Wait a bit for the script to initialize
            setTimeout(() => resolve(true), 500);
          };
          
          script.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('Failed to load Expo Snack embed script'));
          };
          
          document.head.appendChild(script);
        });
      };
      
      loadSnackScript()
        .then(() => {
          setError(null);
          setIsLoading(false);
        })
        .catch((err) => {
          let errorMessage = `Failed to load Expo Snack: ${err.message}`;
          
          if (currentPlatform === 'ios' || currentPlatform === 'android') {
            errorMessage += ` Mobile preview requires a stable internet connection and may take longer to load. Try switching to web platform or refreshing the preview.`;
          }
          
          setError(errorMessage);
          setIsLoading(false);
        });
      
    } catch (err) {
      setError('Error creating Snack preview: ' + (err as Error).message);
      setIsLoading(false);
    }
  };

  const changePlatform = (newPlatform: typeof platform) => {
    setCurrentPlatform(newPlatform);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (showDeviceSelector) {
      const target = event.target as Element;
      if (!target.closest('.device-selector')) {
        setShowDeviceSelector(false);
      }
    }
  };

  // React to prop and state changes to refresh the preview
  useEffect(() => {
    updateSnack();
  }, [code, currentPlatform, selectedIOSDevice, selectedAndroidDevice, sdkVersion]);

  // Close device selector when clicking outside
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDeviceSelector]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center space-x-2 p-2 border-b border-gray-200">
        {/* Device Selector */}
        <div className="relative device-selector">
          <button
            onClick={() => setShowDeviceSelector(!showDeviceSelector)}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            title="Select Device"
          >
            <span>
              {currentPlatform === 'ios' 
                ? iosDevices.find(d => d.value === selectedIOSDevice)?.label
                : androidDevices.find(d => d.value === selectedAndroidDevice)?.label
              }
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showDeviceSelector && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-32">
              {(currentPlatform === 'ios' ? iosDevices : androidDevices).map((device) => (
                <button
                  key={device.value}
                  onClick={() => {
                    if (currentPlatform === 'ios') {
                      setSelectedIOSDevice(device.value);
                    } else {
                      setSelectedAndroidDevice(device.value);
                    }
                    setShowDeviceSelector(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {device.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Platform Selector */}
        <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-200">
          {Object.entries(platformIcons).map(([platformKey, Icon]) => (
            <button
              key={platformKey}
              onClick={() => changePlatform(platformKey as typeof platform)}
              className={`p-2 rounded-md transition-all ${
                currentPlatform === platformKey
                  ? `${platformColors[platformKey as keyof typeof platformColors]} text-white shadow-sm`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={`Switch to ${platformKey}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Loading Expo Snack...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="flex flex-col items-center space-y-3 text-center max-w-md px-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Preview Error</h3>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={refreshPreview}
                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default SnackPreview;