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
import history from 'services/history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import SelectColumn from 'components/WranglerGrid/SelectColumnPanel';

describe('It should test the SelectColumnsList Component', () => {
  it('should render the SelectColumnsList Component where transformationName=is parseCSV and click on close button', () => {
    const mockCancelFunction = jest.fn();
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumn
              transformationName="parseCSV"
              transformationDataType={[]}
              columnsList={[]}
              missingItemsList={undefined}
              onCancel={mockCancelFunction}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(screen.getByTestId(/select-column-panel/i)).toBeInTheDocument();

    const closeButton = screen.getByTestId(/select-column-drawer-close-icon-button/i);
    fireEvent.click(closeButton);
    expect(mockCancelFunction).toBeCalled();
  });
});
