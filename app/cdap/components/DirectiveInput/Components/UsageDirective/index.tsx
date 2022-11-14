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

import { Box, Divider, Typography } from '@material-ui/core';
import { moreInfoOnDirective } from 'components/DirectiveInput/constants';
import { InfoIcon } from 'components/DirectiveInput/IconStore/InfoIcon';
import { useStyles } from 'components/DirectiveInput/styles';
import { IUsageDirectiveProps } from 'components/DirectiveInput/types';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

const UsageDirectiveWrapper = styled(Box)`
  padding: 10px;
`;

const UsageText = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.15;
  color: #ffffff;
  margin-bottom: 10px;
`;

const DividerLine = styled(Divider)`
  .root {
    background-color: #ffffff;
  }
`;

export default function({ row }: IUsageDirectiveProps) {
  const classes = useStyles();

  return (
    <UsageDirectiveWrapper>
      <UsageText variant="body1" data-testid="directive-usage-text">
        {T.translate('features.WranglerNewUI.GridPage.directivePanel.usage')}:&nbsp;
        {row?.item?.usage || row?.usage} &nbsp; &nbsp;
        {moreInfoOnDirective[row?.item?.directive] && (
          <a
            href={`${moreInfoOnDirective[row?.item?.directive]}`}
            className={classes.infoLink}
            target="_blank"
          >
            {InfoIcon} &nbsp;
            {T.translate('features.WranglerNewUI.GridPage.directivePanel.moreInfoOnDirective')}
          </a>
        )}
      </UsageText>
      <DividerLine />
    </UsageDirectiveWrapper>
  );
}
