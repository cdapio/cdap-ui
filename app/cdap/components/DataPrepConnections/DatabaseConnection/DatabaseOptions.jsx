/*
 * Copyright © 2017 Cask Data, Inc.
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
import NamespaceStore from 'services/NamespaceStore';
import MyDataPrepApi from 'api/dataprep';
import LoadingSVG from 'components/shared/LoadingSVG';
import IconSVG from 'components/shared/IconSVG';
import classnames from 'classnames';
import T from 'i18n-react';
import ArtifactUploadWizard from 'components/CaskWizards/ArtifactUpload';
import find from 'lodash/find';
import uuidV4 from 'uuid/v4';
import ArtifactUploadActions from 'services/WizardStores/ArtifactUpload/ArtifactUploadActions';
import ArtifactUploadStore from 'services/WizardStores/ArtifactUpload/ArtifactUploadStore';
import orderBy from 'lodash/orderBy';
import MarketAction from 'components/Market/action/market-action';
import MarketStore from 'components/Market/store/market-store';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
import { Theme } from 'services/ThemeHelper';

const PREFIX =
  'features.DataPrepConnections.AddConnections.Database.DatabaseOptions';

export default class DatabaseOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      drivers: [],
      uploadArtifact: false,
    };

    this.toggleArtifactUploadWizard = this.toggleArtifactUploadWizard.bind(
      this
    );
    this.fetchDrivers = this.fetchDrivers.bind(this);
    this.onWizardClose = this.onWizardClose.bind(this);
    this.eventEmitter = ee(ee);
  }

  componentWillMount() {
    this.fetchDrivers();
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub();
    }

    this.eventEmitter.off(globalEvents.CLOSEMARKET, this.fetchDrivers);
  }

  fetchDrivers() {
    const namespace = NamespaceStore.getState().selectedNamespace;

    const params = {
      context: namespace,
    };

    MyDataPrepApi.jdbcAllowed(params)
      .combineLatest(MyDataPrepApi.jdbcDrivers(params))
      .subscribe((res) => {
        let driversList = res[0].values;
        const installedList = res[1].values;

        driversList = driversList.map((driver) => {
          const matched = find(installedList, (o) => {
            return (
              o.label === driver.label &&
              o.properties.class === driver.class &&
              o.properties.name === driver.name
            );
          });

          driver.uniqueId = uuidV4();
          driver.installed = false;

          if (matched) {
            driver.installed = true;
            driver.pluginInfo = matched;
          }

          return driver;
        });

        driversList = orderBy(driversList, ['label'], ['asc']);

        this.setState({
          drivers: driversList,
          loading: false,
        });
      });

    this.eventEmitter.off(globalEvents.CLOSEMARKET, this.fetchDrivers);
  }

  toggleArtifactUploadWizard(db) {
    if (db) {
      ArtifactUploadStore.dispatch({
        type: ArtifactUploadActions.setNameAndClass,
        payload: {
          name: db.name,
          classname: db.class,
        },
      });

      this.setState({ uploadArtifact: true });
      return;
    }

    this.setState({ uploadArtifact: false });
  }

  caskMarket(db) {
    const jdbcConfig = window.CDAP_UI_CONFIG.dataprep.jdbcMarketMap[db.name];

    this.eventEmitter.emit(globalEvents.OPENMARKET);
    this.sub = MarketStore.subscribe(() => {
      const state = MarketStore.getState();

      if (state.list.length === 0) {
        return;
      }
      const entity = find(state.list, {
        name: jdbcConfig.name,
        version: jdbcConfig.version,
      });

      this.sub();

      MarketStore.dispatch({
        type: 'SET_ACTIVE_ENTITY',
        payload: {
          entityId: entity.id,
          displayCTA: false,
        },
      });
    });

    this.eventEmitter.on(globalEvents.CLOSEMARKET, this.fetchDrivers);

    MarketAction.setFilter('3rd-party-artifact');
  }

  onDBClick(db) {
    if (!db.installed) {
      return;
    }

    this.props.onDBSelect(db);
  }

  renderMarketOption(db) {
    const jdbcConfig = window.CDAP_UI_CONFIG.dataprep.jdbcMarketMap[db.name];

    if (!jdbcConfig) {
      return null;
    }

    const hub = Theme.featureNames.hub;

    return (
      <span className="market-option">
        <span className="upload" onClick={this.caskMarket.bind(this, db)}>
          {hub}
        </span>
        <span> | </span>
      </span>
    );
  }

  renderDBInfo(db) {
    if (!db.installed) {
      return (
        <div className="db-installed">
          <span>{T.translate(`${PREFIX}.install`)}</span>
          {this.renderMarketOption(db)}
          <span
            className="upload"
            onClick={this.toggleArtifactUploadWizard.bind(this, db)}
          >
            {T.translate(`${PREFIX}.upload`)}
          </span>
        </div>
      );
    }

    return (
      <div className="db-installed">
        <span>{db.pluginInfo.version}</span>
        <span className="fa fa-fw check-icon">
          <IconSVG name="icon-check" />
        </span>
        <span>{T.translate(`${PREFIX}.installedLabel`)}</span>
      </div>
    );
  }

  renderDBOption(db) {
    return (
      <div key={db.uniqueId} className="col-6">
        <div
          className={classnames('database-option', { installed: db.installed })}
          onClick={this.onDBClick.bind(this, db)}
        >
          <div className="db-image-container">
            <div className={`db-image db-${db.tag}`} />
          </div>
          <div className="db-info">
            <div className="db-name" title={db.label}>
              {db.label}
            </div>
            {this.renderDBInfo(db)}
          </div>
        </div>
      </div>
    );
  }

  onWizardClose() {
    this.setState({ uploadArtifact: false });
    this.fetchDrivers();
  }

  renderArtifactUploadWizard() {
    if (!this.state.uploadArtifact) {
      return null;
    }

    return (
      <ArtifactUploadWizard
        isOpen={true}
        buildSuccessInfo={() => {}}
        onClose={this.onWizardClose}
        hideUploadHelper={true}
      />
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="database-options text-center">
          <LoadingSVG />
        </div>
      );
    }

    return (
      <div className="database-options">
        <div className="options-title">
          {T.translate(`${PREFIX}.optionsTitle`)}
        </div>

        <div className="row">
          {this.state.drivers.map((db) => this.renderDBOption(db))}
        </div>

        {this.renderArtifactUploadWizard()}
      </div>
    );
  }
}

DatabaseOptions.propTypes = {
  onDBSelect: PropTypes.func,
};
