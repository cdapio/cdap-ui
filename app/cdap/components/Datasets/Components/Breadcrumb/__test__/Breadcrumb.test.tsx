import React from 'react';
import { render, screen } from '@testing-library/react';
import BreadCumb from '../index';

test('renders BreadCumb Component', () => {
  render(<BreadCumb />);
  const ele = screen.getByTestId(/bread-comb-container-parent/i);
  expect(ele).toBeInTheDocument();
});
