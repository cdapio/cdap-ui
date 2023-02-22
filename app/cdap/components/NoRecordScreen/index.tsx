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

import { Box, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { NoDataSVG } from 'components/GridTable/iconStore';
import { useStyles } from 'components/NoRecordScreen/styles';
import { INoDataScreenProps } from 'components/NoRecordScreen/types';
import { NormalFont, SubHeadBoldFont } from 'components/WranglerV2/Label';
import React from 'react';
import styled from 'styled-components';

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;
`;

export default function({ title, subtitle }: INoDataScreenProps) {
  const classes = useStyles();
  return (
    <Container>
      <SubHeadBoldFont component="p" data-testid="no-record-screen-title">
        {title}
      </SubHeadBoldFont>
      <NormalFont component="p" data-testid="no-record-screen-sub-title">
        {subtitle}
      </NormalFont>
    </Container>
  );
}
