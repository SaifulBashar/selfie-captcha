import { CELL_COUNT, WATERMARK_COLORS, WATERMARK_SHAPES } from '../constants';
import type { GridCell, WatermarkShape } from '../type';

export const generateGrid = () => {
  const shapes: WatermarkShape[] = ['triangle', 'square', 'circle'];
  const cells: GridCell[] = [];

  //25 cells (5x5)
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push({
      id: i,
      watermark: null,
      selected: false,
      rotation: Math.random() * 20 - 10, // -10 to 10 degrees
      scale: 0.9 + Math.random() * 0.2, // 0.9 to 1.1
      color: null,
    });
  }

  // Randomly select half of the cells (12-13 cells) to have watermarks
  const cellsToMark = Math.floor(cells.length / 2);
  const shuffledIndices = [...Array(CELL_COUNT).keys()].sort(() => Math.random() - 0.5);

  for (let i = 0; i < cellsToMark; i++) {
    const cellIndex = shuffledIndices[i];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = WATERMARK_COLORS[Math.floor(Math.random() * WATERMARK_COLORS.length)];

    cells[cellIndex].watermark = randomShape;
    cells[cellIndex].color = randomColor;
  }

  // Select random target shape and color combination
  const targetShape = WATERMARK_SHAPES[Math.floor(Math.random() * WATERMARK_SHAPES.length)];
  const targetColor = WATERMARK_COLORS[Math.floor(Math.random() * WATERMARK_COLORS.length)];

  //filter to ensure at least one cell has the target shape and color
  const hasTarget = cells.some(
    (cell) => cell.watermark === targetShape && cell.color === targetColor
  );

  if (!hasTarget) {
    //if any target shape do not have targetColor, assign first occurrence
    for (const cell of cells) {
      if (cell.watermark === targetShape) {
        cell.color = targetColor;
        break;
      }
    }
  }

  return { cells, target: { shape: targetShape, color: targetColor } };
};
