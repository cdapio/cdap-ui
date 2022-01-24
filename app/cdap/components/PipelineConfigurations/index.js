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

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
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
};

export default class PipelineConfigurations extends Component {
  static propTypes = {
    open: PropTypes.func,
    onClose: PropTypes.func,
    anchorEl: PropTypes.oneOf([PropTypes.element, PropTypes.string]),
    isDetailView: PropTypes.bool,
    isPreview: PropTypes.bool,
    pipelineType: PropTypes.string,
    isHistoricalRun: PropTypes.bool,
    action: PropTypes.string,
    pipelineName: PropTypes.string,
  };

  static defaultProps = {
    isDetailView: false,
    isPreview: false,
    pipelineType: GLOBALS.etlDataPipeline,
  };

  componentDidMount() {
    if (!this.props.isDetailView) {
      return;
    }
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_MODELESS_OPEN_STATUS,
      payload: { open: true },
    });

    let { pipelineType, isDetailView, isHistoricalRun, isPreview } = this.props;

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
      let state = PipelineConfigurationsStore.getState();
      if (!state.modelessOpen) {
        this.props.onClose();
        this.storeSubscription();
      }
    });
  }

  componentWillUnmount() {
    if (this.storeSubscription) {
      this.storeSubscription();
    }
  }

  getHeaderLabel() {
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

  renderHeader() {
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

  render() {
    let tabs;
    if (GLOBALS.etlBatchPipelines.includes(this.props.pipelineType)) {
      tabs = [
        TABS.computeConfig,
        TABS.pipelineConfig,
        TABS.engineConfig,
        TABS.pushdown,
        TABS.resources,
        TABS.alerts,
      ];
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
      defaultTab: 1,
    };
    return (
      <PipelineModeless
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        onClose={this.props.onClose}
        title={this.getHeaderLabel()}
        popoverClassName="pipeline-config-modal"
      >
        <Provider store={PipelineConfigurationsStore}>
          <div
            className="pipeline-configurations-content"
            ref={(ref) => (this.configModeless = ref)}
          >
            <div className="pipeline-config-tabs-wrapper">
              <ConfigurableTab tabConfig={tabConfig} />
              <ConfigModelessActionButtons onClose={this.props.onClose} />
            </div>
          </div>
        </Provider>
      </PipelineModeless>
    );
  }
}
