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

import { Box, Divider, Typography, Link } from '@material-ui/core';
import { moreInfoOnDirective, PREFIX } from 'components/DirectiveInput/constants';
import { IDirectiveUsageProps } from 'components/DirectiveInput/types';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const DirectiveWrapper = styled(Box)`
  padding: 10px;
`;

const UsageText = styled(Typography)`
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
  width: 185px;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    color: #79b7ff;
  }
`;

export default function({ eachDirective }: IDirectiveUsageProps) {
  return (
    <DirectiveWrapper data-testid="directive-usage-text-wrapper">
      <UsageText variant="body1" data-testid="directive-usage-text">
        {`${T.translate(`${PREFIX}.usage`)} : `}
        {eachDirective?.item?.usage || eachDirective?.usage}
        {moreInfoOnDirective[eachDirective?.item?.directive] && (
          <InfoLink
            data-testid="info-link"
            href={`${moreInfoOnDirective[eachDirective?.item?.directive]}`}
            target="_blank"
          >
            <InfoOutlinedIcon data-testid="info-icon" />
            {T.translate(`${PREFIX}.moreInfoOnDirective`)}
          </InfoLink>
        )}
      </UsageText>
      <DividerLine />
    </DirectiveWrapper>
  );
}
