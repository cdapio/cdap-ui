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
import ColumnDetails from 'components/ColumnInsightsPanel/components/ColumnDetails/index';
import React from 'react';

describe('It Should test ColumnDetails Component', () => {
  it('Should render ColumnDetails Component and check the parent div is in the Document and column name is as expected', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );
    const columnDetailParent = screen.getByTestId(/column-details-parent/i);
    expect(columnDetailParent).toBeInTheDocument();
    const columnName = screen.getByTestId(/column-name/i);
    expect(columnName).toHaveTextContent('body_2');
  });

  it('Should test clicking on Edit icon and input field will be in the Document', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );
    const editIcon = screen.getByTestId(/edit-icon/i);
    fireEvent.click(editIcon);
    const inputField = screen.getByTestId(/column-name-edit-input/i);
    expect(inputField).toBeInTheDocument();
  });
  it('Should test the input field when valid and invalid inputs are provided and trigerring onEnter().', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );

    const editIcon = screen.getByTestId(/edit-icon/i);
    fireEvent.click(editIcon);

    const inputField = screen.getByTestId(/column-name-edit-input/i);
    expect(inputField).toBeInTheDocument();

    fireEvent.change(inputField.firstChild, { target: { value: 'body_10' } }); // When valid input is given
    expect(inputField.firstChild).toHaveValue('body_10');
    fireEvent.keyDown(inputField.firstChild, { key: 'Enter', code: 13, charCode: 13 });
    fireEvent.change(inputField.firstChild, { target: { value: 'body_**' } }); // When invalid input is given
    expect(inputField.firstChild).toHaveValue('body_**');
    const invalidText = screen.getByTestId('invalid-text');
    expect(invalidText).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsights.error.invalidError'
    );
  });
  it('Should test inputField when onBlur event is triggered and the new column name is different', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );
    const editIcon = screen.getByTestId(/edit-icon/i);
    fireEvent.click(editIcon);

    const inputField = screen.getByTestId(/column-name-edit-input/i);
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField.firstChild, { target: { value: 'body_10' } });
    fireEvent.blur(inputField.firstChild);
  });
  it('Should test inputField when onBlur event is triggered and the new column name is same', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );
    const editIcon = screen.getByTestId(/edit-icon/i);
    fireEvent.click(editIcon);
    const inputField = screen.getByTestId(/column-name-edit-input/i);
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField.firstChild, { target: { value: 'body_2' } });
    fireEvent.blur(inputField);
  });

  it('Should test inputField when onBlur event is triggered with invalid column Name', () => {
    render(
      <ColumnDetails
        columnName={'body_2'}
        characterCount={'0-8'}
        distinctValues={3}
        dataTypeString={'Contains letters and numbers'}
        renameColumnNameHandler={jest.fn()}
        dataTypeHandler={jest.fn()}
        columnType={'String'}
        columnHeaderList={['body_0,body_1,body_2,body_3,body_4']}
      />
    );
    const editIcon = screen.getByTestId(/edit-icon/i);
    fireEvent.click(editIcon);
    const inputField = screen.getByTestId(/column-name-edit-input/i);
    expect(inputField).toBeInTheDocument();
    fireEvent.change(inputField.firstChild, { target: { value: 'body_2**' } });
    fireEvent.blur(inputField);
  });
});
