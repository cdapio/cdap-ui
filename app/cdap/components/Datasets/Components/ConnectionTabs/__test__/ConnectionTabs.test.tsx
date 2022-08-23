import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectionsTabs from '../index';

const tabsTestData = [{ showTabs: true }];

test('renders Connections Tab Component', () => {
  render(
    <ConnectionsTabs tabsData={tabsTestData} handleChange={() => null} value="apple" index="one" />
  );
  const ele = screen.getByTestId(/connections-tabs-parent/i);
  expect(ele).toBeInTheDocument();
});
