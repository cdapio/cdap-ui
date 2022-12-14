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

import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchListItem from 'components/DirectiveInput/Components/SearchListItem/index';

describe('Testing SearchListItem  Component', () => {
  beforeEach(() => {
    render(
      <SearchListItem
        searchItem={{ item: { directive: 'batman', label: 'superman', description: 'heMan' } }}
      />
    );
  });

  it('Should check if the component is rendered ', () => {
    const parentWrapperElement = screen.getByTestId(/search-list-item-parent-wrapper/i);
    expect(parentWrapperElement).toBeInTheDocument();
  });

  it('should check if the label is as expected', () => {
    const labelElement = screen.getByTestId(/select-directive-list-label/i);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent('batman');
  });

  it('should check if the tesxt is rendered as expected', () => {
    const textElement = screen.getByTestId(/select-directive-list-description/i);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('heMan');
  });
});
