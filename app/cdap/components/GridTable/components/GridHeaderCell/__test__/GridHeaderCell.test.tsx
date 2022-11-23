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

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import React from 'react';

describe('To Test Grid Header Cell Component', () => {
  const arr = ['PostgrSQL', 'SQL'];
  it('Should check if the label is displayed as expected', () => {
    render(
      <GridHeaderCell
        label={'abc'}
        types={arr}
        key={''}
        columnSelected={''}
        setColumnSelected={jest.fn()}
        onColumnSelection={jest.fn()}
        eachHeaderIndex={0}
      />
    );
    const ele = screen.getByTestId(`grid-header-column-name`);
    expect(ele).toHaveTextContent('abc');
  });
  it('Renders Component with empty types array to trigger Null', () => {
    render(
      <GridHeaderCell
        label={'abc'}
        types={[]}
        key={''}
        columnSelected={''}
        setColumnSelected={jest.fn()}
        onColumnSelection={jest.fn()}
        eachHeaderIndex={0}
      />
    );
  });
});
