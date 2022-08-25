import React from 'react';
import { render, screen } from '@testing-library/react';
import OngoingDataExploration from '../index';
import { updatedData } from '../utils';

const testObj = {
  connectionName: 'Upload',
  workspaceName: 'Divami_Users_Emails.xlsx',
  recipeSteps: 0,
  dataQuality: 100,
};

test('renders Ongoing Data Exploration component', () => {
  jest.mock('api/dataprep', () => {
    return Promise.resolve([
      { connectionName: 'yolo', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
      { connectionName: 'Upload', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
    ]);
  });
  render(<OngoingDataExploration />);
  const ele = screen.getByTestId(/ongoing-data-explore-parent/i);
  expect(ele).toBeInTheDocument();
});
