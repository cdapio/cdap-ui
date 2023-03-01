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
import { EntityTopPanel } from 'components/EntityTopPanel';
import React, { useState } from 'react';
import { LocalPipelineListView } from './LocalPipelineListView';
import { Provider } from 'react-redux';
import SourceControlManagementSyncStore from './store';
import styled from 'styled-components';
import T from 'i18n-react';

const PREFIX = 'features.SourceControlManagement';

const StyledDiv = styled.div`
  padding: 10px;
  margin-top: 10px;
`;

const SourceControlManagementSyncView = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Provider store={SourceControlManagementSyncStore}>
      <EntityTopPanel
        title={T.translate(`${PREFIX}.syncButton`).toString()}
        closeBtnAnchorLink={() => history.back()}
        breadCrumbAnchorLabel={T.translate('commons.namespaceAdmin').toString()}
        onBreadCrumbClick={() => history.back()}
      />
      <StyledDiv>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={T.translate(`${PREFIX}.push.tab`)} />
          <Tab label={T.translate(`${PREFIX}.pull.tab`)} />
        </Tabs>
      </StyledDiv>
      <StyledDiv>{tabIndex === 0 && <LocalPipelineListView />}</StyledDiv>
    </Provider>
  );
};

export default SourceControlManagementSyncView;
