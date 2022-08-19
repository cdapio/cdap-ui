import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomTooltip from '../index';

test('renders Custom ToolTip Correctly', () => {
  render(<CustomTooltip children={undefined} title={''} />);
});