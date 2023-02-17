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

import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledMetricCard = styled.div`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  height: 100px;
  margin: 10px;
`;

const StyledMetricNum = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  font-weight: 500;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.87);
`;

const StyledMetricTitle = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  font-weight: 400;
  font-size: 14px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

interface IMetricCardProps {
  title: string | ReactNode;
  metric: number;
}

export const MetricCard = ({ title, metric }: IMetricCardProps) => {
  return (
    <StyledMetricCard>
      <StyledMetricNum>{metric}</StyledMetricNum>
      <StyledMetricTitle>{title}</StyledMetricTitle>
    </StyledMetricCard>
  );
};
