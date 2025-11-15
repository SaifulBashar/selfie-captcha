const SQUARE_SIZE = 150;
const CELL_COUNT = 25;
const WATERMARK_COLORS = ['red', 'green', 'blue'] as const;
const WATERMARK_SHAPES = ['triangle', 'square', 'circle'] as const;

const COLOR_MAP = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
} as const;

export { SQUARE_SIZE, CELL_COUNT, WATERMARK_COLORS, COLOR_MAP, WATERMARK_SHAPES };
