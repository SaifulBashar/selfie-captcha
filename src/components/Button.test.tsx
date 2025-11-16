import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('disables when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports fullWidth', () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('accepts ref', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
