/*
 * Copyright © 2019 Cask Data, Inc.
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

import * as React from 'react';
import styled from 'styled-components';
import Help from '@material-ui/icons/Help';
import PropertyRowTooltip from './PropertyRowTooltip';

const StyledHelpIcon = styled(Help)`
  color: ${(props) => props.theme.palette.grey[200]};
`;

interface IDescriptionTooltipProps {
  description?: string;
  placement?:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';
}

const DescriptionTooltip: React.FC<IDescriptionTooltipProps> = ({
  description,
  placement = 'left',
}) => {
  if (!description) {
    return null;
  }

  return (
    <PropertyRowTooltip title={description} placement={placement}>
      <StyledHelpIcon />
    </PropertyRowTooltip>
  );
};

export default DescriptionTooltip;
