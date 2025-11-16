import React from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';

// Custom render function
const render = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return rtlRender(ui, { ...options });
};

export { screen, waitFor, fireEvent, within } from '@testing-library/react';
export { render };
