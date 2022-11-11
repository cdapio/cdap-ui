/*
 * Copyright © 2017-2018 Cask Data, Inc.
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

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import DataPrepTopPanel from 'components/DataPrep/TopPanel';
import DataPrepContentWrapper from 'components/DataPrep/DataPrepContentWrapper';
import DataPrepLoading from 'components/DataPrep/DataPrepLoading';
import DataPrepErrorAlert from 'components/DataPrep/DataPrepErrorAlert';
import MyDataPrepApi from 'api/dataprep';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import DataPrepServiceControl from 'components/DataPrep/DataPrepServiceControl';
import ee from 'event-emitter';
import { setWorkspace, getWorkspaceList } from 'components/DataPrep/store/DataPrepActionCreator';
import WorkspaceTabs from 'components/DataPrep/WorkspaceTabs';
import IconSVG from 'components/shared/IconSVG';
import classnames from 'classnames';
import { checkDataPrepHigherVersion } from 'components/DataPrep/helper';
import { isNilOrEmpty, isNilOrEmptyString } from 'services/helpers';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import T from 'i18n-react';
import isEmpty from 'lodash/isEmpty';
import Helmet from 'react-helmet';
import { Theme } from 'services/ThemeHelper';
import globalEvents from 'services/global-events';

require('./DataPrep.scss');

const i18nPrefix = 'features.DataPrep.Upgrade';
const DATAPREP_I18N_PREFIX = 'features.DataPrep';
const MIN_DATAPREP_VERSION = '4.0.0-SNAPSHOT';
const artifactName = 'wrangler-service';

export { i18nPrefix, MIN_DATAPREP_VERSION, artifactName };
/**
 *  Data Prep requires a container component (DataPrepHome) that will handle routing within React.
 *  This is beacause DataPrep component will be included in Pipelines.
 **/
export default class DataPrep extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backendDown: false,
      loading: true,
      onSubmitError: null,
      currentWorkspace: null,
      sidePanelToggle: false,
      workspaceName: null,
      workspaceError: {},
    };

    this.toggleBackendDown = this.toggleBackendDown.bind(this);
    this.onSidePanelToggle = this.onSidePanelToggle.bind(this);
    this.closeSidePanel = this.closeSidePanel.bind(this);
    this.eventEmitter = ee(ee);

    this.eventEmitter.on('DATAPREP_BACKEND_DOWN', this.toggleBackendDown);
    this.eventEmitter.on('DATAPREP_CLOSE_SIDEPANEL', this.closeSidePanel);
    this.eventEmitter.on('REFRESH_DATAPREP', this.refreshDataPrep);
  }

  componentDidMount() {
    this._isMounted = true;
    this.checkBackendUp(this.props);
    checkDataPrepHigherVersion();
    this.storeSub = DataPrepStore.subscribe(() => {
      let state = DataPrepStore.getState();
      // only update if the new error is different than existing one
      if (
        state.error.workspaceError &&
        state.error.workspaceError.message !== this.state.workspaceError.message &&
        state.error.workspaceError.statusCode !== this.state.workspaceError.statusCode
      ) {
        if (this.props.mode !== 'ROUTED_WORKSPACE') {
          this.setState({ workspaceError: state.error.workspaceError }, () => {
            this.eventEmitter.emit(globalEvents.PAGE_LEVEL_ERROR, {
              data: this.state.workspaceError.message,
              statusCode: this.state.workspaceError.statusCode,
            });
          });
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.workspaceId !== nextProps.workspaceId || this.props.mode !== nextProps.mode) {
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.props.onSubmit) {
      let workspaceId = DataPrepStore.getState().dataprep.workspaceId;
      this.props.onSubmit({ workspaceId, onUnmount: true });
    }
    DataPrepStore.dispatch({
      type: DataPrepActions.reset,
    });
    this.eventEmitter.off('DATAPREP_BACKEND_DOWN', this.toggleBackendDown);
    this.eventEmitter.off('DATAPREP_CLOSE_SIDEPANEL', this.closeSidePanel);
    this.eventEmitter.off('REFRESH_DATAPREP', this.refreshDataPrep);
    if (this.dataprepStoreSubscription) {
      this.dataprepStoreSubscription();
    }
    this.storeSub();
  }

  refreshDataPrep = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        /*
        Not sure if this is necessary but added it is safer when doing an upgrade.
        - Modified directives?
        - Modified API calls that are not compatible with earlier version?
      */
        DataPrepStore.dispatch({
          type: DataPrepActions.reset,
        });
        let workspaceId = this.props.workspaceId;
        this.setCurrentWorkspace(workspaceId);
      }
    );
  };

  checkBackendUp() {
    // On single workspace mode (within pipeline), the service management is
    // handled from the wrapper component (DataPrepHome)
    if (!this.props.mode === 'ROUTED_WORKSPACE') {
      this.init(this.props);
      return;
    }

    MyDataPrepApi.ping().subscribe(
      () => {
        this.init(this.props);
      },
      (err) => {
        if (err.statusCode === 503) {
          console.log('backend not started');
          this.eventEmitter.emit('DATAPREP_BACKEND_DOWN');
          return;
        }
      }
    );
  }

  init(props) {
    const workspaceId = props.workspaceId;

    if (props.mode === 'ROUTED_WORKSPACE') {
      DataPrepStore.dispatch({
        type: DataPrepActions.setWorkspaceMode,
        payload: {
          singleWorkspaceMode: true,
        },
      });
    } else {
      getWorkspaceList();
    }

    this.setCurrentWorkspace(workspaceId);
  }

  setCurrentWorkspace(workspaceId) {
    if (isNilOrEmptyString(workspaceId)) {
      return;
    }
    setWorkspace(workspaceId).subscribe(
      () => {
        let { insights } = DataPrepStore.getState().dataprep;
        let workspaceName = insights.name;
        if (this._isMounted) {
          this.setState({
            loading: false,
            currentWorkspace: workspaceId,
            workspaceName,
          });
        }
      },
      () => {
        if (this._isMounted) {
          this.setState({ loading: false });
          DataPrepStore.dispatch({
            type: DataPrepActions.setInitialized,
          });
          this.eventEmitter.emit('DATAPREP_NO_WORKSPACE_ID');
        }
      }
    );
  }

  toggleBackendDown() {
    this.setState({ backendDown: true });
  }

  onServiceStart() {
    this.setState({ backendDown: false });
    let workspaceId = this.props.workspaceId;
    this.setCurrentWorkspace(workspaceId);
  }

  onSidePanelToggle() {
    if (isEmpty(this.state.currentWorkspace)) {
      return;
    }
    this.setState({
      sidePanelToggle: !this.state.sidePanelToggle,
    });
    if (this.props.onConnectionsToggle) {
      this.props.onConnectionsToggle();
    }
  }

  closeSidePanel() {
    this.setState({
      sidePanelToggle: false,
    });
  }

  renderBackendDown() {
    return <DataPrepServiceControl onServiceStart={this.onServiceStart.bind(this)} />;
  }

  renderTabs() {
    if (this.props.mode === 'ROUTED_WORKSPACE') {
      return null;
    }

    return (
      <WorkspaceTabs
        workspaceId={this.state.currentWorkspace}
        onWorkspaceDelete={this.props.onWorkspaceDelete}
        sidePanelToggle={this.state.sidePanelToggle}
      />
    );
  }

  onSubmitToListener({ workspaceId, directives, schema }) {
    if (!this.props.onSubmit) {
      return;
    }
    this.props.onSubmit({
      workspaceId,
      directives,
      schema: schema,
    });
  }

  renderTogglePanel() {
    let prefix = `features.DataPrep.sidePanelTooltip`;
    let tooltip = this.state.sidePanelToggle
      ? T.translate(`${prefix}.collapse`)
      : T.translate(`${prefix}.expand`);
    return (
      <div
        className={classnames('panel-toggle float-left text-center', {
          disabled: isEmpty(this.state.currentWorkspace),
        })}
        onClick={this.props.disabled ? undefined : this.onSidePanelToggle}
      >
        <span className="panel-button" title={tooltip}>
          {this.state.sidePanelToggle ? (
            <IconSVG name="icon-chevron-left" />
          ) : (
            <IconSVG name="icon-chevron-right" />
          )}
        </span>
      </div>
    );
  }

  render() {
    if (this.state.backendDown) {
      return this.renderBackendDown();
    }

    if (this.state.loading) {
      return (
        <div className="dataprep-container text-center">
          <LoadingSVGCentered />
        </div>
      );
    }
    const featureName = Theme.featureNames.dataPrep;
    return (
      <div
        className={classnames('dataprep-container', {
          'single-workspace': this.props.mode === 'ROUTED_WORKSPACE',
        })}
      >
        {this.props.mode === 'ROUTED_WORKSPACE' ? null : (
          <Helmet
            title={T.translate(`${DATAPREP_I18N_PREFIX}.pageTitle`, {
              workspaceUri: !isNilOrEmpty(this.state.workspaceName)
                ? `| ${this.state.workspaceName}`
                : '',
              productName: Theme.productName,
              featureName,
            })}
          />
        )}
        <DataPrepErrorAlert />

        <div className="top-section clearfix">
          {this.renderTogglePanel()}

          <div className="top-section-content float-left">
            {this.renderTabs()}
            <DataPrepTopPanel
              mode={this.props.mode}
              onSubmit={this.onSubmitToListener.bind(this)}
              disabled={this.props.disabled}
            />
          </div>
        </div>

        <div className="row dataprep-body">
          <div className="dataprep-main col-12">
            <DataPrepContentWrapper disabled={this.props.disabled} />
          </div>
        </div>

        <DataPrepLoading />
      </div>
    );
  }
}
DataPrep.propTypes = {
  mode: PropTypes.oneOf(['ROUTED', 'ROUTED_WORKSPACE', 'INMEMORY']),
  workspaceId: PropTypes.string,
  onSubmit: PropTypes.func,
  onConnectionsToggle: PropTypes.func.isRequired,
  onWorkspaceDelete: PropTypes.func,
  disabled: PropTypes.bool,
};
