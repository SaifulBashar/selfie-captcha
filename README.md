# Selfie CAPTCHA

A custom CAPTCHA component that uses a selfie camera stream with shape and color recognition for human verification.

## Prerequisites

- **Node.js** 16+
- **npm** 7+
- Modern browser with camera access support (Chrome, Firefox, Safari, Edge)

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Access the app at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

## Testing

Run tests:

```bash
npm test
```

Run tests once:

```bash
npm test -- --run
```

## Features

- **Camera Stream**: Real-time video from user's webcam
- **Moving Square Overlay**: Randomized position tracking on camera feed
- **5x5 Grid Selection**: 25 cells with watermark identification
- **Watermarks**: Three shapes (triangle, square, circle) with three colors (red, green, blue)
- **Attempt Limiting**: 3 attempts with decreasing tolerance (100% → 85% → 70%)
- **Progressive Strictness**: Each failed attempt increases validation difficulty

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## Browser Requirements

- Camera permission must be granted
- Modern JavaScript support (ES2020+)
- Canvas API support
