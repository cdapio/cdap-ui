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
import T from 'i18n-react';
import React from 'react';
import RenderLabel from 'components/ColumnInsightsPanel/components/common/RenderLabel/index';

const PREFIX = 'features.WranglerNewUI.ColumnInsights';
describe('It should test RenderLabel Component', () => {
  it('Should test whether RenderLabel Component is rendered and in the Document', () => {
    render(
      <RenderLabel
        children={<> {T.translate(`${PREFIX}.viewFullChart`).toString()}</>}
        fontSize={14}
        color={'#fff'}
        dataTestId={'render-label-testing'}
      />
    );
    const renderLabel = screen.getByTestId(/render-label-testing/i);
    expect(renderLabel).toBeInTheDocument();
  });
  it('Should test whether RenderLabel Component is rendered when fontsize and color is not sent as props', () => {
    render(
      <RenderLabel
        children={<> {T.translate(`${PREFIX}.viewFullChart`).toString()}</>}
        dataTestId={'render-label-testing'}
      />
    );
    const renderLabel = screen.getByTestId(/render-label-testing/i);
    expect(renderLabel).toBeInTheDocument();
  });
});
