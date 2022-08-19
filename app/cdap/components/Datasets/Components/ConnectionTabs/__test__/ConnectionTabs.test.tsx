import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectionsTabs from '../index';

const yolo = [{showTabs:true}]

test('renders Connections Tab Component', () => {
  render(<ConnectionsTabs tabsData={yolo} handleChange='qwe' value='apple' index='one' />);
  const ele = screen.getByTestId(/connections-tabs-parent/i);
  expect(ele).toBeInTheDocument();
});