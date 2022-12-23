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
import DirectiveUsage from 'components/DirectiveInput/Components/DirectiveUsage/index';
import T from 'i18n-react';
import { PREFIX } from 'components/DirectiveInput/constants';

describe('Testing Directive Usage Component', () => {
  const dummyUsage = {
    item: {
      directive: 'json-path',
      usage: "json-path :source :destination 'json-path'",
      description: 'Parses JSON elements using a DSL (a JSON path expression).',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'json-path',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'source',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'destination',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 2,
            optional: false,
            name: 'json-path',
            type: 'TEXT',
          },
        ],
      },
      categories: ['parser', 'json'],
    },
    matches: [
      {
        indices: [[0, 0]],
        value: 'json-path',
        key: 'directive',
        arrayIndex: 0,
      },
    ],
    score: 0.001,
    uniqueId: '94dc4bd4-8030-4bea-9197-993429227df0',
  };
  beforeEach(() => {
    render(<DirectiveUsage directiveUsage={dummyUsage} />);
  });

  it('Should check if the parent wrapper is rendered', () => {
    const parentElement = screen.getByTestId(/directive-usage-text-wrapper/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('check if the label is rendered as expected', () => {
    const x = screen.getAllByTestId(/directive-usage-text/i);
    expect(x[0]).toHaveTextContent(`${T.translate(`${PREFIX}.usage`)}`);
  });
});
