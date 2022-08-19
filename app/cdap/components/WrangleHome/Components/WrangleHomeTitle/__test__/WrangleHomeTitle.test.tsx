import React from 'react';
import { render, screen } from '@testing-library/react';
import WranglerHomeTitle from '../index';

test('renders Wrangler-Home-New component with correct tiltle', () => {
  render(<WranglerHomeTitle title="Hello-World" />);
  const ele = screen.getByTestId(/wrangler-home-title-text/i);
  expect(ele).toHaveTextContent('Hello-World');
});