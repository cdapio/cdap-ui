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
import RecipeStepsTab from 'components/FooterPanel/Components/RecipeStepsTab/index';
import React from 'react';

describe('Testing Recipe Steps Tab Component', () => {
  it('Should render component with the correct recipeStepsCount number', () => {
    render(<RecipeStepsTab recipeStepsCount={0} />);

    const childElement = screen.getByTestId(/footerpanel-outlined-label/i);

    // Check if the element has inner text as 0
    expect(childElement).toHaveTextContent('0');
  });
});
