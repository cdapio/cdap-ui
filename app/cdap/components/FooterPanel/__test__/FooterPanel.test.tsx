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

import { render, screen } from '@testing-library/react';
import { PREFIX } from 'components/FooterPanel';
import FooterPanel from 'components/FooterPanel/index';
import T from 'i18n-react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';

describe('Test Footer Panel Component', () => {
  beforeEach(() => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <FooterPanel recipeStepsCount={42} gridMetaInfo={{ rowCount: 66, columnCount: 6 }} />
          </Route>
        </Switch>
      </Router>
    );
  });

  it('Should render the component with correct props', () => {
    const outlinedLabelElement = screen.getByTestId(/footerpanel-outlined-label/i);

    // Label inside OutlinedLabelElement to be 42
    expect(outlinedLabelElement).toHaveTextContent('42');

    const simpleLabelElement = screen.getAllByTestId(/footerpanel-simple-label/i);

    // Check if the row count and column count is same as provided props 66 and 6
    expect(simpleLabelElement[0]).toHaveTextContent(`${T.translate(`${PREFIX}.message`, 66)}`);
  });

  it('Should render all the child elements correctly in the parent component', () => {
    const wrapperElement = screen.getByTestId(/footer-panel-wrapper/i);

    const viewPanelTabParent = screen.getByTestId(/footer-panel-column-view-panel-tab/i);

    // Check if the ViewPanelTabParent child component is rendered trough footer panel parent
    expect(wrapperElement).toContainElement(viewPanelTabParent);

    const directivesElement = screen.getByTestId(/footer-panel-directives-tab/i);

    // Check if the directivesElement is rendered trough footer panel parent
    expect(wrapperElement).toContainElement(directivesElement);

    const zoomTabElement = screen.getByTestId(/footer-panel-zoom-tab/i);

    // Check if the zoomTabElement is rendered trough footer panel parent
    expect(wrapperElement).toContainElement(zoomTabElement);

    const recipeStepsTabElement = screen.getByTestId(/footer-panel-recipe-steps-tab/i);

    // Check if the recipeStepsTabElement is rendered trough footer panel parent
    expect(wrapperElement).toContainElement(recipeStepsTabElement);

    const metaInfoTabElement = screen.getByTestId(/footer-panel-meta-info-tab/i);

    // Check if the metaInfoTabElement is rendered trough footer panel parent
    expect(wrapperElement).toContainElement(metaInfoTabElement);
  });
});
