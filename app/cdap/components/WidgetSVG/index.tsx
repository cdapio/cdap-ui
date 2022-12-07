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

import { Avatar } from '@material-ui/core';
import ImageOutlined from '@material-ui/icons/ImageOutlined';
import { IWidgetSVGProps } from 'components/WidgetSVG/types';
import React from 'react';
import styled from 'styled-components';

const StyledImageOutlined = styled(ImageOutlined)`
  font-size: 40px;
`;

export default function({ imageSource, label }: IWidgetSVGProps) {
  return imageSource ? (
    <Avatar src={imageSource} variant="square" data-testid={`widget-api-image-${label}`} />
  ) : (
    <StyledImageOutlined data-testid={`default-widget-image-${label}`} />
  );
}
