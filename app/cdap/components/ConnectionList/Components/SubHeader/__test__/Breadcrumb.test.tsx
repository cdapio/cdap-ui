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
import { fireEvent, render, screen } from '@testing-library/react';
import BreadCumb from 'components/ConnectionList/Components/SubHeader/index';
import { Router, Route, Switch } from 'react-router';
import history from 'services/history';
import T from 'i18n-react';

test('renders BreadCumb Component', () => {
  render(
    <Router history={history}>
      <Switch>
        <Route>
          <BreadCumb selectedConnection={'hello'} />  ̰
        </Route>
      </Switch>
    </Router>
  );
  const ele = screen.getByTestId(/breadcrumb-container-parent/i);
  expect(ele).toBeInTheDocument();

  const clickEle = screen.getByTestId(/sub-header-handle-add-connection/i);
  expect(clickEle).toHaveTextContent(
    `${T.translate('features.WranglerNewUI.AddConnections.referenceLabel')}`
  );
});
