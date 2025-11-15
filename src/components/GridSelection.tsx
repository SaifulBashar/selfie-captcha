import { COLOR_MAP } from '../constants';
import type { GridCell, WatermarkColor, WatermarkShape } from '../type';
import Button from './Button';

// Watermark component with subtle distortion
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
