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

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import DataTable from 'components/WranglerGrid/SelectColumnPanel/DataTable';
import T from 'i18n-react';

describe('It should test FunctionNameWidget Component', () => {
  it('Should render the FunctionNameWidget Component', () => {
    render(
      <DataTable
        columns={[
          { name: 'a', type: ['test'], label: 'test' },
          { name: 'a', type: ['test'], label: 'test' },
        ]}
        transformationDataType={['all']}
        onSingleSelection={() => jest.fn()}
        selectedColumns={[]}
        dataQualityValue={[]}
        isSingleSelection={false}
        handleDisableCheckbox={() => false}
        onMultipleSelection={() => jest.fn()}
        totalColumnCount={0}
        setSelectedColumns={() => jest.fn()}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.click(checkBoxElement);
    expect(checkBoxElement).toBeInTheDocument();
    expect(screen.getByTestId(/column-table-parent/i)).toBeInTheDocument();
    expect(screen.getByTestId(/panel-columns/i)).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.addTransformationPanel.columns')}`
    );
  });

  it('Should render the FunctionNameWidget Component with data type as test', () => {
    const f = [
      { name: 'string', label: 'string', type: ['test1', 'mock'] },
      { name: 'string', label: 'string', type: ['test2', 'mock'] },
      { name: 'string', label: 'string', type: ['Abhilash', 'IronMan'] },
    ];
    render(
      <DataTable
        columns={[{ name: 'a', type: ['test'], label: 'test' }]}
        transformationDataType={['test']}
        onSingleSelection={() => jest.fn()}
        selectedColumns={f}
        dataQualityValue={[]}
        isSingleSelection={false}
        handleDisableCheckbox={() => false}
        onMultipleSelection={() => jest.fn()}
        totalColumnCount={0}
        setSelectedColumns={() => jest.fn()}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.click(checkBoxElement);
    expect(screen.getByTestId(/panel-values/i)).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.addTransformationPanel.nullValues')}`
    );
    expect(screen.getByTestId(/column-table-parent/i)).toBeInTheDocument();
  });

  it('Should trigger the checkboxs handleChange when colums length is greater than 2', () => {
    const f = [
      { name: 'string', label: 'string', type: ['test1', 'mock'] },
      { name: 'string', label: 'string', type: ['test2', 'mock'] },
      { name: 'string', label: 'string', type: ['Abhilash', 'IronMan'] },
    ];
    const handleChange = jest.fn();
    render(
      <DataTable
        columns={[
          { name: 'a', type: ['test'], label: 'test' },
          { name: 'a', type: ['test'], label: 'test' },
          { name: 'a', type: ['test'], label: 'test' },
        ]}
        transformationDataType={['test']}
        onSingleSelection={() => jest.fn()}
        selectedColumns={[]}
        dataQualityValue={[]}
        isSingleSelection={false}
        handleDisableCheckbox={() => false}
        onMultipleSelection={() => jest.fn()}
        totalColumnCount={0}
        setSelectedColumns={() => jest.fn()}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.click(checkBoxElement);
    expect(checkBoxElement).toBeInTheDocument();
  });
});
