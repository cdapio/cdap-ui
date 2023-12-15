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

import { EntityTopPanel } from 'components/EntityTopPanel';
import React from 'react';
import { Provider } from 'react-redux';
import SourceControlManagementSyncStore from './store';
import T from 'i18n-react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useHistory } from 'react-router';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import { reset, resetRemote } from './store/ActionCreator';
import ScmSyncTabs from './SyncTabs';

const PREFIX = 'features.SourceControlManagement';

const SourceControlManagementSyncView = () => {
  const history = useHistory();
  useOnUnmount(() => {
    resetRemote();
    reset();
  });

  const closeAndBackLink = `/ns/${getCurrentNamespace()}/details/scm`;

  return (
    <Provider store={SourceControlManagementSyncStore}>
      <EntityTopPanel
        title={T.translate(`${PREFIX}.syncButton`).toString()}
        closeBtnAnchorLink={() => {
          history.push(closeAndBackLink);
        }}
        breadCrumbAnchorLabel={T.translate('commons.namespaceAdmin').toString()}
        onBreadCrumbClick={() => {
          history.push(closeAndBackLink);
        }}
      />
      <ScmSyncTabs />
    </Provider>
  );
};

export default SourceControlManagementSyncView;
