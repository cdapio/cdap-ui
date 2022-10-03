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
import WidgetSVG from '../index';

describe('Test Widget Data Component', () => {
  render(<WidgetSVG dataSrc="iALTyuui" />);
  it('should render the component with image from widget api', () => {
    expect(screen.getByTestId('card-image-from-widget-api')).toBeInTheDocument();
  });

  it('should render the component with default avatar', () => {
    render(<WidgetSVG dataSrc={undefined} />);
    expect(screen.getByTestId('card-image-default')).toBeInTheDocument();
  });
});
