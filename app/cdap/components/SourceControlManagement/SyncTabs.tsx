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

import { Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalPipelineListView } from './LocalPipelineListView';
import styled from 'styled-components';
import T from 'i18n-react';
import { RemotePipelineListView } from './RemotePipelineListView';
import {
  getNamespacePipelineList,
  getRemotePipelineList,
  setSyncStatusOfAllPipelines,
} from './store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { OperationsHistoryView } from './OperationsHistoryView';

const PREFIX = 'features.SourceControlManagement';

const StyledDiv = styled.div`
  padding: 4px 10px;
`;

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid #e8e8e8;
`;

const ScmSyncTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const multiPushEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.multi.app.enabled'
  );

  const { ready: pushStateReady, nameFilter } = useSelector(({ push }) => push);
  useEffect(() => {
    if (!pushStateReady) {
      getNamespacePipelineList(getCurrentNamespace(), nameFilter);
    }
  }, [pushStateReady]);

  const { ready: pullStateReady } = useSelector(({ pull }) => pull);
  useEffect(() => {
    if (!pullStateReady) {
      getRemotePipelineList(getCurrentNamespace());
    }
  }, [pullStateReady]);

  useEffect(() => {
    if (pushStateReady && pullStateReady) {
      setSyncStatusOfAllPipelines();
    }
  }, [pushStateReady, pullStateReady]);

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
    // refetch latest pipeline data, while displaying possibly stale data
    if (newValue === 0) {
      getNamespacePipelineList(getCurrentNamespace(), nameFilter);
    } else {
      getRemotePipelineList(getCurrentNamespace());
    }
  };

  const renderTabContent = () => {
    if (tabIndex === 0) {
      return <LocalPipelineListView />;
    }

    if (tabIndex === 1) {
      return <RemotePipelineListView />;
    }

    if (tabIndex === 2) {
      return <OperationsHistoryView />;
    }

    return null;
  };

  return (
    <>
      <StyledDiv>
        <StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab data-testid="local-pipeline-tab" label={T.translate(`${PREFIX}.push.tab`)} />
          <Tab data-testid="remote-pipeline-tab" label={T.translate(`${PREFIX}.pull.tab`)} />
          {multiPushEnabled && (
            <Tab
              data-testid="operation-history-tab"
              label={T.translate(`${PREFIX}.operationHistory.tab`)}
            />
          )}
        </StyledTabs>
      </StyledDiv>
      <StyledDiv>{renderTabContent()}</StyledDiv>
    </>
  );
};

export default ScmSyncTabs;
