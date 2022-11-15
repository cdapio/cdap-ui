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
import ImportSchema from 'components/ImportSchema';
import history from 'services/history';
import T from 'i18n-react';

describe('It Should Test the ParsingHeaderActionTemplate Component', () => {
  it('Should test whether ParsingHeaderActionTemplate Component is rendered as expected', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ImportSchema
              setSuccessUpload={() => jest.fn()}
              handleSchemaUpload={() => jest.fn()}
              setErrorOnTransformation={() => jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );

    const actionTemplateParentElement = screen.getByTestId(/import-schema-input-wrapper/i);
    expect(actionTemplateParentElement).toBeInTheDocument();

    const labelElement = screen.getByTestId(/import-schema-text/i);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.importSchema')}`
    );
  });
});
