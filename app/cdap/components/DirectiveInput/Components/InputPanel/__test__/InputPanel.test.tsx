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
import InputPanel from 'components/DirectiveInput/Components/InputPanel/index';

describe('Testing Input Panel Component', () => {
  const dummy = [
    {
      name: 'body_0',
      label: 'body_0',
      type: ['String'],
    },
    {
      name: 'body_1',
      label: 'body_1',
      type: ['String'],
    },
    {
      name: 'body_2',
      label: 'body_2',
      type: ['String'],
    },
    {
      name: 'body_3',
      label: 'body_3',
      type: ['String'],
    },
    {
      name: 'body_4',
      label: 'body_4',
      type: ['String'],
    },
    {
      name: 'body_5',
      label: 'body_5',
      type: ['String'],
    },
  ];
  it('Should check if the parent wrapper is rendered with selectedDirective as true', () => {
    render(
      <InputPanel
        setDirectivesList={jest.fn()}
        isDirectiveSet={true}
        columnNamesList={dummy}
        onSearchItemClick={jest.fn()}
        getDirectiveSyntax={jest.fn()}
        inputDirective={'test'}
      />
    );
    const parentElement = screen.getByTestId(/input-panel-wraper/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('Should check if the parent wrapper is rendered with selectedDirective as false', () => {
    render(
      <InputPanel
        setDirectivesList={jest.fn()}
        isDirectiveSet={false}
        columnNamesList={dummy}
        onSearchItemClick={jest.fn()}
        getDirectiveSyntax={jest.fn()}
        inputDirective={'test'}
      />
    );
    const parentElement = screen.getByTestId(/input-panel-wraper/i);
    expect(parentElement).toBeInTheDocument();
  });
});
