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
import React from 'react';
import ZoomTab from 'components/FooterPanel/Components/ZoomTab/index';
import { PREFIX } from 'components/FooterPanel/constants';
import T from 'i18n-react';

describe('Testing Zoom Tab Component', () => {
  it('Should render component with respective child element', () => {
    render(<ZoomTab />);

    const childElement = screen.getByTestId(/footerpanel-simple-label/i);

    // Check if ChildElement has the correct label as rendered on the screen
    expect(childElement).toHaveTextContent(`${T.translate(`${PREFIX}.zoomPercent100`)}`);
  });
});
