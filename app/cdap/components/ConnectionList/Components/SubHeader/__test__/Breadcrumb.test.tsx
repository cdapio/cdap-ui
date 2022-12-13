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

import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from 'components/ConnectionList/Components/SubHeader';
import history from 'services/history';
import { Router, Route } from 'react-router';

describe('renders Breadcrumb Component', () => {
  render(
    <Router history={history}>
      <Route>
        <Breadcrumb />
      </Route>
    </Router>
  );

  it('should render the Breadcrumb component', () => {
    const ele = screen.getByTestId('breadcrumb-container-parent');
    expect(ele).toBeInTheDocument();
  });
});
