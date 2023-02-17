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
import makeStyles from '@material-ui/core/styles/makeStyles';
import { connect } from 'react-redux';
import ProfileMetric from 'components/NamespaceAdmin/Metrics/ProfileMetric';
import { MetricCard } from './MetricCard';
import T from 'i18n-react';

const PREFIX = 'features.NamespaceAdmin.metrics';

const useStyle = makeStyles((theme) => {
  const border = `1px solid ${theme.palette.grey[100]}`;

  return {
    root: {
      borderTop: border,
      borderBottom: border,
      paddingTop: '15px',
      paddingBottom: '15px',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 2fr',

      '& > div:not(:last-child)': {
        borderRight: `1px solid ${theme.palette.grey[300]}`,
      },
    },
    entitySection: {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
    },
  };
});

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
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <MetricCard title={T.translate(`${PREFIX}.pipelines`)} metric={pipelinesCount} />
        <MetricCard title={T.translate(`${PREFIX}.datasets`)} metric={datasetsCount} />
        <ProfileMetric title={T.translate(`${PREFIX}.profiles`)} />
        <MetricCard title={T.translate(`${PREFIX}.preferences`)} metric={preferencesCount} />
        <MetricCard title={T.translate(`${PREFIX}.connections`)} metric={connectionsCount} />
        <MetricCard title={T.translate(`${PREFIX}.drivers`)} metric={driversCount} />
      </div>
    </div>
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
