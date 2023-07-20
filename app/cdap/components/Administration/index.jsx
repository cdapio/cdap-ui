/*
 * Copyright © 2016-2018 Cask Data, Inc.
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
import PropTypes from 'prop-types';
import { MyServiceProviderApi } from 'api/serviceproviders';
import { humanReadableNumber, objectQuery } from 'services/helpers';
import AdminManagementTabContent from 'components/Administration/AdminManagementTabContent';
import AdminConfigTabContent from 'components/Administration/AdminConfigTabContent';
import TetheringTabContent from 'components/Administration/TetheringTabContent';
import NewTetheringRequest from 'components/Administration/TetheringTabContent/NewTetheringRequest';
import AdminTabSwitch from 'components/Administration/AdminTabSwitch';
import { Route, Switch } from 'react-router-dom';

require('./Administration.scss');

const WAITTIME_FOR_ALTERNATE_STATUS = 10000;

class Administration extends Component {
  state = {
    platformsDetails: {},
    uptime: 0,
    accordionToExpand:
      typeof this.props.location.state === 'object'
        ? this.props.location.state.accordionToExpand
        : null,
  };

  static propTypes = {
    location: PropTypes.object,
  };

  componentDidMount() {
    this.getUptime();
    this.getPlatformDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state !== this.props.location.state) {
      const accordionToExpand =
        typeof nextProps.location.state === 'object'
          ? nextProps.location.state.accordionToExpand
          : null;
      this.setState({
        accordionToExpand,
      });
    }
  }

  getUptime() {
    MyServiceProviderApi.pollList().subscribe(
      (res) => {
        const uptime = objectQuery(res, 'cdap', 'Uptime');
        this.setState({
          uptime,
        });
      },
      () => {
        setTimeout(() => {
          this.getUptime();
        }, WAITTIME_FOR_ALTERNATE_STATUS);
      }
    );
  }

  prettifyPlatformDetails(details) {
    delete details.transactions.WritePointer;
    delete details.transactions.ReadPointer;
    return Object.assign({}, details, {
      lasthourload: {
        ...details.lasthourload,
        Successful: humanReadableNumber(details.lasthourload.Successful),
        TotalRequests: humanReadableNumber(details.lasthourload.TotalRequests),
      },
    });
  }

  getPlatformDetails() {
    MyServiceProviderApi.get({
      serviceprovider: 'cdap',
    }).subscribe(
      (res) => {
        const platformsDetails = {
          ...this.prettifyPlatformDetails(res),
        };
        this.setState({ platformsDetails });
      },
      () => {
        setTimeout(() => {
          this.getUptime();
        }, WAITTIME_FOR_ALTERNATE_STATUS);
      }
    );
  }

  render() {
    return (
      <div className="administration">
        <AdminTabSwitch uptime={this.state.uptime} />
        <Switch>
          <Route
            exact
            path="/administration"
            render={() => {
              return (
                <AdminManagementTabContent
                  platformsDetails={this.state.platformsDetails}
                />
              );
            }}
          />
          <Route
            exact
            path="/administration/configuration"
            render={() => {
              return (
                <AdminConfigTabContent
                  accordionToExpand={this.state.accordionToExpand}
                />
              );
            }}
          />
          <Route
            exact
            path="/administration/tethering"
            render={() => {
              return <TetheringTabContent />;
            }}
          />
          <Route
            exact
            path="/administration/tethering/newTetheringRequest"
            render={() => {
              return <NewTetheringRequest />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default Administration;
