# React Native Web View

A modern web application that allows users to write React Native code and preview it live with mobile simulation. This application provides a split-screen interface with a code editor on the left and a live mobile preview on the right.

## 🚀 Live Demo

**[Try it live on Vercel →](https://react-native-web-view.vercel.app)**

## 📱 Features Overview

- **Live Mobile Preview**: See your React Native code running in a realistic mobile phone frame
- **Real-time Code Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Mobile Phone Simulation**: Beautiful iPhone-style preview container
- **File Upload**: Drag and drop React Native files
- **QR Code Generation**: Test on real devices with Expo Go
- **Responsive Design**: Works on desktop and mobile browsers

## Features

### ✅ Implemented Features

1. **Code Editor Interface**
   - Monaco Editor with syntax highlighting for JavaScript/React Native
   - Auto-completion and error detection
   - Dark/light theme toggle
   - Real-time code editing

2. **Live Preview System**
   - **Mobile Phone Simulation**: Beautiful mobile phone frame that simulates how the app looks on a real device
   - **Web Preview**: Full-screen web preview mode
   - **Expo Snack Integration**: Uses Expo Snack SDK for real-time preview
   - **Fallback System**: Working demo preview when Snack SDK is not available

3. **File Upload System**
   - Drag-and-drop file upload
   - Support for .js, .jsx, .ts, .tsx files
   - File content parsing and validation

4. **Mobile Device Testing**
   - QR code generation for testing on real devices
   - Expo Go app integration instructions
   - Real QR codes that can be scanned

5. **User Experience**
   - Split-pane layout with resizable panels
   - Error handling and display
   - Loading states and feedback
   - Save/share functionality
   - Debug panel for development

6. **Modern UI**
   - Responsive design
   - Clean, intuitive interface
   - Professional mobile phone frame design
   - Smooth animations and transitions

## Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Code Editor**: Monaco Editor (VS Code editor)
- **Expo Integration**: Snack SDK 6.5.0
- **UI Components**: Lucide React icons
- **Styling**: Custom CSS with modern design
- **QR Code Generation**: qrcode library
- **File Upload**: react-dropzone
- **Layout**: react-split for resizable panels

## 🚀 Quick Start

### Option 1: Use the Live Demo
Visit **[react-native-web-view.vercel.app](https://react-native-web-view.vercel.app)** to start coding immediately!

### Option 2: Run Locally

#### Prerequisites
- Node.js 16+
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/somdipto/react-native-web-view.git
cd react-native-web-view
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

#### Build for Production
```bash
npm run build
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to [Vercel](https://vercel.com)
3. Import the repository
4. Deploy automatically!

### Deploy to Netlify

1. Fork this repository
2. Connect to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

## Usage

1. **Writing Code**: Use the Monaco editor on the left to write React Native code
2. **Live Preview**: See your app running in real-time in the preview panel
3. **Mobile Simulation**: Toggle to "Mobile" mode to see how your app looks on a phone
4. **File Upload**: Drag and drop React Native files to import them
5. **Device Testing**: Use the QR code to test on your physical device with Expo Go
6. **Save & Share**: Save your Snack and share it with others

## Architecture

### Key Components

- `App.jsx` - Main application component with split layout
- `CodeEditor.jsx` - Monaco editor wrapper with React Native syntax highlighting
- `SnackPreview.jsx` - Preview panel with mobile/web toggle
- `WorkingSnackPreview.jsx` - Expo Snack integration component
- `QRCodeGenerator.jsx` - QR code generation for mobile testing
- `useSnack.js` - Custom hook for Snack SDK integration

### Preview System

The application implements a robust preview system:

1. **Primary**: Expo Snack SDK integration for real-time React Native preview
2. **Fallback**: Demo Snack embed when SDK is not available
3. **Mobile Frame**: CSS-based mobile phone simulation
4. **Error Handling**: Comprehensive error states and retry mechanisms

## Development Notes

### Expo Snack SDK Integration

The application integrates with Expo Snack SDK to provide real-time React Native preview. Due to authentication requirements for creating new Snacks, the current implementation uses a demo Snack for preview purposes. In a production environment, you would need to:

1. Implement Expo authentication
2. Create new Snacks via the Expo API
3. Handle Snack lifecycle management

### Mobile Phone Simulation

The mobile preview includes a realistic phone frame with:
- Rounded corners and bezels
- Home indicator (iPhone-style)
- Proper aspect ratio
- Touch-friendly interface

## Future Enhancements

- [ ] Real-time code synchronization with Expo Snack
- [ ] Multiple file support and project structure
- [ ] Dependency management interface
- [ ] Export to Expo project
- [ ] Collaborative editing
- [ ] Code templates and examples
- [ ] Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
