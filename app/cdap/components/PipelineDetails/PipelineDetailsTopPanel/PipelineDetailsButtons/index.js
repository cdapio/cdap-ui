/*
 * Copyright © 2018 Cask Data, Inc.
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
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import PipelineScheduleButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons/PipelineScheduleButton';
import PipelineConfigureButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons/PipelineConfigureButton';
import PipelineStopButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons/PipelineStopButton';
import PipelineRunButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons/PipelineRunButton';
import PipelineSummaryButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons/PipelineSummaryButton';
import { PipelineHistoryButton } from './PipelineHistoryButton';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../../../../../../graphql/fragments/fragmentTypes.json';
import Cookies from 'universal-cookie';
import SessionTokenStore from 'services/SessionTokenStore';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

const cookie = new Cookies();
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({ fragmentMatcher }),
  request: (operation) => {
    if (window.CDAP_CONFIG.securityEnabled && cookie.get('CDAP_Auth_Token')) {
      const token = `Bearer ${cookie.get('CDAP_Auth_Token')}`;

      operation.setContext({
        headers: {
          authorization: token,
          'Session-Token': SessionTokenStore.getState(),
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } else {
      operation.setContext({
        headers: {
          'Session-Token': SessionTokenStore.getState(),
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    }
  },
});

const mapStateToConfigureButton = (state, ownProps) => {
  return {
    pipelineType: ownProps.pipelineType,
    pipelineName: ownProps.pipelineName,
    resolvedMacros: state.resolvedMacros,
    runtimeArgs: state.runtimeArgs,
    isLatestVersion: ownProps.isLatestVersion,
  };
};

const mapStateToRunButton = (state, ownProps) => {
  return {
    pipelineType: ownProps.pipelineType,
    pipelineName: ownProps.pipelineName,
    runButtonLoading: ownProps.runButtonLoading,
    runError: ownProps.runError,
    runtimeArgs: state.runtimeArgs,
    isLatestVersion: ownProps.isLatestVersion,
  };
};

const mapStateToScheduleButton = (state, ownProps) => {
  return {
    pipelineType: ownProps.pipelineType,
    pipelineName: ownProps.pipelineName,
    schedule: ownProps.schedule,
    maxConcurrentRuns: ownProps.maxConcurrentRuns,
    scheduleStatus: ownProps.scheduleStatus,
    scheduleButtonLoading: ownProps.scheduleButtonLoading,
    scheduleError: ownProps.scheduleError,
    runtimeArgs: state.runtimeArgs,
    isLatestVersion: ownProps.isLatestVersion,
  };
};

const ConnectedConfigureButton = connect(mapStateToConfigureButton)(PipelineConfigureButton);
const ConnectedRunButton = connect(mapStateToRunButton)(PipelineRunButton);
const ConnectedScheduleButton = connect(mapStateToScheduleButton)(PipelineScheduleButton);

export default function PipelineDetailsButtons({
  pipelineType,
  pipelineName,
  schedule,
  maxConcurrentRuns,
  scheduleStatus,
  runs,
  currentRun,
  runButtonLoading,
  runError,
  scheduleButtonLoading,
  scheduleError,
  stopButtonLoading,
  stopError,
  change,
}) {
  const isLatestVersion = change ? change.latest : true;
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  return (
    <ApolloProvider client={client}>
      <Provider store={PipelineConfigurationsStore}>
        <div className="pipeline-details-buttons">
          <ConnectedConfigureButton
            pipelineType={pipelineType}
            pipelineName={pipelineName}
            isLatestVersion={isLatestVersion}
          />
          <ConnectedScheduleButton
            pipelineType={pipelineType}
            pipelineName={pipelineName}
            schedule={schedule}
            maxConcurrentRuns={maxConcurrentRuns}
            scheduleStatus={scheduleStatus}
            scheduleButtonLoading={scheduleButtonLoading}
            scheduleError={scheduleError}
            isLatestVersion={isLatestVersion}
          />
          <PipelineStopButton
            pipelineType={pipelineType}
            pipelineName={pipelineName}
            runs={runs}
            currentRun={currentRun}
            stopButtonLoading={stopButtonLoading}
            stopError={stopError}
          />
          <ConnectedRunButton
            pipelineType={pipelineType}
            pipelineName={pipelineName}
            runButtonLoading={runButtonLoading}
            runError={runError}
            isLatestVersion={isLatestVersion}
          />
          <PipelineSummaryButton pipelineType={pipelineType} pipelineName={pipelineName} />
          {lifecycleManagementEditEnabled && <PipelineHistoryButton pipelineName={pipelineName} />}
        </div>
      </Provider>
    </ApolloProvider>
  );
}

PipelineDetailsButtons.propTypes = {
  pipelineType: PropTypes.string,
  pipelineName: PropTypes.string,
  schedule: PropTypes.string,
  maxConcurrentRuns: PropTypes.number,
  scheduleStatus: PropTypes.string,
  runs: PropTypes.array,
  currentRun: PropTypes.object,
  runButtonLoading: PropTypes.bool,
  runError: PropTypes.string,
  scheduleButtonLoading: PropTypes.bool,
  scheduleError: PropTypes.string,
  stopButtonLoading: PropTypes.bool,
  stopError: PropTypes.string,
  change: PropTypes.object,
};
