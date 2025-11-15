type WatermarkShape = 'triangle' | 'square' | 'circle' | null;

interface GridCell {
  id: number;
  watermark: WatermarkShape;
  selected: boolean;
  rotation: number;
  scale: number;
}

export type { WatermarkShape, GridCell };
