import React from 'react';
import { render, screen } from '@testing-library/react';
import DatasetWrapper from '../index';

test('renders BreadCumb Component', () => {
  render(<DatasetWrapper />);
  const ele = screen.getByTestId(/data-sets-parent/i);
  expect(ele).toBeInTheDocument();
});