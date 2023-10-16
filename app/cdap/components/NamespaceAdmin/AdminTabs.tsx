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
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Route, Switch, NavLink } from 'react-router-dom';
import ComputeProfiles from 'components/NamespaceAdmin/ComputeProfiles';
import Preferences from 'components/NamespaceAdmin/Preferences';
import Drivers from 'components/NamespaceAdmin/Drivers';
import Connections from 'components/NamespaceAdmin/Connections';
import { SourceControlManagement } from './SourceControlManagement';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import ServiceAccounts from './ServiceAccounts';

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid #e8e8e8;
  & .MuiTabs-indicator {
    background-color: #1976d2;
  }
`;

const TabsContainer = styled(Box)`
  padding: 16px 0;
`;

const StyledNavLink = styled(NavLink)`
  font-size: 14px;
  font-weight: 500;
  color: #0000008a;
  text-decoration: none;
  &:hover {
    color: #1976d2;
    text-decoration: none;
  }
  &.Mui-selected {
    color: #1976d2;
  }
`;

interface ILinkTabProps {
  label?: string;
  to?: string;
  value?: string;
}

function LinkTab(props: ILinkTabProps) {
  return <Tab component={StyledNavLink} exact {...props} />;
}

export const AdminTabs = () => {
  const namespace = getCurrentNamespace();
  const baseNSPath = `/ns/${namespace}/details`;
  const basepath = '/ns/:namespace/details';
  const { pathname } = useLocation();
  const sourceControlManagementEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.git.enabled'
  );
  const namespacedServiceAccountsEnabled = useFeatureFlagDefaultFalse(
    'feature.namespaced.service.accounts.enabled'
  );

  return (
    <>
      <TabContext value={pathname}>
        <TabsContainer>
          <StyledTabs value={pathname} variant="scrollable" aria-label="admin tabs group">
            <LinkTab label="Compute profiles" to={baseNSPath} value={baseNSPath} />
            <LinkTab
              label="Preferences"
              to={`${baseNSPath}/preferences`}
              value={`${baseNSPath}/preferences`}
            />
            <LinkTab
              label="Connections"
              to={`${baseNSPath}/connections`}
              value={`${baseNSPath}/connections`}
            />
            <LinkTab label="Drivers" to={`${baseNSPath}/drivers`} value={`${baseNSPath}/drivers`} />
            {namespacedServiceAccountsEnabled && (
              <LinkTab
                label="Service Accounts"
                to={`${baseNSPath}/serviceaccounts`}
                value={`${baseNSPath}/serviceaccounts`}
              />
            )}
            {sourceControlManagementEnabled && (
              <LinkTab
                label="Source Control Management"
                to={`${baseNSPath}/scm`}
                value={`${baseNSPath}/scm`}
              />
            )}
          </StyledTabs>
        </TabsContainer>
      </TabContext>
      <div>
        <Switch>
          <Route exact path={basepath} component={ComputeProfiles} />
          <Route exact path={`${basepath}/preferences`} component={Preferences} />
          <Route exact path={`${basepath}/connections`} component={Connections} />
          <Route exact path={`${basepath}/drivers`} component={Drivers} />
          <Route exact path={`${basepath}/scm`} component={SourceControlManagement} />
          {namespacedServiceAccountsEnabled && (
            <Route exact path={`${basepath}/serviceaccounts`} component={ServiceAccounts} />
          )}
        </Switch>
      </div>
    </>
  );
};
