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
import SelectColumnPanel from 'components/WranglerGrid/SelectColumnPanel';
import React from 'react';

describe('It should test the SelectColumnsList Component', () => {
  it('should render the SelectColumnsList Component where transformationName=is parseCSV', () => {
    const mockCancelFunction = jest.fn();
    render(
      <SelectColumnPanel
        transformationName="parseCSV"
        transformationDataType={[]}
        columnsList={[]}
        missingItemsList={undefined}
        onCancel={mockCancelFunction}
      />
    );
    expect(screen.getByTestId(/select-column-drawer/i)).toBeInTheDocument();
  });
});
