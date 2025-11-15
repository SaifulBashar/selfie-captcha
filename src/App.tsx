import { useEffect, useRef, useState } from 'react';
import Button from './components/Button';
import { Result } from './components/Result';
import { GridSelection } from './components/GridSelection';

function getRandomPosition(videoWidth: number, videoHeight: number, rectSize: number) {
  const maxX = Math.max(0, videoWidth - rectSize);
  const maxY = Math.max(0, videoHeight - rectSize);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  return { x, y };
}

const SQUARE_SIZE = 150;
type WatermarkShape = 'triangle' | 'square' | 'circle' | null;

interface GridCell {
  id: number;
  watermark: WatermarkShape;
  selected: boolean;
  rotation: number;
  scale: number;
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [rectPos, setRectPos] = useState({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [step, setStep] = useState<'camera' | 'grid' | 'result'>('camera');
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  const [targetShape, setTargetShape] = useState<WatermarkShape>(null);
  const [lockedSquarePos, setLockedSquarePos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  const [validationResult, setValidationResult] = useState<'success' | 'failed' | null>(null);
  // Generate 5x5 grid with random watermarks
  const generateGrid = () => {
    const shapes: WatermarkShape[] = ['triangle', 'square', 'circle'];
    const cells: GridCell[] = [];

    // Create 25 cells (5x5)
    for (let i = 0; i < 25; i++) {
      cells.push({
        id: i,
        watermark: null,
        selected: false,
        rotation: Math.random() * 20 - 10, // -10 to 10 degrees
        scale: 0.9 + Math.random() * 0.2, // 0.9 to 1.1
      });
    }

    // Randomly select half of the cells (12-13 cells) to have watermarks
    const cellsToMark = Math.floor(cells.length / 2);
    const shuffledIndices = [...Array(25).keys()].sort(() => Math.random() - 0.5);

    for (let i = 0; i < cellsToMark; i++) {
      const cellIndex = shuffledIndices[i];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      cells[cellIndex].watermark = randomShape;
    }

    const target = shapes[Math.floor(Math.random() * shapes.length)];

    return { cells, target };
  };

  const toggleCellSelection = (cellId: number) => {
    setGridCells((prev) =>
      prev.map((cell) => (cell.id === cellId ? { ...cell, selected: !cell.selected } : cell))
    );
  };

  const handleValidate = () => {
    // Get cells with the target shape
    const correctCells = gridCells.filter((cell) => cell.watermark === targetShape);
    const correctCellIds = new Set(correctCells.map((cell) => cell.id));

    // Get selected cells
    const selectedCells = gridCells.filter((cell) => cell.selected);
    const selectedCellIds = new Set(selectedCells.map((cell) => cell.id));

    // Check if all correct cells are selected and no incorrect cells are selected
    const allCorrectSelected = correctCells.every((cell) => selectedCellIds.has(cell.id));
    const noIncorrectSelected = selectedCells.every((cell) => correctCellIds.has(cell.id));

    // Validation passes if both conditions are met
    if (allCorrectSelected && noIncorrectSelected && correctCells.length > 0) {
      setValidationResult('success');
    } else {
      setValidationResult('failed');
    }

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
    const rect = videoRef.current.getBoundingClientRect();
    const scaleX = videoWidth / rect.width;
    const scaleY = videoHeight / rect.height;

    // Store the locked square position with scaling
    const scaledSquarePos = {
      x: rectPos.x * scaleX,
      y: rectPos.y * scaleY,
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
          setRectPos(getRandomPosition(width, height, SQUARE_SIZE));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMoving]);
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request access to the front-facing (selfie) camera
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user', // 'user' for front camera, 'environment' for back
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        setStream(mediaStream);
        setHasPermission(true);

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Failed to access camera. Please grant camera permissions.');
        setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-3xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">CAPTCHA Verification</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'camera' && (
          <>
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-900">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full" />
              <div
                className="absolute pointer-events-none"
                style={{
                  top: rectPos.y,
                  left: rectPos.x,
                  width: SQUARE_SIZE,
                  height: SQUARE_SIZE,
                  border: '3px solid #00ff00',
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                  transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out',
                }}
              />
              {!hasPermission && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                  <p className="text-white">Requesting camera access...</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 'grid' && (
          <GridSelection
            capturedImage={capturedImage}
            gridCells={gridCells}
            targetShape={targetShape}
            lockedSquarePos={lockedSquarePos}
            videoDimensions={videoDimensions}
            onToggleCell={toggleCellSelection}
            onValidate={handleValidate}
          />
        )}

        {step === 'result' && (
          <Result handleRetry={handleRetry} validationResult={validationResult!} />
        )}
      </div>
    </section>
  );
}

export default App;
