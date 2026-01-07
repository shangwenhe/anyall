```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
```

## Type Keyboard - Typing Practice Application

### Project Overview
A full-featured typing practice web application built with React 19 and TypeScript. Features structured practice modes, gamified learning experiences, and real-time performance tracking.

### Development Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (output to dist/)
npm run lint         # Run ESLint for code quality
npm run preview      # Preview production build locally
```

### Build System
- **Package Manager**: npm
- **Build Tool**: Vite v7.2.4
- **Compiler**: TypeScript ~5.9.3
- **Language Support**: React 19.2.0 + TypeScript

### Project Structure

```
src/
├── components/          # React Components
│   ├── Keyboard.tsx     # Virtual keyboard visualization
│   ├── KeyboardPractice.tsx  # Keyboard familiarity practice
│   ├── TypingPractice.tsx    # Typing practice with difficulty levels
│   ├── FallingGame.tsx  # Falling characters game (消消乐)
│   ├── TimedGame.tsx    # Timed typing challenge
│   ├── ErrorKeyGame.tsx # Error key focused training
│   ├── Settings.tsx     # Application settings
│   └── *.css            # Component-specific styles
├── utils/               # Utility functions
│   ├── storage.ts       # LocalStorage management
│   └── typing.ts        # Typing statistics calculations
├── constants.ts         # Keyboard layout, word lists, text content
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component with routing
├── App.css              # Global styles
├── index.css            # Base styles and reset
└── main.tsx             # Application entry point

public/                  # Static assets
dist/                    # Production build output
```

### Core Features

#### Practice Modes:
1. **Keyboard Familiarity**: Learn keyboard layout by regions (left/right hand, numbers, symbols)
2. **Typing Practice**: Three difficulty levels (beginner/intermediate/advanced) with real-time WPM and accuracy tracking
3. **Custom Practice**: Enter any text to practice

#### Game Modes:
1. **Falling Characters**: Arcade-style game where characters fall from top - type to eliminate them
2. **Timed Challenge**: 1 or 3 minute typing speed challenges
3. **Error Key Training**: Focused practice on frequently mistyped keys

#### Data & Statistics:
- Real-time WPM (Words Per Minute) calculation
- Accuracy percentage tracking
- Error key frequency analysis
- Practice history (last 10 records)
- Game high scores
- Progress saved to localStorage

### Key Files and Their Purpose

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component managing state and rendering |
| `src/constants.ts` | Keyboard layout, word lists, practice text, settings defaults |
| `src/types.ts` | TypeScript type definitions for all data structures |
| `src/utils/storage.ts` | localStorage wrapper for managing application data |
| `src/utils/typing.ts` | Typing calculation utilities (WPM, accuracy, content generation) |
| `src/components/Keyboard.tsx` | Virtual keyboard UI component |

### Data Storage
All user data is stored locally in the browser using localStorage:
- `type-keyboard-practice-records`: Practice history (last 10 records)
- `type-keyboard-game-scores`: Game high scores
- `type-keyboard-error-keys`: Error key frequency stats
- `type-keyboard-settings`: User preferences

### Architecture Highlights
- Component-based architecture with clear separation of concerns
- State management using React hooks (useState)
- Type safety through comprehensive TypeScript definitions
- Responsive design with CSS media queries
- LocalStorage wrapper providing type-safe data access
- Stateless utility functions for calculations and content generation
- Component styling with CSS modules approach
