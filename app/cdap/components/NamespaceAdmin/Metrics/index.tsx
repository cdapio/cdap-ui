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
import MetricColumn from 'components/NamespaceAdmin/Metrics/MetricColumn';
import { connect } from 'react-redux';

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
      gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr',

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
  profilesCount: number;
  preferencesCount: number;
  driversCount: number;
}

const MetricsView: React.FC<IMetricsProps> = ({
  pipelinesCount,
  datasetsCount,
  profilesCount,
  preferencesCount,
  driversCount,
}) => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.entitySection}>
          <MetricColumn title="pipelines" metric={pipelinesCount} />
          <MetricColumn title="datasets" metric={datasetsCount} />
        </div>
        <MetricColumn title="profiles" metric={profilesCount} />
        <MetricColumn title="preferences" metric={preferencesCount} />
        <MetricColumn title="connections" metric={15} />
        <MetricColumn title="drivers" metric={driversCount} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    pipelinesCount: state.pipelinesCount,
    datasetsCount: state.datasetsCount,
    profilesCount: state.profilesCount,
    preferencesCount: state.preferences.length,
    driversCount: state.drivers.length,
  };
};

const Metrics = connect(mapStateToProps)(MetricsView);
export default Metrics;
