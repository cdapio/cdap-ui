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
import GridHeaderCell from '..';

describe('To Test Grid Header Cell Component', () => {
  const str = 'PostGres';
  render(
    <GridHeaderCell
      label={'abc'}
      type={str}
      columnSelected={''}
      setColumnSelected={() => jest.fn()}
    />
  );

  it('label in TypographyComponent is Unknown', () => {
    const str1 = 'SQL';
    render(
      <GridHeaderCell
        label={'abc'}
        type={str1}
        columnSelected={''}
        setColumnSelected={() => jest.fn()}
      />
    );
  });

  it('datatype1 should return null when types.length is 0 ', () => {
    const str2 = 'mongoDb';
    render(
      <GridHeaderCell
        label={'abc'}
        type={str2}
        columnSelected={'abc'}
        setColumnSelected={() => console.log('triggered')}
      />
    );

    const ele = screen.getAllByTestId(/grid-header-cell-table-cellabc/i);

    fireEvent.click(ele[0]);
  });
});
