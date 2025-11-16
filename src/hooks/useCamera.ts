import { useEffect, useRef, useState } from 'react';

/**
 * Hook for managing camera access and video stream.
 *
 * - Requests camera permission from the user
 * - Sets up the video stream with ideal resolution of 1280x720
 * - Stops the camera stream when component unmounts
 * - Returns video reference, permission status, and error message if any
 *
 * @returns {Object} Object containing:
 *   - videoRef: Ref to attach to the video element
 *   - hasPermission: Boolean indicating if camera permission is granted
 *   - error: Error message if camera access failed
 */
const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        setStream(mediaStream);
        setHasPermission(true);
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

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, hasPermission, error };
};

export default useCamera;
