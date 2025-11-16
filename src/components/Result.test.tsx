import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Result } from './Result';

describe('Result', () => {
  it('renders success state', () => {
    render(<Result validationResult="success" handleRetry={vi.fn()} />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText(/successfully passed/)).toBeInTheDocument();
  });

  it('renders failed state', () => {
    render(<Result validationResult="failed" handleRetry={vi.fn()} />);
    expect(screen.getByText('Failed!')).toBeInTheDocument();
    expect(screen.getByText(/verification failed/)).toBeInTheDocument();
  });

  it('calls handleRetry on button click', async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();
    render(<Result validationResult="success" handleRetry={handleRetry} />);
    await user.click(screen.getByRole('button'));
    expect(handleRetry).toHaveBeenCalled();
  });
});
