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

describe('It should test the Snackbar Component while triggering set timeOut function', () => {
  it('renders Snackbar Component', () => {
    jest.useFakeTimers();
    const container = render(
      <Snackbar
        handleCloseError={jest.fn()}
        handleDefaultCloseSnackbar={jest.fn()}
        messageToDisplay={'Hello This is Snackbar'}
        isSuccess={true}
        actionType={'add'}
      />
    );
    jest.runAllTimers();
    jest.useRealTimers();
    expect(container).toBeDefined();
  });

  it('expect the relevent class when isSuccess is false', () => {
    render(
      <Snackbar
        handleCloseError={jest.fn()}
        handleDefaultCloseSnackbar={jest.fn()}
        messageToDisplay={undefined}
        isSuccess={false}
        actionType={''}
      />
    );
    const snackBarParent = screen.getByTestId(/snackbar-alert/i);
    expect(snackBarParent).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
  });

  it('Should trigger handleClose and also check for snackBar parent class', () => {
    render(
      <Snackbar
        handleCloseError={jest.fn()}
        handleDefaultCloseSnackbar={jest.fn()}
        messageToDisplay={undefined}
        isSuccess={true}
        actionType={'test'}
      />
    );
    const snackBarParent = screen.getByTestId(/snackbar-alert/i);
    const closeBtn = screen.getByTestId('snackbar-close-icon');
    fireEvent.click(closeBtn);
    expect(snackBarParent).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
  });
});
