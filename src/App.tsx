import { useEffect, useState } from 'react';

import { Result } from './components/Result';
import { GridSelection } from './components/GridSelection';
import type { GridCell, WatermarkShape } from './type';
import useCamera from './hooks/useCamera';
import { Camera } from './components/Camera';
import { SQUARE_SIZE } from './constants';
import { generateGrid } from './utils/generateGrid';

function getRandomPosition(videoWidth: number, videoHeight: number, rectSize: number) {
  const maxX = Math.max(0, videoWidth - rectSize);
  const maxY = Math.max(0, videoHeight - rectSize);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  return { x, y };
}

function App() {
  const { error, hasPermission, videoRef } = useCamera();
  const [boxPosition, setBoxPosition] = useState({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [step, setStep] = useState<'camera' | 'grid' | 'result'>('camera');
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  const [targetShape, setTargetShape] = useState<WatermarkShape>(null);
  const [lockedSquarePos, setLockedSquarePos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  const [validationResult, setValidationResult] = useState<'success' | 'failed' | null>(null);

  const toggleCellSelection = (cellId: number) => {
    setGridCells((prev) =>
      prev.map((cell) => (cell.id === cellId ? { ...cell, selected: !cell.selected } : cell))
    );
  };

  const handleValidate = () => {
    const correctCells = gridCells.filter(
      (cell) => cell.watermark === targetShape.shape && cell.color === targetShape.color
    );
    const correctCellIds = new Set(correctCells.map((cell) => cell.id));

    const selectedCells = gridCells.filter((cell) => cell.selected);
    const selectedCellIds = new Set(selectedCells.map((cell) => cell.id));

    const allCorrectSelected = correctCells.every((cell) => selectedCellIds.has(cell.id));
    const noIncorrectSelected = selectedCells.every((cell) => correctCellIds.has(cell.id));

    const result =
      allCorrectSelected && noIncorrectSelected && correctCells.length > 0 ? 'success' : 'failed';

    setValidationResult(result);
    setStep('result');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const captureImageWithSquare = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL('image/png');

    // Get the actual rendered video dimensions for proper scaling
    const videoElementRect = videoRef.current.getBoundingClientRect();

    const scaleX = videoWidth / videoElementRect.width;
    const scaleY = videoHeight / videoElementRect.height;

    // Store the locked square position with scaling
    const scaledSquarePos = {
      x: boxPosition.x * scaleX,
      y: boxPosition.y * scaleY,
      width: SQUARE_SIZE * scaleX,
      height: SQUARE_SIZE * scaleY,
    };

    // Store video dimensions for later use
    setVideoDimensions({ width: videoWidth, height: videoHeight });
    setCapturedImage(imageData);
    setLockedSquarePos(scaledSquarePos);

    // Generate grid and target shape
    const { cells, target } = generateGrid();
    setGridCells(cells);
    setTargetShape(target);

    // Move to grid step
    setStep('grid');
  };

  const handleContinue = () => {
    setIsMoving(false);
    captureImageWithSquare();
  };
  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Only update position if video has valid dimensions
        if (width > 0 && height > 0) {
          setBoxPosition(getRandomPosition(width, height, SQUARE_SIZE));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMoving, videoRef]);

  const mainDisplay = {
    grid: (
      <GridSelection
        capturedImage={capturedImage}
        gridCells={gridCells}
        targetShape={targetShape}
        lockedSquarePos={lockedSquarePos}
        videoDimensions={videoDimensions}
        onToggleCell={toggleCellSelection}
        onValidate={handleValidate}
      />
    ),
    result: <Result handleRetry={handleRetry} validationResult={validationResult!} />,
    camera: (
      <Camera
        videoRef={videoRef}
        rectPos={boxPosition}
        SQUARE_SIZE={SQUARE_SIZE}
        hasPermission={hasPermission}
        error={error}
        onContinue={handleContinue}
      />
    ),
  };

  return (
    <section className="max-w-3xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">CAPTCHA Verification</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div>{mainDisplay[step] ?? null}</div>
      </div>
    </section>
  );
}

export default App;
