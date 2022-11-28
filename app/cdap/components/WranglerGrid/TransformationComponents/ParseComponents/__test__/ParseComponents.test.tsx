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

import { render, screen } from '@testing-library/react';
import React from 'react';
import ParseComponents from 'components/WranglerGrid/TransformationComponents/ParseComponents/index';

describe('It should test ParseComponents', () => {
  it('Should render ParseComponents.', () => {
    render(<ParseComponents sectionHeading={''} children={<>Hello</>} />);
    const parseComponent = screen.getByTestId(/parse-component-parent/i);
    expect(parseComponent).toBeInTheDocument();
  });

  it('Should test whether Section Heading is as expected.', () => {
    render(<ParseComponents sectionHeading={'Parsing'} children={<>Hello</>} />);
    const sectionHeading = screen.getByTestId(/section-heading/i);
    expect(sectionHeading).toBeInTheDocument();
    expect(sectionHeading).toHaveTextContent('Parsing');
  });
});
