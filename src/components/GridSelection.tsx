import type { WatermarkShape } from '../type';
import Button from './Button';

// Watermark component with subtle distortion
const Watermark = ({
  shape,
  opacity = 1,
  rotation,
  scale,
}: {
  shape: Exclude<WatermarkShape, null>;
  opacity?: number;
  rotation: number;
  scale: number;
}) => {
  const style = {
    transform: `rotate(${rotation}deg) scale(${scale})`,
    opacity,
    filter: 'blur(0.5px)',
  };
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

interface GridCell {
  id: number;
  watermark: WatermarkShape;
  selected: boolean;
  rotation: number;
  scale: number;
}

interface GridSelectionProps {
  capturedImage: string;
  gridCells: GridCell[];
  targetShape: WatermarkShape;
  lockedSquarePos: { x: number; y: number; width: number; height: number };
  videoDimensions: { width: number; height: number };
  onToggleCell: (cellId: number) => void;
  onValidate: () => void;
}

export const GridSelection = ({
  capturedImage,
  gridCells,
  targetShape,
  lockedSquarePos,
  videoDimensions,
  onToggleCell,
  onValidate,
}: GridSelectionProps) => {
  const getShapeLabel = (shape: WatermarkShape) => {
    if (shape === 'triangle') return 'triangles (▲)';
    if (shape === 'square') return 'squares (■)';
    if (shape === 'circle') return 'circles (●)';
    return '';
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-center text-lg font-semibold mb-4">
          Select all cells containing {getShapeLabel(targetShape)}
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
                  <Watermark shape={cell.watermark} rotation={cell.rotation} scale={cell.scale} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="primary" size="lg" fullWidth onClick={onValidate}>
          Validate
        </Button>
      </div>
    </>
  );
};
