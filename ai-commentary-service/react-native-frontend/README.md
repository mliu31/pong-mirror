# Beer Pong Commentary React Native Frontend

React Native components for the Beer Pong Commentary app that connects to the FastAPI backend.

## Overview

This directory contains React Native components that you can copy to your separate React Native repository. The components are designed to work with the Beer Pong Commentary API backend.

## Components

### Core Components

- `BeerPongGame.js` - Main game component
- `GameBoard.js` - Visual game board with players and cups
- `CommentaryBox.js` - Commentary display component
- `GameControls.js` - Action buttons and controls
- `GameStats.js` - Game statistics display

### Services

- `ApiService.js` - API client for backend communication
- `GameService.js` - Game logic and state management

### Utilities

- `constants.js` - Game constants and configuration
- `types.js` - TypeScript type definitions (if using TypeScript)

## Setup Instructions

1. **Copy these files to your React Native project**
2. **Install required dependencies** (see package.json below)
3. **Configure API endpoint** in `ApiService.js`
4. **Import and use `BeerPongGame` component** in your app

## Required Dependencies

Add these to your React Native project's `package.json`:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.72.0",
    "react-native-svg": "^13.0.0",
    "react-native-vector-icons": "^10.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0"
  }
}
```

## Configuration

Update the API endpoint in `ApiService.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:8000';
```

For development with local backend:

- iOS Simulator: `http://localhost:8000`
- Android Emulator: `http://10.0.2.2:8000`
- Physical device: `http://YOUR_COMPUTER_IP:8000`

## Usage

```javascript
import React from 'react';
import { View } from 'react-native';
import BeerPongGame from './components/BeerPongGame';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <BeerPongGame />
    </View>
  );
}
```

## Features

- **Interactive Game Board**: Touch players and cups to interact
- **Real-time Commentary**: AI-generated commentary updates
- **Game State Management**: Track scores and cup status
- **Action Controls**: Serve, rally, hit, and sink actions
- **Game Log Loading**: Load pre-recorded games for testing
- **Responsive Design**: Works on phones and tablets

## API Integration

The components automatically handle:

- Game creation and management
- Action submission
- Commentary fetching
- Error handling
- Loading states

## Customization

You can customize:

- Colors and styling in each component
- Game board layout and cup positions
- Commentary display format
- Action button layout
- Team names and player identifiers

## File Structure

```
react-native-frontend/
├── components/
│   ├── BeerPongGame.js
│   ├── GameBoard.js
│   ├── CommentaryBox.js
│   ├── GameControls.js
│   └── GameStats.js
├── services/
│   ├── ApiService.js
│   └── GameService.js
├── utils/
│   ├── constants.js
│   └── types.js
├── styles/
│   └── gameStyles.js
└── README.md
```

## Notes

- Components use React Hooks for state management
- Designed for React Native 0.72+
- Compatible with Expo and bare React Native projects
- Includes error handling and loading states
- Optimized for mobile touch interactions
