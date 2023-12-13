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
import { FeatureProvider } from 'services/react/providers/featureFlagProvider';
import { getNamespacePipelineList, getRemotePipelineList } from './store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';

const PREFIX = 'features.SourceControlManagement';

const StyledDiv = styled.div`
  padding: 10px;
  margin-top: 10px;
`;

const ScmSyncTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
    // refetch latest pipeline data, while displaying possibly stale data
    if (newValue === 0) {
      getNamespacePipelineList(getCurrentNamespace(), nameFilter);
    } else {
      getRemotePipelineList(getCurrentNamespace());
    }
  };

  return (
    <>
      <StyledDiv>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab data-testid="local-pipeline-tab" label={T.translate(`${PREFIX}.push.tab`)} />
          <Tab data-testid="remote-pipeline-tab" label={T.translate(`${PREFIX}.pull.tab`)} />
        </Tabs>
      </StyledDiv>
      <FeatureProvider>
        <StyledDiv>
          {tabIndex === 0 ? <LocalPipelineListView /> : <RemotePipelineListView />}
        </StyledDiv>
      </FeatureProvider>
    </>
  );
};

export default ScmSyncTabs;
