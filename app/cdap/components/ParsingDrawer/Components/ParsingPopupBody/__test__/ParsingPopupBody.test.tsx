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

import React from 'react';
import { createBrowserHistory as createHistory } from 'history';
import { Router, Route, Switch } from 'react-router';
import ParsingPopupBody from 'components/ParsingDrawer/Components/ParsingPopupBody/index';
import { fireEvent, render, within, screen } from '@testing-library/react';
import { CHAR_ENCODING_OPTIONS, FORMAT_OPTIONS } from '../parsingOptions';
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
    const renderedCheckbox = screen.getByTestId(
      'parsing-checkbox-features.WranglerNewParsingDrawer.useFirstRowAsHeader'
    );
    expect(renderedCheckbox).toBeInTheDocument();
    fireEvent.click(renderedCheckbox);
    fireEvent.change(renderedCheckbox, { target: { checked: true } });
  });
});
