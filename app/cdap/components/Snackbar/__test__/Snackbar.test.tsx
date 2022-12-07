/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Snackbar from 'components/Snackbar/index';

describe('Should test the Snackbar Component while triggering setTimeout function and Triggers handleClose and checks for snackbar parent class', () => {
  it('renders Snackbar Component', () => {
    jest.useFakeTimers();
    render(<Snackbar handleClose={jest.fn} isSuccess={true} open={true} />);
    const snackBarParent = screen.getByTestId(/snackbar-alert/i);
    const closeButton = screen.getByTestId('snackbar-close-icon');
    fireEvent.click(closeButton);
    expect(snackBarParent).toHaveClass('MuiSnackbar-anchorOriginTopLeft');

    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('Expects the relevent class when isSuccess is false', () => {
    render(<Snackbar handleClose={jest.fn} isSuccess={false} open={true} />);
    const snackBarParent = screen.getByTestId(/snackbar-alert/i);
    expect(snackBarParent).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
  });
});
