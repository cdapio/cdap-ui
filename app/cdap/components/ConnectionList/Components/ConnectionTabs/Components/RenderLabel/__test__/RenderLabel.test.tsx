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
import RenderLabel from 'components/ConnectionList/Components/ConnectionTabs/Components/RenderLabel/index';

describe('Test RenderLabel component', () => {
  it('Should render RenderLabel Component with columnIndex as 0', () => {
    render(
      <RenderLabel
        columnIndex={0}
        connectorType={{
          canBrowse: true,
          name: 'Test',
          connectionId: 'Test',
          connectionType: 'File',
          description: 'Test',
          preConfigured: false,
          isDefault: false,
          createdTimeMillis: 1665479458620,
          updatedTimeMillis: 1665479458620,
          plugin: {
            category: 'File',
            name: 'File',
            type: 'connector',
            properties: undefined,
            artifact: {
              scope: 'SYSTEM',
              name: 'core-plugins',
              version: '2.10.0-SNAPSHOT',
            },
          },
        }}
        connectionIdProp={''}
        toggleLoader={jest.fn()}
        setIsErrorOnNoWorkSpace={jest.fn()}
        dataTestID={0}
      />
    );

    const browseLabelComponent = screen.getByTestId(/connections-tab-can-browse-label-0/i);
    expect(browseLabelComponent).toBeInTheDocument();
  });

  it('Should render RenderLabel Component with columnIndex as 1', () => {
    render(
      <RenderLabel
        columnIndex={1}
        connectorType={{
          canBrowse: true,
          name: 'Test',
          connectionId: 'Test',
          connectionType: 'File',
          description: 'Test',
          preConfigured: false,
          isDefault: false,
          createdTimeMillis: 1665479458620,
          updatedTimeMillis: 1665479458620,
          plugin: {
            category: 'File',
            name: 'File',
            type: 'connector',
            properties: undefined,
            artifact: {
              scope: 'SYSTEM',
              name: 'core-plugins',
              version: '2.10.0-SNAPSHOT',
            },
          },
        }}
        connectionIdProp={''}
        toggleLoader={jest.fn()}
        setIsErrorOnNoWorkSpace={jest.fn()}
        dataTestID={0}
      />
    );

    const browseLabelComponent = screen.getByTestId(/connections-tab-can-browse-label-0/i);
    expect(browseLabelComponent).toBeInTheDocument();
  });

  it('Should render RenderLabel Component with columnIndex as undefined', () => {
    render(
      <RenderLabel
        columnIndex={undefined}
        connectorType={{
          name: 'Test',
          connectionId: 'Test',
          connectionType: 'File',
          description: 'Test',
          preConfigured: false,
          isDefault: false,
          createdTimeMillis: 1665479458620,
          updatedTimeMillis: 1665479458620,
          plugin: {
            category: 'File',
            name: 'File',
            type: 'connector',
            properties: undefined,
            artifact: {
              scope: 'SYSTEM',
              name: 'core-plugins',
              version: '2.10.0-SNAPSHOT',
            },
          },
        }}
        connectionIdProp={''}
        toggleLoader={jest.fn()}
        setIsErrorOnNoWorkSpace={jest.fn()}
        dataTestID={0}
      />
    );
  });
});
