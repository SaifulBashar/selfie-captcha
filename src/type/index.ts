type WatermarkShape = 'triangle' | 'square' | 'circle';
type WatermarkColor = 'red' | 'green' | 'blue';

interface GridCell {
  id: number;
  watermark: WatermarkShape | null;
  color: WatermarkColor | null;
  selected: boolean;
  rotation: number;
  scale: number;
}

export type { WatermarkShape, GridCell, WatermarkColor };
