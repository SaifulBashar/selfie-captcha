import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Camera } from './Camera';

describe('Camera', () => {
  const mockVideoRef = { current: null };
  const defaultProps = {
    videoRef: mockVideoRef as React.RefObject<HTMLVideoElement | null>,
    rectPos: { x: 100, y: 100 },
    SQUARE_SIZE: 150,
    hasPermission: true,
    error: null,
    onContinue: vi.fn(),
  };

  it('renders video element', () => {
    render(<Camera {...defaultProps} />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('renders continue button', () => {
    render(<Camera {...defaultProps} />);
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('calls onContinue when button clicked', async () => {
    const onContinue = vi.fn();
    const user = userEvent.setup();
    render(<Camera {...defaultProps} onContinue={onContinue} />);
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('shows permission request message when permission denied', () => {
    render(<Camera {...defaultProps} hasPermission={false} />);
    expect(screen.getByText(/requesting camera access/i)).toBeInTheDocument();
  });
});
