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

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import OngoingWorkspaceListMenu from 'components/OpenWorkspacesList/components/OngoingWorkspaceListMenu/OngoingWorkspaceListMenu';

describe('It should test OngoingWorkspaceListMenu Component', () => {
  beforeEach(() => {
    render(
      <OngoingWorkspaceListMenu
        workspace={{
          workspaceId: '96d6923c-3b21-4dc8-9d66-9befa00bb91c',
          workspaceName: 'information_schema_catalog_name_information_testing',
        }}
        index={0}
        handleMenuClick={jest.fn()}
      />
    );
  });

  it('should trigger onChange event in list item', () => {
    const listItemElement = screen.getByTestId(/open-workspace-list-item-0/i);
    fireEvent.click(listItemElement);
    expect(listItemElement).toBeInTheDocument();
  });

  it('should test the workspace Name', () => {
    const workspaceName = screen.getByTestId(/workspace-name/i);
    expect(workspaceName).toHaveTextContent('information_schema_catalog_name_information_testing');
  });
});
