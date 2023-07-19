/*
 * Copyright © 2021 Cask Data, Inc.
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
import { connect } from 'react-redux';
import ProfileMetric from 'components/NamespaceAdmin/Metrics/ProfileMetric';
import MetricCard from 'components/NamespaceAdmin/Metrics/MetricCard';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';

const CardsContainer = styled(Box)`
  display: grid;
  grid-auto-flow: column;
  column-gap: 20px;
  padding: 16px 0;
`;

interface IMetricsProps {
  pipelinesCount: number;
  datasetsCount: number;
  preferencesCount: number;
  driversCount: number;
  connectionsCount: number;
}

const MetricsView: React.FC<IMetricsProps> = ({
  pipelinesCount,
  datasetsCount,
  preferencesCount,
  driversCount,
  connectionsCount,
}) => {
  return (
    <CardsContainer>
      <MetricCard title="pipelines" metric={pipelinesCount}></MetricCard>
      <MetricCard title="datasets" metric={datasetsCount}></MetricCard>
      <ProfileMetric />
      <MetricCard title="preferences" metric={preferencesCount}></MetricCard>
      <MetricCard title="connections" metric={connectionsCount}></MetricCard>
      <MetricCard title="drivers" metric={driversCount}></MetricCard>
    </CardsContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    pipelinesCount: state.pipelinesCount,
    datasetsCount: state.datasetsCount,
    preferencesCount: state.preferences.length,
    driversCount: state.drivers.length,
    connectionsCount: state.connections.length,
  };
};

const Metrics = connect(mapStateToProps)(MetricsView);
export default Metrics;
