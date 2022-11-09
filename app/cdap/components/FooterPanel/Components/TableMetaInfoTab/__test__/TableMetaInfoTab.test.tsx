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
import TableMetaInfoTab from 'components/FooterPanel/Components/TableMetaInfoTab/index';
import { PREFIX } from 'components/FooterPanel/constants';
import T from 'i18n-react';
import React from 'react';

describe('Testing Table Meta Info Tab component', () => {
  it('Should render component with the correct rowCount and columnCount as passed in props', () => {
    render(<TableMetaInfoTab rowCount={420} columnCount={69} />);

    const childElement = screen.getByTestId(/footerpanel-simple-label/i);

    // Check if childElement has inner text as expected on the screen
    expect(childElement).toHaveTextContent(
      `${T.translate(`${PREFIX}.currentData`)} - 420 ${T.translate(`${PREFIX}.rows`)} ${T.translate(
        `features.WranglerNewUI.common.and`
      )} 69 ${T.translate(`${PREFIX}.columns`)}`
    );
  });
});
