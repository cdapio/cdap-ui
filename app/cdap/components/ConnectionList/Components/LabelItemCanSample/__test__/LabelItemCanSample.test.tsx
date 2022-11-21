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
import LabelItemCanSample from 'components/ConnectionList/Components/LabelItemCanSample/index';

describe('Test TabLabelCanBrowse Component', () => {
  it('Should render TabLabelCanBrowse Component', () => {
    render(
      <LabelItemCanSample
        label={''}
        myLabelRef={jest.fn()}
        onExplore={jest.fn()}
        entity={undefined}
        buttonTestId={'test-button'}
        buttonElement={undefined}
        dataTestID={0}
      />
    );
    const buttonElement = screen.getByTestId(/test-button/i);
    fireEvent.click(buttonElement);
    expect(buttonElement).toBeInTheDocument();

    const canSimpleElement = screen.getByTestId(/connections-tab-label-can-simple-0/i);
    fireEvent.doubleClick(canSimpleElement);
    expect(canSimpleElement).toBeInTheDocument();
  });
});
