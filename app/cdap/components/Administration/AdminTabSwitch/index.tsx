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

import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { humanReadableDuration } from 'services/helpers';
import VersionStore from 'services/VersionStore';
import VersionActions from 'services/VersionStore/VersionActions';
import MyCDAPVersionApi from 'api/version';
import isNil from 'lodash/isNil';
import classnames from 'classnames';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
require('./AdminTabSwitch.scss');

const PREFIX = 'features.Administration';
const TAB_LABELS = {
  MANAGEMENT: 'management',
  CONFIGURATION: 'configuration',
  TETHERING: 'tethering',
};

interface IAdminTabSwitchProps {
  uptime: number;
}

export default class AdminTabSwitch extends React.PureComponent<IAdminTabSwitchProps> {
  public state = {
    version: null,
  };

  public static propTypes = {
    uptime: PropTypes.number,
  };

  public componentDidMount() {
    if (!VersionStore.getState().version) {
      this.getCDAPVersion();
    } else {
      this.setState({ version: VersionStore.getState().version });
    }
  }

  public getCDAPVersion() {
    MyCDAPVersionApi.get().subscribe((res) => {
      this.setState({ version: res.version });
      VersionStore.dispatch({
        type: VersionActions.updateVersion,
        payload: {
          version: res.version,
        },
      });
    });
  }

  public renderTabTitle(activeTab) {
    const { MANAGEMENT, CONFIGURATION, TETHERING } = TAB_LABELS;

    return (
      <span className="tab-title">
        <h5 className={classnames({ active: activeTab === MANAGEMENT })}>
          <Link to="/administration">{T.translate(`${PREFIX}.Tabs.management`)}</Link>
        </h5>
        <span className="divider"> | </span>
        <h5 className={classnames({ active: activeTab === CONFIGURATION })}>
          <Link to="/administration/configuration">{T.translate(`${PREFIX}.Tabs.config`)}</Link>
        </h5>
        {Theme.tethering && (
          <>
            <span className="divider"> | </span>
            <h5 className={classnames({ active: activeTab === TETHERING })}>
              <Link to="/administration/tethering">{T.translate(`${PREFIX}.Tabs.tethering`)}</Link>
            </h5>
          </>
        )}
      </span>
    );
  }

  public renderUptimeVersion() {
    return (
      <span className="uptime-version-container">
        <span>
          {this.props.uptime
            ? T.translate(`${PREFIX}.uptimeLabel`, {
                time: humanReadableDuration(Math.ceil(this.props.uptime / 1000)),
              })
            : null}
        </span>
        {isNil(this.state.version) ? null : (
          <i className="cdap-version">
            {T.translate(`${PREFIX}.Top.version-label`)} - {this.state.version}
          </i>
        )}
      </span>
    );
  }

  public render() {
    const { MANAGEMENT, CONFIGURATION, TETHERING } = TAB_LABELS;

    return (
      <Switch>
        <Route
          exact
          path="/administration"
          render={() => {
            return (
              <div className="tab-title-and-version">
                {this.renderTabTitle(MANAGEMENT)}
                {this.renderUptimeVersion()}
              </div>
            );
          }}
        />
        <Route
          exact
          path="/administration/configuration"
          render={() => {
            return (
              <div className="tab-title-and-version">{this.renderTabTitle(CONFIGURATION)}</div>
            );
          }}
        />
        <Route
          exact
          path="/administration/tethering"
          render={() => {
            return <div className="tab-title-and-version">{this.renderTabTitle(TETHERING)}</div>;
          }}
        />
      </Switch>
    );
  }
}
