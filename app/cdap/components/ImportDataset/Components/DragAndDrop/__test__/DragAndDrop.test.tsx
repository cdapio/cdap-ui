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
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import DragAndDrop from 'components/ImportDataset/Components/DragAndDrop/index';
import history from 'services/history';

describe('It should test DrawerWidget Component', () => {
  it('Should test whether DrawerWidget Component is rendered', () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <DragAndDrop file={file} onDropHandler={() => jest.fn()} />
          </Route>
        </Switch>
      </Router>
    );
    const boxEle = screen.getByTestId(/delete-svg/i);
    fireEvent.click(boxEle);
    expect(container).toBeDefined();
  });
});
