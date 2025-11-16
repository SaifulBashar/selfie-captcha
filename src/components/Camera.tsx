import React from 'react';
import Button from './Button';
/**
 * Displays the camera feed with a moving green square overlay.
 *
 * - Shows live video from the user's camera
 * - Displays a moving green square that the user must keep their face in
 * - Shows a loading message while requesting camera permission
 * - Provides a button to capture the image and continue
 *
 * @param {Object} props - Component props
 * @param {React.RefObject} props.videoRef - Reference to the video element
 * @param {Object} props.rectPos - Position of the green square overlay
 * @param {number} props.rectPos.x - X coordinate in pixels
 * @param {number} props.rectPos.y - Y coordinate in pixels
 * @param {number} props.SQUARE_SIZE - Size of the square in pixels
 * @param {boolean} props.hasPermission - Whether camera permission is granted
 * @param {string | null} props.error - Error message if camera access failed
 * @param {Function} props.onContinue - Callback when user clicks the Continue button
 */
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
