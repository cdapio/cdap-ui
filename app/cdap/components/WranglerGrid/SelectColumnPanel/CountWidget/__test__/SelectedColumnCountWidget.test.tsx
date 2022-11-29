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

import { render, screen } from '@testing-library/react';
import React from 'react';
import CountWidget from 'components/WranglerGrid/SelectColumnPanel/CountWidget';
import T from 'i18n-react';

describe('It should test the SelectColumnsList Component', () => {
  it('should render the SelectColumnsList Component with selectedColumnsCount>10', () => {
    render(<CountWidget selectedColumnsCount={20} />);
    expect(screen.getByTestId(/no-column-title/i)).toHaveTextContent('20');
  });
  it('should render the SelectColumnsList Component with selectedColumnsCount<10', () => {
    render(<CountWidget selectedColumnsCount={1} />);
    expect(screen.getByTestId(/no-column-title/i)).toHaveTextContent('1');
  });
  it('should render the SelectColumnsList Component with no selectedColumnsCount', () => {
    render(<CountWidget selectedColumnsCount={0} />);
    expect(screen.getByTestId(/no-column-title/i)).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.selectColumnListPanel.columnsSelected')}`
    );
  });
});
