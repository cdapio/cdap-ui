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

import React, { Fragment } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from 'components/ColumnInsightsPanel/components/DrawerWidgetHeading';

const PREFIX = 'features.WranglerNewUI.ColumnInsights';

const DrawerContainerStyle = styled(Box)`
  width: 471px;
  border-top: 1px solid #3994ff;
  height: calc(100vh - 150px);
  border-right: 1px solid #e0e0e0;
  overflow-y: scroll;
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTextWithBackIcon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

const HeaderRightIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  padding-right: 8px;
`;

const CloseButtonStyle = styled(IconButton)`
cursor: 'pointer'
display: 'flex',
justifyContent: 'flex-end !important',
`;

export default function({ children, closeClickHandler }) {
  return (
    <DrawerContainerStyle role="presentation" data-testid="column-insights-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <DrawerWidgetHeading
            headingText={T.translate(`${PREFIX}.columnInsightsHeadingText`).toString()}
          />
        </HeaderTextWithBackIcon>
        <HeaderRightIconWrapper>
          <CloseButtonStyle
            data-testid="close-icon"
            aria-label="close-icon"
            onClick={closeClickHandler}
          >
            <CloseRoundedIcon color="action" />
          </CloseButtonStyle>
        </HeaderRightIconWrapper>
      </HeaderStyle>
      <Fragment>{children}</Fragment>
    </DrawerContainerStyle>
  );
}
