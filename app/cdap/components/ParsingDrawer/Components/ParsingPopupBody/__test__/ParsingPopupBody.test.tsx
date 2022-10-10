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
import ParsingPopupBody from '..';
import { fireEvent, render, within } from '@testing-library/react';
import { CHAR_ENCODING_OPTIONS, FORMAT_OPTIONS } from '../options';

const history = createHistory({
  basename: '/',
});

describe('It Should Test the ParsingPopupBody component', () => {
  it('Should test whether ParsingPopupBody Component is rendered or not', () => {
    const handleFormatChange = jest.fn();
    const handleEncodingChange = jest.fn();
    const handleQuoteValueChange = jest.fn();
    const headerValueChecked = true;
    const quotedValuesChecked = true;
    const handleCheckboxChange = jest.fn();

    const { getAllByRole, getAllByTestId, getByTestId } = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingPopupBody
              formatValue={FORMAT_OPTIONS[0].value}
              handleFormatChange={handleFormatChange}
              encodingValue={CHAR_ENCODING_OPTIONS[0].value}
              handleEncodingChange={handleEncodingChange}
              quotedValuesChecked={quotedValuesChecked}
              handleQuoteValueChange={handleQuoteValueChange}
              headerValueChecked={headerValueChecked}
              handleCheckboxChange={handleCheckboxChange}
            />
          </Route>
        </Switch>
      </Router>
    );

    const menu = getAllByRole('button');
    fireEvent.mouseDown(menu[0]);

    const option2 = getAllByTestId('input-select-1')[0];
    fireEvent.click(option2);
    expect(handleFormatChange).toHaveBeenCalled();

    fireEvent.mouseDown(menu[1]);
    const option3 = getAllByTestId('input-select-1')[1];
    fireEvent.click(option3);
    expect(handleEncodingChange).toHaveBeenCalled();

    const checkbox1 = getByTestId('parsing-checkbox-Enable quoted values');
    fireEvent.click(checkbox1);
    expect(handleQuoteValueChange).toHaveBeenCalled();

    const checkbox2 = getByTestId('parsing-checkbox-Use first row as header');
    fireEvent.click(checkbox2);
    expect(handleCheckboxChange).toHaveBeenCalled();
  });
});
