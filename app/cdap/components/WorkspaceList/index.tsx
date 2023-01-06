/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import Box from '@material-ui/core/Box';
import { grey } from '@material-ui/core/colors';
import Breadcrumb from 'components/Breadcrumb';
import DataPrepStore from 'components/DataPrep/store';
import LoadingSVG from 'components/shared/LoadingSVG';
import { getWidgetData } from 'components/WidgetSVG/utils';
import OngoingDataExplorations from 'components/WrangleHome/Components/OngoingDataExplorations';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';

export const WORKSPACE_LIST_BREADCRUMB_OPTIONS = [
  {
    link: `/ns/${getCurrentNamespace()}/wrangle`,
    label: T.translate('features.WranglerNewUI.Breadcrumb.labels.wrangleHome').toString(),
  },
  {
    label: T.translate('features.WranglerNewUI.Breadcrumb.labels.workSpaces').toString(),
  },
];

const ContainerForLoader = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 0.5;
  background: white;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2000;
`;

const WorkspaceListContainer = styled(Box)`
  margin-top: 30px;
`;

const WorkspaceListHeader = styled(Box)`
  height: 48px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
`;

const WorkspaceListWrapper = styled(Box)`
  padding-bottom: 10px;
`;

export default function() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !(
        DataPrepStore.getState().dataprep.connectorsWithIcons &&
        DataPrepStore.getState().dataprep.connectorsWithIcons.length > 0
      )
    ) {
      getWidgetData();
    }
  }, []);

  return (
    <WorkspaceListWrapper data-testid="workspace-list-parent">
      <WorkspaceListHeader data-testid="workspace-list-body">
        <Breadcrumb breadcrumbsList={WORKSPACE_LIST_BREADCRUMB_OPTIONS} />
      </WorkspaceListHeader>
      <WorkspaceListContainer>
        <OngoingDataExplorations fromAddress={'Workspaces'} setLoading={setLoading} />
      </WorkspaceListContainer>
      {loading && (
        <ContainerForLoader data-testid="workspace-loading-icon">
          <LoadingSVG />
        </ContainerForLoader>
      )}
    </WorkspaceListWrapper>
  );
}
