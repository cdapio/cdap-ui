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

import React from 'react';
import { render, screen } from '@testing-library/react';

import { LastUpdatedRecipes } from 'components/RecipeManagement/LastUpdatedRecipes';

describe('Test Last updated recipes in Home page', () => {
  it('Should render LastUpdatedRecipes component', () => {
    render(<LastUpdatedRecipes></LastUpdatedRecipes>);
    const ele = screen.getByTestId(/last-updated-recipes-homepage/i);
    expect(ele).toBeInTheDocument();
  });
});
