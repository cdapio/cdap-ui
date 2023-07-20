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
import OverviewMetaSection from 'components/shared/Overview/OverviewMetaSection';
import { objectQuery } from 'services/helpers';
import NamespaceStore from 'services/NamespaceStore';
import { MyDatasetApi } from 'api/dataset';
import { MyMetadataApi } from 'api/metadata';
import uuidV4 from 'uuid/v4';
import T from 'i18n-react';
import DatasetDetaildViewTab from 'components/DatasetDetailedView/Tabs';
import FastActionToMessage from 'services/fast-action-message-helper';
import { Redirect } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import Page404 from 'components/404';
import BreadCrumb from 'components/shared/BreadCrumb';
import PlusButton from 'components/shared/PlusButton';
import Helmet from 'react-helmet';
import queryString from 'query-string';
import { Route } from 'react-router-dom';
import { SCOPES } from 'services/global-constants';
import { Theme } from 'services/ThemeHelper';
require('./DatasetDetailedView.scss');

export default class DatasetDetailedView extends Component {
  constructor(props) {
    super(props);
    const searchObj = queryString.parse(
      objectQuery(this.props, 'location', 'search')
    );
    this.state = {
      entityDetail:
        objectQuery(this.props, 'location', 'state', 'entityDetail') |
        {
          schema: null,
          programs: [],
        },
      loading: true,
      isInvalid: false,
      routeToHome: false,
      successMessage: null,
      notFound: false,
      modalToOpen: objectQuery(searchObj, 'modalToOpen') || '',
      previousPathName: null,
    };
  }

  componentWillMount() {
    const selectedNamespace = NamespaceStore.getState().selectedNamespace;
    let { namespace } = this.props.match.params;
    const { datasetId } = this.props.match.params;
    const previousPathName =
      objectQuery(this.props, 'location', 'state', 'previousPathname') ||
      `/ns/${selectedNamespace}?overviewid=${datasetId}&overviewtype=dataset`;
    if (!namespace) {
      namespace = NamespaceStore.getState().selectedNamespace;
    }
    this.setState({
      previousPathName,
    });

    this.fetchEntityDetails(namespace, datasetId);
    if (this.state.entityDetail.id) {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      namespace: currentNamespace,
      datasetId: currentDatasetId,
    } = this.props.match.params;
    const {
      namespace: nextNamespace,
      datasetId: nextDatasetId,
    } = nextProps.match.params;
    if (
      currentNamespace === nextNamespace &&
      currentDatasetId === nextDatasetId
    ) {
      return;
    }
    let { namespace } = this.nextProps.match.params;
    const { datasetId } = this.nextProps.match.params;
    if (!namespace) {
      namespace = NamespaceStore.getState().selectedNamespace;
    }

    this.setState(
      {
        entityDetail: {
          schema: null,
          programs: [],
        },
        loading: true,
      },
      () => {
        this.fetchEntityDetails(namespace, datasetId);
      }
    );
  }

  fetchEntityDetails(namespace, datasetId) {
    if (
      !this.state.entityDetail.schema ||
      this.state.entityDetail.programs.length === 0
    ) {
      const datasetParams = {
        namespace,
        datasetId,
      };

      const metadataParams = {
        namespace,
        entityType: 'datasets',
        entityId: datasetId,
        scope: SCOPES.SYSTEM,
      };

      MyMetadataApi.getProperties(metadataParams)
        .combineLatest(MyDatasetApi.getPrograms(datasetParams))
        .subscribe(
          (res) => {
            let appId;
            // TO DO: Remove this check once backend properly returns a 404 error when dataset does not exist
            // JIRA to fix backend: CDAP-15909
            const datasetProps = res[0].properties; // all metadata properties with System scope

            if (datasetProps.length === 0) {
              this.setState({
                notFound: true,
                loading: false,
              });
              return;
            }

            const programs = res[1].map((programObj) => {
              programObj.uniqueId = uuidV4();
              appId = programObj.application;
              programObj.app = appId;
              programObj.name = programObj.program;
              return programObj;
            });

            const properties = {};

            res[0].properties.forEach((property) => {
              if (property.scope === SCOPES.SYSTEM) {
                properties[property.name] = property.value;
              }
            });

            const entityDetail = {
              programs,
              schema: properties.schema,
              name: appId, // FIXME: Finalize on entity detail for fast action
              app: appId,
              id: datasetId,
              type: 'dataset',
              properties,
            };

            this.setState(
              {
                entityDetail,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    loading: false,
                  });
                }, 1000);
              }
            );
          },
          (err) => {
            if (err.statusCode === 404) {
              this.setState({
                notFound: true,
                loading: false,
              });
            }
          }
        );
    }
  }

  goToHome(action) {
    if (action === 'delete') {
      const selectedNamespace = NamespaceStore.getState().selectedNamespace;
      this.setState({
        selectedNamespace,
        routeToHome: true,
      });
    }
    let successMessage;
    if (action === 'setPreferences') {
      successMessage = FastActionToMessage(action, {
        entityType: capitalize(this.state.entityDetail.type),
      });
    } else {
      successMessage = FastActionToMessage(action);
    }
    this.setState(
      {
        successMessage,
      },
      () => {
        setTimeout(() => {
          this.setState({
            successMessage: null,
          });
        }, 3000);
      }
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="app-detailed-view dataset-detailed-view loading">
          <div className="fa fa-spinner fa-spin fa-3x" />
        </div>
      );
    }

    if (this.state.notFound) {
      return (
        <Page404
          entityType="dataset"
          entityName={this.props.match.params.datasetId}
        />
      );
    }
    const previousPaths = [
      {
        pathname: this.state.previousPathName,
        label: T.translate('commons.back'),
      },
    ];

    const datasetId = this.props.match.params.datasetId;

    return (
      <div className="app-detailed-view dataset-detailed-view">
        <Helmet
          title={T.translate('features.DatasetDetailedView.Title', {
            datasetId: datasetId,
            productName: Theme.productName,
          })}
        />
        <div className="bread-crumb-wrapper">
          <BreadCrumb
            previousPaths={previousPaths}
            currentStateIcon="icon-datasets"
            currentStateLabel={T.translate('commons.dataset')}
          />
          <PlusButton mode={PlusButton.MODE.resourcecenter} />
        </div>
        <OverviewMetaSection
          entity={this.state.entityDetail}
          onFastActionSuccess={this.goToHome.bind(this)}
          onFastActionUpdate={this.goToHome.bind(this)}
          fastActionToOpen={this.state.modalToOpen}
          showFullCreationTime={true}
        />
        <Route
          path="/ns/:namespace/datasets/:datasetId/"
          render={() => {
            return (
              <DatasetDetaildViewTab
                params={this.props.match.params}
                pathname={this.props.location.pathname}
                entity={this.state.entityDetail}
              />
            );
          }}
        />
        {this.state.routeToHome ? (
          <Redirect to={`/ns/${this.state.selectedNamespace}`} />
        ) : null}
      </div>
    );
  }
}

DatasetDetailedView.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
};
