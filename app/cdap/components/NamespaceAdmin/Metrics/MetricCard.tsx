/*
 * Copyright © 2023 Cask Data, Inc.
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
import { Box, Card, CardContent } from '@material-ui/core';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  box-shadow: 0px 4px 4px 0px #00000040;
`;

const MetricBox = styled(Box)`
  color: #000000de;
  font-size: 20px;
  padding-bottom: 16px;
`;

const TitleBox = styled(Box)`
  color: #00000099;
  font-size: 14px;
`;

interface IMetricCard {
  title: string;
  metric: number;
}

const MetricCard = ({ title, metric }: IMetricCard) => {
  return (
    <StyledCard>
      <CardContent>
        <MetricBox>{metric}</MetricBox>
        <TitleBox>{title.toUpperCase()}</TitleBox>
      </CardContent>
    </StyledCard>
  );
};

export default MetricCard;
