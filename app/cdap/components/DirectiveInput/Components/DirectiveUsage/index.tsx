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

import { Box, Divider, Link, Typography } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { MORE_INFO_ON_DIRECTIVE_LINK, PREFIX } from 'components/DirectiveInput/constants';
import { IDirectiveUsage } from 'components/DirectiveInput/types';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

export interface IDirectiveUsageProps {
  directiveUsage: IDirectiveUsage;
}

const DirectiveWrapper = styled(Box)`
  padding: 10px;
`;

const DividerLine = styled(Divider)`
  &.MuiDivider-root {
    background-color: #ffffff;
  }
`;

const InfoLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #79b7ff;
  font-size: 14px;
  text-decoration: none;
  margin-left: 10px;
  width: 217px;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    color: #79b7ff;
  }
`;

const StyledOutlinedIcon = styled(InfoOutlinedIcon)`
  color: #79b7ff;
`;

const DirectivesUsageText = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.15;
  color: #ffffff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
`;

export default function({ directiveUsage }: IDirectiveUsageProps) {
  return (
    <DirectiveWrapper data-testid="directive-usage-text-wrapper">
      <DirectivesUsageText variant="body1" data-testid="directive-usage-text">
        {`${T.translate(`${PREFIX}.usage`)} : `}
        {directiveUsage.item.usage || directiveUsage.usage}
        {MORE_INFO_ON_DIRECTIVE_LINK[directiveUsage.item.directive] && (
          <InfoLink
            data-testid="info-link"
            href={`${MORE_INFO_ON_DIRECTIVE_LINK[directiveUsage.item.directive]}`}
            target="_blank"
          >
            g
            <StyledOutlinedIcon data-testid="info-icon" />
            {T.translate(`${PREFIX}.moreInfoOnDirective`)}
          </InfoLink>
        )}
      </DirectivesUsageText>
      <DividerLine />
    </DirectiveWrapper>
  );
}
