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
import RenderLabel from 'components/FooterPanel/Components/common/RenderLabel/index';

describe('Testing Render Label Component', () => {
  it('Should render component with text as "Simple"', () => {
    render(
      <RenderLabel type={'simple'}>
        <h1 data-testid="child-for-render-label">Child</h1>
      </RenderLabel>
    );

    const childElement = screen.getByTestId(/child-for-render-label/i);

    // check whether the child element is rendered
    expect(childElement).toBeInTheDocument();

    const simpleLabelComponent = screen.getByTestId(/footerpanel-simple-label/i);

    // checling whether the parent element is rendered according to the props
    expect(simpleLabelComponent).toBeInTheDocument();

    const style = window.getComputedStyle(simpleLabelComponent);

    // checking whether the child is rendered inside the parent element
    expect(simpleLabelComponent).toContainElement(childElement);
  });

  it('Should render component with text as "Outlined"', () => {
    render(
      <RenderLabel type={'outlined'}>
        <h1 data-testid="child-for-render-label">Child</h1>
      </RenderLabel>
    );
    const childElement = screen.getByTestId(/child-for-render-label/i);

    // check whether the child element is rendered
    expect(childElement).toBeInTheDocument();

    const outlineElement = screen.getByTestId(/footerpanel-outlined-label/i);

    // checling whether the parent element is rendered according to the props
    expect(outlineElement).toBeInTheDocument();

    // checking whether the child is rendered inside the parent element
    expect(outlineElement).toContainElement(childElement);

    const style = window.getComputedStyle(outlineElement);

    // checking whether the backgound color is applied as expected
    expect(style.backgroundColor).toBe('rgb(117, 117, 117)');
  });
});
