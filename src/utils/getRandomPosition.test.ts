import { describe, it, expect } from 'vitest';
import { getRandomPosition } from './getRandomPosition';

describe('getRandomPosition', () => {
  it('returns coordinates within valid bounds', () => {
    const result = getRandomPosition(1280, 720, 150);

    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.x).toBeLessThanOrEqual(1130); // 1280 - 150
    expect(result.y).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeLessThanOrEqual(570); // 720 - 150
  });

  it('returns 0 when video is smaller than box', () => {
    const result = getRandomPosition(100, 100, 150);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});
