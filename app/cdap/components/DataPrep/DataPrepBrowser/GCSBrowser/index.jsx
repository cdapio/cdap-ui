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
import T from 'i18n-react';
import DataPrepBrowserStore from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore';
import {
  setGCSLoading,
  setError,
} from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore/ActionCreator';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import MyDataPrepApi from 'api/dataprep';
import NamespaceStore from 'services/NamespaceStore';
import GCSPath from 'components/DataPrep/DataPrepBrowser/GCSBrowser/GCSPath';
import ListingInfo from 'components/DataPrep/DataPrepBrowser/GCSBrowser/ListingInfo';
import GCSSearch from 'components/DataPrep/DataPrepBrowser/GCSBrowser/GCSSearch';
import BrowserData from 'components/DataPrep/DataPrepBrowser/GCSBrowser/BrowserData';
import classnames from 'classnames';
import DataPrepBrowserPageTitle from 'components/DataPrep/DataPrepBrowser/PageTitle';
import DataprepBrowserTopPanel from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserTopPanel';
import history from 'services/history';

require('./GCSBrowser.scss');

const PREFIX = 'features.DataPrep.DataPrepBrowser.GCSBrowser';

export default class GCSBrowser extends Component {
  static propTypes = {
    toggle: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    enableRouting: PropTypes.bool,
    onWorkspaceCreate: PropTypes.func,
    scope: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    showPanelToggle: PropTypes.bool,
  };

  static defaultProps = {
    enableRouting: true,
  };

  onWorkspaceCreate = (file) => {
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    const { connectionId } = DataPrepBrowserStore.getState().gcs;
    setGCSLoading();

    const headers = {
      'Content-Type': file.type,
    };

    const params = {
      context: namespace,
      connectionId,
      activeBucket: file.bucket,
      blob: file.blob,
      lines: 10000,
      sampler: 'first',
    };
    if (this.props.scope) {
      params.scope = this.props.scope;
    }

    MyDataPrepApi.readGCSFile(params, null, headers).subscribe(
      (res) => {
        const { id: workspaceId } = res.values[0];
        if (this.props.enableRouting) {
          history.push(`/ns/${namespace}/wrangler/${workspaceId}`);
        }
        if (
          this.props.onWorkspaceCreate &&
          typeof this.props.onWorkspaceCreate === 'function'
        ) {
          this.props.onWorkspaceCreate(workspaceId);
        }
      },
      (err) => {
        setError(err);
      }
    );
  };

  renderContentBody = () => {
    const BASEPATH = '/ns/:namespace/connections/gcs/:gcsId';
    if (this.props.enableRouting) {
      return (
        <Switch>
          <Route
            path={`${BASEPATH}`}
            render={() => {
              return (
                <BrowserData
                  {...this.props}
                  onWorkspaceCreate={this.onWorkspaceCreate}
                />
              );
            }}
          />
        </Switch>
      );
    }
    return (
      <BrowserData {...this.props} onWorkspaceCreate={this.onWorkspaceCreate} />
    );
  };

  render() {
    return (
      <Provider store={DataPrepBrowserStore}>
        <div className="gcs-browser">
          {this.props.enableRouting ? (
            <DataPrepBrowserPageTitle
              browserI18NName="GCSBrowser"
              browserStateName="gcs"
              locationToPathInState={['prefix']}
            />
          ) : null}
          <DataprepBrowserTopPanel
            allowSidePanelToggle={true}
            toggle={this.props.toggle}
            browserTitle={T.translate(`${PREFIX}.TopPanel.selectData`)}
            showPanelToggle={this.props.showPanelToggle}
          />
          <div
            className={classnames('sub-panel', {
              'routing-disabled': !this.props.enableRouting,
            })}
          >
            <div className="path-container">
              <GCSPath
                baseStatePath={
                  this.props.enableRouting ? this.props.match.url : '/'
                }
                enableRouting={this.props.enableRouting}
              />
            </div>
            <div className="info-container">
              <span className="info">
                <ListingInfo />
              </span>
              <div className="search-container">
                <GCSSearch />
              </div>
            </div>
          </div>
          <div className="gcs-content">{this.renderContentBody()}</div>
        </div>
      </Provider>
    );
  }
}
