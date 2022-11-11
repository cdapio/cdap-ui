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

describe('It Should Test the ParsingPopupBody component', () => {
  it('Should test whether ParsingPopupBody Component is rendered or not', () => {
    const handleChange = jest.fn();

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
  it('Should test whether ParsingPopupBody Component is rendered or not', () => {
    const handleChange = jest.fn();

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
    const renderedCheckbox = screen.getAllByTestId('parsing-checkbox');
    expect(renderedCheckbox[0]).toBeInTheDocument();
    fireEvent.click(renderedCheckbox[0]);
    fireEvent.change(renderedCheckbox[0], { target: { checked: true } });
  });
});
