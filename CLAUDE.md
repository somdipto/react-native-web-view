# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Native Web Viewer** - an interactive playground that allows users to edit React Native code in a Monaco editor and see live previews powered by Expo Snack. It's built with React, TypeScript, Vite, and Tailwind CSS.

## Development Commands

```bash
# Install dependencies and start development server
pnpm run dev

# Build the project
pnpm run build

# Run linting
pnpm run lint

# Preview the built project
pnpm run preview
```

All scripts automatically run `pnpm install` first to ensure dependencies are installed.

## Architecture Overview

The application uses a **split-panel layout** with:

### Core Components
- **App.tsx**: Main application container with header, settings panel, and resizable panels
- **CodeEditor.tsx**: Monaco editor component with React Native syntax highlighting and IntelliSense
- **SnackPreview.tsx**: Embedded Expo Snack preview with platform switching and device selection
- **ErrorBoundary.tsx**: React error boundary for graceful error handling

### Key Features
- **Live Code Editing**: Monaco editor with React Native type definitions and formatting
- **Multi-Platform Preview**: Web, iOS, and Android preview modes via Expo Snack
- **Device Selection**: Device-specific rendering for iOS and Android platforms
- **Theme Support**: Light/dark theme switching
- **Dependency Management**: UI for adding common React Native packages
- **Code Sharing**: Export to Expo Snack, copy code, and download functionality

### Technical Stack
- **Build Tool**: Vite with React plugin
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Code Editor**: Monaco Editor with React Native syntax support
- **Preview**: Expo Snack embedded iframe
- **Layout**: React Resizable Panels for split view

### Key Dependencies
- `@monaco-editor/react`: Code editor component
- `react-resizable-panels`: Split panel layout
- `@radix-ui/*`: UI component primitives used by shadcn/ui
- `lucide-react`: Icon library

## Important Implementation Details

### Snack Preview Integration
- Uses Expo Snack's embed.js script for live preview
- Dynamically creates iframe with encoded React Native code
- Supports platform switching (web/iOS/Android) and device selection
- Includes debounced updates (1 second delay) to avoid excessive API calls

### Monaco Editor Configuration
- Custom React Native type definitions for IntelliSense
- Configured with bracket pair colorization, folding, and formatting
- JavaScript/TypeScript compiler options optimized for React Native

### State Management
- Uses React hooks with local state (no global state management)
- Code changes are propagated from editor to preview with debouncing
- Theme and platform preferences stored in component state

## File Structure Notes
- `/src/components/ui/`: shadcn/ui component library (extensive collection of UI primitives)
- `/src/hooks/`: Custom React hooks for mobile detection and toast notifications
- `/src/lib/utils.ts`: Utility functions for className merging and common operations