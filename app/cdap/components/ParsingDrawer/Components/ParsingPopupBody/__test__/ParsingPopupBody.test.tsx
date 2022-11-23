/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody/index';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import T from 'i18n-react';

describe('It Should Test the ParsingPopupBody component', () => {
  const handleChange = jest.fn();

  it('Should test whether ParsingPopupBody Component is rendered or not', () => {
    const { getAllByRole, getAllByTestId, getByTestId } = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingPopupBody
              values={{
                format: 'csv',
                fileEncoding: 'UTF-8',
                enableQuotedValues: false,
                skipHeader: false,
              }}
              changeEventListener={handleChange}
            />
          </Route>
        </Switch>
      </Router>
    );

    const menu = getAllByRole('button');
    fireEvent.mouseDown(menu[0]);

    const option2 = getAllByTestId('input-select-1')[0];
    fireEvent.click(option2);
    expect(handleChange).toHaveBeenCalled();

    fireEvent.mouseDown(menu[1]);
    const option3 = getAllByTestId('input-select-1')[1];
    fireEvent.click(option3);
    expect(handleChange).toHaveBeenCalled();
  });
  it('Check if the label on screen is as expected', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingPopupBody
              values={{
                format: 'csv',
                fileEncoding: 'UTF-8',
                enableQuotedValues: false,
                skipHeader: false,
              }}
              changeEventListener={handleChange}
            />
          </Route>
        </Switch>
      </Router>
    );

    const labelElementOne = screen.getByTestId(/popup-body-label-text-format/i);
    expect(labelElementOne).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.ParsingDrawer.format')}`
    );

    const labelElementTwo = screen.getByTestId(/popup-body-label-text-encoding/i);
    expect(labelElementTwo).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.ParsingDrawer.encoding')}`
    );
  });
});
