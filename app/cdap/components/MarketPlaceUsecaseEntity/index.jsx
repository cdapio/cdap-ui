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
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { MyMarketApi } from 'api/market';
import Card from 'components/shared/Card';
import moment from 'moment';
require('./MarketPlaceUsecaseEntity.scss');
import MarketActionsContainer from 'components/MarketActionsContainer';
import MarketStore from 'components/Market/store/market-store';
import ExperimentalBanner from 'components/ExperimentalBanner';
import classnames from 'classnames';
import LicenseRow from 'components/MarketPlaceUsecaseEntity/LicenseRow';
import T from 'i18n-react';

export default class MarketPlaceUsecaseEntity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
      loadingActions: false,
      entityDetail: {},
      imageError: false,
      logoIcon: null,
    };
    this.unsub = MarketStore.subscribe(() => {
      const state = MarketStore.getState();
      if (
        state.activeEntity !== this.props.entityId &&
        this.state.showActions
      ) {
        this.setState({
          showActions: false,
        });
      }
    });
  }
  getChildContext() {
    return {
      entity: this.props.entity,
    };
  }
  componentWillUnmount() {
    this.unsub();
  }

  imageError() {
    this.setState({
      imageError: true,
      logoIcon: `icon-${this.props.entity.label[0].toUpperCase()}`,
    });
  }

  fetchEntityDetail() {
    if (this.state.showActions) {
      this.setState({ showActions: false });
      return;
    }
    this.setState({
      loadingActions: true,
      showActions: true,
    });
    MarketStore.dispatch({
      type: 'SET_ACTIVE_ENTITY',
      payload: {
        entityId: this.props.entityId,
      },
    });
    const marketHost = MarketStore.getState().selectedMarketHost;
    MyMarketApi.get({
      packageName: this.props.entity.name,
      version: this.props.entity.version,
      marketHost,
    }).subscribe(
      (res) => {
        this.setState({
          entityDetail: res,
          loadingActions: false,
        });
      },
      (err) => {
        console.log('Error', err);
        this.setState({ loadingActions: false });
      }
    );
  }

  render() {
    const marketHost = MarketStore.getState().selectedMarketHost;

    return (
      <Card size="LG" cardClass="market-place-usecase-package-card">
        {this.props.entity.beta ? <ExperimentalBanner /> : null}
        <div className="title clearfix">
          <span className="float-left">{this.props.entity.label}</span>
          <span className="float-right">
            Version: {this.props.entity.version}
          </span>
        </div>
        <div className="entity-information">
          <div className="entity-modal-image">
            {this.state.imageError ? (
              <span className={classnames('fa', this.state.logoIcon)} />
            ) : (
              <img
                src={MyMarketApi.getIcon(this.props.entity, marketHost)}
                onError={this.imageError.bind(this)}
              />
            )}
          </div>
          <div className="entity-content">
            <div className="entity-description">
              {this.props.entity.description}
            </div>
            <div className="entity-metadata">
              <LicenseRow licenseInfo={this.props.entity.licenseInfo} />
              <div>
                {T.translate('features.MarketPlaceEntity.Metadata.created')}
              </div>
              <span>
                <strong>
                  {moment(this.props.entity.created * 1000).format(
                    'MM-DD-YYYY HH:mm A'
                  )}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <div className="actions-container">
          <div
            className="arrow-container text-center"
            onClick={this.fetchEntityDetail.bind(this)}
          >
            {this.state.showActions ? (
              <span className="fa fa-angle-double-up" />
            ) : (
              <span className="fa fa-angle-double-down" />
            )}
          </div>
          {this.state.showActions ? (
            <MarketActionsContainer actions={this.state.entityDetail.actions} />
          ) : null}
        </div>
      </Card>
    );
  }
}

MarketPlaceUsecaseEntity.childContextTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
    label: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    org: PropTypes.string,
    created: PropTypes.number,
    cdapVersion: PropTypes.string,
    licenseInfo: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};

MarketPlaceUsecaseEntity.propTypes = {
  className: PropTypes.string,
  entityId: PropTypes.string,
  entity: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
    label: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    org: PropTypes.string,
    created: PropTypes.number,
    beta: PropTypes.bool,
    licenseInfo: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
};
