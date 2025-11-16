import React from 'react';
import Button from './Button';

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  rectPos: { x: number; y: number };
  SQUARE_SIZE: number;
  hasPermission: boolean;
  error: string | null;
  onContinue: () => void;
}

export const Camera = ({
  videoRef,
  rectPos,
  SQUARE_SIZE,
  hasPermission,
  error,
  onContinue,
}: CameraProps) => {
  return (
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
        <Button fullWidth onClick={onContinue}>
          Continue
        </Button>
      </div>
    </>
  );
};
