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
import DirectivesTab from 'components/FooterPanel/Components/DirectivesTab/index';
import { PREFIX } from 'components/FooterPanel';
import T from 'i18n-react';
import React from 'react';

describe('Testing DirectivesTab component', () => {
  it('Should render component and check for respective elements', () => {
    render(<DirectivesTab />);

    const parentElement = screen.getByTestId(/footer-panel-directives-tab/i);

    // Check if the parent component is rendered on the screen
    expect(parentElement).toBeInTheDocument();

    const simpleLabelElement = screen.getByTestId(/footerpanel-simple-label/i);

    // Checking if the exact label is rendered on the screen
    expect(simpleLabelElement).toHaveTextContent(`${T.translate(`${PREFIX}.directives`)}`);
  });
});
