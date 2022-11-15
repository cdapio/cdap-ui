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

import { fireEvent, render } from '@testing-library/react';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import InputSelect from 'components/ParsingDrawer/Components/InputSelect/index';
import { CHAR_ENCODING_OPTIONS } from 'components/ParsingDrawer/Components/ParsingPopupBody/parsingOptions';
import history from 'services/history';

const mockOptions = [
  {
    label: 'a',
    value: '10',
  },
  {
    label: 'b',
    value: '20',
  },
  {
    label: 'c',
    value: '30',
  },
];
describe('It Should Test the ', () => {
  it('Should test whether InputSelect Component is rendered or not', () => {
    const handleFormatChange = jest.fn();
    const { getByRole, getByTestId } = render(
      <Router history={history}>
        <Switch>
          <Route>
            <InputSelect
              options={CHAR_ENCODING_OPTIONS}
              defaultValue={CHAR_ENCODING_OPTIONS[0].value}
              value={CHAR_ENCODING_OPTIONS[0]?.value}
              onChange={handleFormatChange}
            />
          </Route>
        </Switch>
      </Router>
    );

    const menu = getByRole('button');
    fireEvent.mouseDown(menu);
    const option2 = getByTestId('input-select-1');
    fireEvent.click(option2);
    expect(handleFormatChange).toHaveBeenCalled();
  });
});
