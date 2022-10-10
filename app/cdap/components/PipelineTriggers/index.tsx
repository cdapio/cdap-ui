/*
 * Copyright © 2022 Cask Data, Inc.
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

import React, { useEffect, useState } from 'react';
import CollapsibleSidebar from 'components/shared/CollapsibleSidebar';
import classnames from 'classnames';
import PipelineListTab from 'components/PipelineTriggers/PipelineListTab';
import PipelineListCompositeTab from 'components/PipelineTriggers/PipelineListCompositeTab';
import EnabledTriggersTab from 'components/PipelineTriggers/EnabledTriggersTab';
import { fetchTriggersAndApps } from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersStore from 'components/PipelineTriggers/store/PipelineTriggersStore';
import { Provider } from 'react-redux';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';

const PREFIX = 'features.PipelineTriggers';

require('./PipelineTriggers.scss');

interface IPipelineTriggersViewProps {
  pipelineCompositeTriggersEnabled: boolean;
  pipelineName: string;
  namespace: string;
  pipelineType: string;
}

const PipelineTriggers = ({
  pipelineCompositeTriggersEnabled,
  pipelineName,
  namespace,
  pipelineType,
}: IPipelineTriggersViewProps) => {
  const initState = PipelineTriggersStore.getState().triggers;
  const count = initState.enabledTriggersCount || 0;
  let updateOnce = false;
  const [activeTab, setActiveTab] = useState(count === 0 ? 1 : 0);
  const [tabText, setTabText] = useState(`${PREFIX}.collapsedTabLabel`);
  const [enabledTriggersCount, setEnabledTriggersCount] = useState(count);

  const sub = PipelineTriggersStore.subscribe(() => {
    const state = PipelineTriggersStore.getState().triggers;
    if (state.enabledTriggers.length === enabledTriggersCount) {
      return;
    }

    // This is to set the default tab. During initial construction, the store
    // has not been updated with data, therefore the count is not accurate.
    if (!updateOnce) {
      setEnabledTriggersCount(state.enabledTriggers.length);
      setActiveTab(state.enabledTriggers.length === 0 ? 1 : 0);

      updateOnce = true;
      return;
    }

    setEnabledTriggersCount(state.enabledTriggers.length);
  });

  useEffect(() => {
    PipelineTriggersStore.dispatch({
      type: PipelineTriggersActions.setPipeline,
      payload: {
        pipelineName,
        workflowName: GLOBALS.programId[pipelineType],
        pipelineCompositeTriggersEnabled,
      },
    });

    fetchTriggersAndApps(pipelineName, GLOBALS.programId[pipelineType], namespace);

    return () => {
      if (sub) {
        sub();
      }
    };
  }, []);

  const onToggleSidebar = (isExpanded) => {
    setTabText(isExpanded ? `${PREFIX}.expandedTabLabel` : `${PREFIX}.collapsedTabLabel`);
  };

  const setTab = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    if (activeTab === 0) {
      return <EnabledTriggersTab setTab={setTab} />;
    } else if (activeTab === 1) {
      return pipelineCompositeTriggersEnabled ? (
        <PipelineListCompositeTab setTab={setTab} />
      ) : (
        <PipelineListTab />
      );
    }
  };

  return (
    <CollapsibleSidebar
      data-cy="inbound-triggers-toggle"
      data-testid="inbound-triggers-toggle"
      position="left"
      toggleTabLabel={T.translate(`${tabText}`, {
        count: enabledTriggersCount,
      })}
      backdrop={false}
      onToggle={onToggleSidebar}
    >
      <Provider store={PipelineTriggersStore}>
        <div className="pipeline-triggers-content">
          {pipelineCompositeTriggersEnabled ? null : (
            <div className="tab-headers">
              <div
                className={classnames('tab', { active: activeTab === 0 })}
                onClick={() => setTab(0)}
                data-cy="enabled-triggers-tab"
                data-testid="enabled-triggers-tab"
              >
                {T.translate(`${PREFIX}.EnabledTriggers.tabLabel`, {
                  count: enabledTriggersCount,
                })}
              </div>
              <div
                className={classnames('tab', { active: activeTab === 1 })}
                onClick={() => setTab(1)}
                data-cy="set-triggers-tab"
                data-testid="set-triggers-tab"
              >
                {T.translate(`${PREFIX}.SetTriggers.tabLabel`)}
              </div>
            </div>
          )}

          {renderTabContent()}
        </div>
      </Provider>
    </CollapsibleSidebar>
  );
};

export default PipelineTriggers;
