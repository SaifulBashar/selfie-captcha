import { describe, it, expect } from 'vitest';
import { generateGrid } from './generateGrid';

describe('generateGrid', () => {
  it('generates 25 cells', () => {
    const { cells } = generateGrid();
    expect(cells).toHaveLength(25);
  });

  it('returns a target shape and color', () => {
    const { target } = generateGrid();
    expect(target.shape).toBeDefined();
    expect(target.color).toBeDefined();
  });

  it('assigns watermarks to half the cells', () => {
    const { cells } = generateGrid();
    const withWatermarks = cells.filter((c) => c.watermark !== null);
    expect(withWatermarks.length).toBe(12);
  });

  it('all cells have rotation and scale', () => {
    const { cells } = generateGrid();
    cells.forEach((cell) => {
      expect(cell.rotation).toBeDefined();
      expect(cell.scale).toBeDefined();
    });
  });
});
