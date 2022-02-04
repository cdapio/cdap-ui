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
import T from 'i18n-react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

const PREFIX = 'features.Cloud.Profiles';

const Badge = styled.span`
  color: #fff;
  font-size: 0.85rem;
  background: var(--brand-primary-color);
  padding: 2px 6px;
  display: inline-block;
  border-radius: 20px;
  margin-left: 6px;
  cursor: pointer;
`;

const BadgeTooltip = withStyles(() => {
  return {
    tooltip: {
      backgroundColor: '#999',
      fontSize: '1rem',
    },
  };
})(Tooltip);

interface IProperty {
  name: string;
  value: string;
  isEditable: boolean;
}

interface IAutoScaleBadgeProps {
  properties: IProperty[];
}

const AutoScaleBadge = ({ properties = [] }: IAutoScaleBadgeProps) => {
  const hasAutoScaling = properties.some(
    (property) =>
      (property.name === 'autoScalingPolicy' && property.value !== '') ||
      (property.name === 'enablePredefinedAutoScaling' && property.value === 'true')
  );
  if (!hasAutoScaling) {
    return null;
  }
  return (
    <BadgeTooltip title={T.translate(`${PREFIX}.common.autoScaleTooltip`)}>
      <Badge>{T.translate(`${PREFIX}.common.autoScaleBadge`)}</Badge>
    </BadgeTooltip>
  );
};

export default AutoScaleBadge;
