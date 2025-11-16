import { COLOR_MAP } from '../constants';
import type { GridCell, WatermarkColor, WatermarkShape } from '../type';

/**
 * Displays a watermark symbol (triangle, square, or circle) with rotation and scale.
 *
 * @param {Object} props - Component props
 * @param {WatermarkShape} props.shape - The shape to display (triangle, square, or circle)
 * @param {number} [props.opacity=1] - Transparency level from 0 to 1
 * @param {number} props.rotation - Rotation angle in degrees
 * @param {number} props.scale - Size multiplier (0.9 to 1.1)
 * @param {WatermarkColor | null} props.color - Color of the watermark
 */
const Watermark = ({
  shape,
  opacity = 1,
  rotation,
  scale,
  color,
}: {
  shape: Exclude<WatermarkShape, null>;
  opacity?: number;
  rotation: number;
  scale: number;
  color: WatermarkColor | null;
}) => {
  const style: React.CSSProperties = {
    transform: `rotate(${rotation}deg) scale(${scale})`,
    opacity,
    filter: 'blur(0.5px)',
  };
  if (color) {
    style.color = COLOR_MAP[color];
  }
  const content = {
    triangle: '▲',
    square: '■',
    circle: '●',
  };

  return content?.[shape] ? (
    <div style={style} className="text-white text-2xl select-none">
      {content[shape]}
    </div>
  ) : null;
};

interface GridSelectionProps {
  capturedImage: string;
  gridCells: GridCell[];
  targetShape: {
    shape: WatermarkShape;
    color: WatermarkColor;
  } | null;
  lockedSquarePos: { x: number; y: number; width: number; height: number };
  videoDimensions: { width: number; height: number };
  onToggleCell: (cellId: number) => void;
  renderValidate: () => React.ReactNode;
}
/**
 * Displays a 5x5 grid overlay on the captured image for the user to select cells.
 *
 * - Shows the captured selfie with a grid on top
 * - Displays watermarks in each cell
 * - Highlights selected cells in blue
 * - Allows users to click cells to toggle selection
 *
 * @param {Object} props - Component props
 * @param {string} props.capturedImage - Base64 encoded image from camera
 * @param {GridCell[]} props.gridCells - Array of 25 cells with watermark data
 * @param {Object} props.targetShape - The target shape and color to find
 * @param {WatermarkShape} props.targetShape.shape - Target shape (triangle, square, circle)
 * @param {WatermarkColor} props.targetShape.color - Target color
 * @param {Object} props.lockedSquarePos - Position and size of the grid area
 * @param {number} props.lockedSquarePos.x - X coordinate in pixels
 * @param {number} props.lockedSquarePos.y - Y coordinate in pixels
 * @param {number} props.lockedSquarePos.width - Width in pixels
 * @param {number} props.lockedSquarePos.height - Height in pixels
 * @param {Object} props.videoDimensions - Original video dimensions
 * @param {number} props.videoDimensions.width - Video width in pixels
 * @param {number} props.videoDimensions.height - Video height in pixels
 * @param {Function} props.onToggleCell - Callback when a cell is clicked
 * @param {Function} props.renderValidate - Function to render the validate button
 */
export const GridSelection = ({
  capturedImage,
  gridCells,
  targetShape,
  lockedSquarePos,
  videoDimensions,
  onToggleCell,
  renderValidate,
}: GridSelectionProps) => {
  const getShapeLabel = (shape?: WatermarkShape) => {
    if (shape === 'triangle') return 'triangles (▲)';
    if (shape === 'square') return 'squares (■)';
    if (shape === 'circle') return 'circles (●)';
    return '';
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-center text-lg font-semibold mb-4">
          Select all cells containing{' '}
          <span style={{ color: targetShape ? COLOR_MAP[targetShape.color] : '' }}>
            {getShapeLabel(targetShape?.shape)}
          </span>
        </p>

        <div className="relative w-full rounded-lg overflow-hidden">
          <img src={capturedImage} alt="Captured" className="w-full h-auto" />

          {/* Grid overlay on the locked square area */}
          <div
            className="absolute grid grid-cols-5 grid-rows-5 gap-0"
            style={{
              left: `${(lockedSquarePos.x / videoDimensions.width) * 100}%`,
              top: `${(lockedSquarePos.y / videoDimensions.height) * 100}%`,
              width: `${(lockedSquarePos.width / videoDimensions.width) * 100}%`,
              height: `${(lockedSquarePos.height / videoDimensions.height) * 100}%`,
            }}
          >
            {gridCells.map((cell) => (
              <div
                key={cell.id}
                onClick={() => onToggleCell(cell.id)}
                className={`
                  border border-white/80 cursor-pointer
                  flex items-center justify-center
                  transition-all duration-200
                  ${cell.selected ? 'bg-blue-500/80 border-blue-400' : 'hover:bg-white/10'}
                `}
              >
                {cell.watermark && (
                  <Watermark
                    color={cell.color}
                    shape={cell.watermark}
                    rotation={cell.rotation}
                    scale={cell.scale}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">{renderValidate()}</div>
    </>
  );
};
