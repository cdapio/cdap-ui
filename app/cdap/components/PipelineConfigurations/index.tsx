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

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import ConfigModelessActionButtons from 'components/PipelineConfigurations/ConfigurationsContent/ConfigModelessActionButtons';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
import ConfigurableTab from 'components/shared/ConfigurableTab';
import { GLOBALS } from 'services/global-constants';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';

import PipelineConfigTabContent from 'components/PipelineConfigurations/ConfigurationsContent/PipelineConfigTabContent';
import EngineConfigTabContent from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent';
import ResourcesTabContent from 'components/PipelineConfigurations/ConfigurationsContent/ResourcesTabContent';
import AlertsTabContent from 'components/PipelineConfigurations/ConfigurationsContent/AlertsTabContent';
import ComputeTabContent from 'components/PipelineConfigurations/ConfigurationsContent/ComputeTabContent';
import PushdownTabContent from './ConfigurationsContent/PushdownTabContent';
import { RuntimeTabContent } from './ConfigurationsContent/RuntimeTabContent';
import PreviewTabContent from './ConfigurationsContent/PreviewTabContent';

require('./PipelineConfigurations.scss');
require('./ConfigurationsContent/ConfigurationsContent.scss');

const PREFIX = 'features.PipelineConfigurations';

const TABS = {
  computeConfig: {
    id: 1,
    name: T.translate(`${PREFIX}.ComputeConfig.title`),
    content: <ComputeTabContent />,
    contentClassName: 'pipeline-configurations-body compute-profile-tab',
    paneClassName: 'configuration-content',
  },
  pipelineConfig: {
    id: 2,
    name: T.translate(`${PREFIX}.PipelineConfig.title`),
    content: <PipelineConfigTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  engineConfig: {
    id: 3,
    name: T.translate(`${PREFIX}.EngineConfig.title`),
    content: <EngineConfigTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  pushdown: {
    id: 4,
    name: T.translate(`${PREFIX}.Pushdown.title`),
    content: <PushdownTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  resources: {
    id: 5,
    name: T.translate(`${PREFIX}.Resources.title`),
    content: <ResourcesTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  alerts: {
    id: 6,
    name: T.translate(`${PREFIX}.Alerts.title`),
    content: <AlertsTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  runtimeConfig: {
    id: 7,
    name: T.translate(`${PREFIX}.RuntimeConfig.title`),
    content: <RuntimeTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
  previewConfig: {
    id: 8,
    name: T.translate(`${PREFIX}.PreviewConfig.title`),
    content: <PreviewTabContent />,
    contentClassName: 'pipeline-configurations-body',
    paneClassName: 'configuration-content',
  },
};

interface IPipelineConfigurationsProps {
  open: boolean;
  onClose: () => void;
  anchorEl: any;
  isDetailView: boolean;
  isPreview?: boolean;
  pipelineType: string;
  isHistoricalRun?: boolean;
  action?: string;
  pipelineName: string;
  isDeployed?: boolean;
  artifact?: object;
  actionCreator?: any;
  applyRuntimeArguments?: (runtimeArgs: any) => void;
  studioRunPipeline?: () => void;
  getPostActions?: () => any[];
  applyBatchConfig?: (...args) => void;
  applyRealtimeConfig?: (...args) => void;
  validatePluginProperties?: (action: any, errorCb: any) => void;
  getRuntimeArgs?: () => any;
}

export default class PipelineConfigurations extends Component<IPipelineConfigurationsProps> {
  public storeSubscription: () => void;
  public configModeless: any;

  public static defaultProps = {
    isDetailView: false,
    isPreview: false,
    isDeployed: true,
    pipelineType: GLOBALS.etlDataPipeline,
  };

  public componentDidMount() {
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_MODELESS_OPEN_STATUS,
      payload: { open: true },
    });

    const { pipelineType, isDetailView, isHistoricalRun, isPreview } = this.props;
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_PIPELINE_VISUAL_CONFIGURATION,
      payload: {
        pipelineVisualConfiguration: {
          pipelineType,
          isDetailView,
          isHistoricalRun,
          isPreview,
        },
      },
    });

    this.storeSubscription = PipelineConfigurationsStore.subscribe(() => {
      const state = PipelineConfigurationsStore.getState();
      if (!state.modelessOpen) {
        this.props.onClose();
        this.storeSubscription();
      }
    });

    if (!this.props.isDetailView) {
      TABS.runtimeConfig.content = <RuntimeTabContent getRuntimeArgs={this.props.getRuntimeArgs} />;
    }
  }

  public componentWillUnmount() {
    if (this.storeSubscription) {
      this.storeSubscription();
    }
  }

  public getHeaderLabel() {
    let headerLabel;
    if (this.props.isHistoricalRun) {
      headerLabel = T.translate(`${PREFIX}.titleHistorical`);
    } else {
      headerLabel = T.translate(`${PREFIX}.title`);
      if (this.props.pipelineName.length) {
        headerLabel += ` "${this.props.pipelineName}"`;
      }
    }
    return headerLabel;
  }

  public renderHeader() {
    let headerLabel;
    if (this.props.isHistoricalRun) {
      headerLabel = T.translate(`${PREFIX}.titleHistorical`);
    } else {
      headerLabel = T.translate(`${PREFIX}.title`);
      if (this.props.pipelineName.length) {
        headerLabel += ` "${this.props.pipelineName}"`;
      }
    }
    return (
      <div className="pipeline-configurations-header modeless-header">
        <div className="modeless-title">{headerLabel}</div>
        <div className="btn-group">
          <a className="btn" onClick={this.props.onClose} data-testid="close-modeless">
            <IconSVG name="icon-close" />
          </a>
        </div>
      </div>
    );
  }

  public render() {
    let tabs;
    let defaultTab = 1;
    if (!this.props.isDeployed && this.props.isPreview) {
      tabs = [TABS.runtimeConfig, TABS.previewConfig, TABS.pipelineConfig, TABS.engineConfig];
      defaultTab = 7;
    } else if (
      GLOBALS.etlBatchPipelines.includes(this.props.pipelineType) &&
      !this.props.isDeployed
    ) {
      const studioAlerts = { ...TABS.alerts };
      studioAlerts.content = (
        <AlertsTabContent
          isDeployed={this.props.isDeployed}
          artifact={this.props.artifact}
          actionCreator={this.props.actionCreator}
          getPostActions={this.props.getPostActions}
          validatePluginProperties={this.props.validatePluginProperties}
        />
      );
      tabs = [TABS.pipelineConfig, TABS.engineConfig, TABS.resources, studioAlerts];
      defaultTab = 2;
    } else if (GLOBALS.etlBatchPipelines.includes(this.props.pipelineType)) {
      tabs = [
        TABS.computeConfig,
        TABS.pipelineConfig,
        TABS.engineConfig,
        TABS.pushdown,
        TABS.resources,
        TABS.alerts,
      ];
    } else if (this.props.pipelineType === GLOBALS.etlDataStreams && !this.props.isDeployed) {
      tabs = [
        TABS.pipelineConfig,
        TABS.engineConfig,
        TABS.resources,
        // no alerts tab for realtime pipelines
      ];
      defaultTab = 2;
    } else if (this.props.pipelineType === GLOBALS.etlDataStreams) {
      tabs = [
        TABS.computeConfig,
        TABS.pipelineConfig,
        TABS.engineConfig,
        TABS.resources,
        // no alerts tab for realtime pipelines
      ];
    } else if (this.props.pipelineType === GLOBALS.eltSqlPipeline) {
      // Only show pipeline config, compute config, and resource config for now
      tabs = [TABS.computeConfig, TABS.pipelineConfig, TABS.engineConfig];
    }
    const tabConfig = {
      tabs,
      layout: 'vertical',
      defaultTab,
    };
    return (
      <PipelineModeless
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        title={this.getHeaderLabel()}
        popoverClassName="pipeline-config-modal"
        isDeployed={this.props.isDeployed}
      >
        <Provider store={PipelineConfigurationsStore}>
          <div
            className="pipeline-configurations-content"
            ref={(ref) => (this.configModeless = ref)}
          >
            <div className="pipeline-config-tabs-wrapper">
              <ConfigurableTab tabConfig={tabConfig} />
              <ConfigModelessActionButtons
                onClose={this.props.onClose}
                isDeployed={this.props.isDeployed}
                applyRuntimeArguments={this.props.applyRuntimeArguments}
                isPreview={this.props.isPreview}
                studioRunPipeline={this.props.studioRunPipeline}
                applyBatchConfig={this.props.applyBatchConfig}
                applyRealtimeConfig={this.props.applyRealtimeConfig}
                pipelineType={this.props.pipelineType}
              />
            </div>
          </div>
        </Provider>
      </PipelineModeless>
    );
  }
}
