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

describe('It should test the Snackbar Component', () => {
  it('renders Snackbar Component', () => {
    const container = render(
      <Snackbar
        handleCloseError={jest.fn()}
        handleDefaultCloseSnackbar={jest.fn()}
        messageToDisplay={'Hello This is Snackbar'}
        isSuccess={true}
        actionType={'add'}
      />
    );
    expect(container).toBeDefined();
  });

  it('Should trigger handleClose()', () => {
    render(
      <Snackbar
        handleCloseError={jest.fn()}
        handleDefaultCloseSnackbar={jest.fn()}
        messageToDisplay={undefined}
        isSuccess={false}
        actionType={''}
      />
    );
    const closeBtn = screen.getByTestId('snackbar-close-icon');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });
});
