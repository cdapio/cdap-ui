import React from 'react';
import { render, screen } from '@testing-library/react';
import WrangleCard from '../index';

test('It renders Wrangler-Card ', () => {
  jest.mock('components/Connections/Create/reducer', () => {
    return Promise.resolve([
      {
        artifact: { name: 'words', scope: '', version: 'ten' },
        category: 'hello',
        classname: 'yolo',
        description: 'hello',
        name: 'HeMan',
        type: 'js',
      },
      {
        artifact: { name: 'words', scope: '', version: 'ten' },
        category: 'hello',
        classname: 'yolo',
        description: 'hello',
        name: 'BatMan',
        type: 'js',
      },
      {
        artifact: { name: 'words', scope: '', version: 'ten' },
        category: 'hello',
        classname: 'yolo',
        description: 'hello',
        name: 'SuperMan',
        type: 'js',
      },
    ]);
  });
  render(<WrangleCard />);
  const ele = screen.getByTestId(/wrangle-card-parent/i);
  expect(ele).toBeInTheDocument();
});