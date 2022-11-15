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
  beforeEach(() => {
    render(
      <DirectiveUsage eachDirective={undefined}  
      />
    );
  });

  it('Should check if the parent wrapper is rendered', () => {
    const parentElement = screen.getByTestId(/directive-usage-text-wrapper/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('check if the label is rendered as expected', () => {
    const x = screen.getAllByTestId(/directive-usage-text/i);
    expect(x[0]).toHaveTextContent(`${T.translate(`${PREFIX}.usage`)}`)
  })

});
