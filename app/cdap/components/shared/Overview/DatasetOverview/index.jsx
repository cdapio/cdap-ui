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
import OverviewHeader from 'components/shared/Overview/OverviewHeader';
import OverviewMetaSection from 'components/shared/Overview/OverviewMetaSection';
import DatasetOverviewTab from 'components/shared/Overview/DatasetOverview/DatasetOverviewTab';
import NamespaceStore from 'services/NamespaceStore';
import uuidV4 from 'uuid/v4';
import { objectQuery } from 'services/helpers';
import { MyDatasetApi } from 'api/dataset';
import { MyMetadataApi } from 'api/metadata';
import isNil from 'lodash/isNil';
import T from 'i18n-react';
import FastActionToMessage from 'services/fast-action-message-helper';
import capitalize from 'lodash/capitalize';
import { SCOPES } from 'services/global-constants';

export default class DatasetOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entity: this.props.entity,
      entityDetail: null,
      loading: false,
      successMessage: null,
    };
  }

  componentWillMount() {
    this.fetchDatasetDetail();
  }

  componentWillReceiveProps(nextProps) {
    const { entity } = nextProps;
    if (!isNil(entity)) {
      this.setState(
        {
          entity,
        },
        this.fetchDatasetDetail.bind(this)
      );
    }
  }

  fetchDatasetDetail() {
    this.setState({
      loading: true,
    });
    const namespace = NamespaceStore.getState().selectedNamespace;
    if (objectQuery(this.props, 'entity', 'id')) {
      const datasetParams = {
        namespace,
        datasetId: this.props.entity.id,
      };

      const metadataParams = {
        namespace,
        entityType: 'datasets',
        entityId: this.props.entity.id,
        scope: SCOPES.SYSTEM,
      };

      MyMetadataApi.getProperties(metadataParams)
        .combineLatest(MyDatasetApi.getPrograms(datasetParams))
        .subscribe((res) => {
          let appId;
          const programs = res[1].map((programObj) => {
            programObj.uniqueId = uuidV4();
            appId = programObj.application;
            programObj.app = appId;
            programObj.name = programObj.program;
            return programObj;
          });

          const properties = {};
          res[0].properties.forEach((property) => {
            properties[property.name] = property.value;
          });

          const entityDetail = {
            programs,
            schema: properties.schema,
            name: appId, // FIXME: Finalize on entity detail for fast action
            app: appId,
            id: this.props.entity.id,
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
        });
    }
  }

  onFastActionSuccess(action) {
    this.props.onCloseAndRefresh(action);
  }

  onFastActionUpdate(action) {
    let successMessage;
    if (action === 'truncate') {
      successMessage = FastActionToMessage(action, {
        entityType: capitalize(this.props.entity.type),
      });
    } else {
      successMessage = FastActionToMessage(action);
    }
    this.setState({
      successMessage,
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="fa fa-spinner fa-spin fa-3x" />;
    }

    const title = T.translate('commons.entity.dataset.singular');
    const namespace = NamespaceStore.getState().selectedNamespace;
    return (
      <div className="app-overview dataset-overview">
        <OverviewHeader
          icon="icon-datasets"
          title={title}
          linkTo={{
            pathname: `/ns/${namespace}/datasets/${this.props.entity.id}`,
            state: {
              entityDetail: this.state.entityDetail,
              entityMetadata: this.props.entity,
              previousPathname: (location.pathname + location.search).replace(
                /\/cdap\//g,
                '/'
              ),
            },
          }}
          onClose={this.props.onClose}
          entityType="dataset"
          successMessage={this.state.successMessage}
        />
        <OverviewMetaSection
          entity={Object.assign({}, this.state.entityDetail, this.state.entity)}
          onFastActionSuccess={this.onFastActionSuccess.bind(this)}
          onFastActionUpdate={this.onFastActionUpdate.bind(this)}
          showSeparator={true}
        />
        <DatasetOverviewTab entity={this.state.entityDetail} />
      </div>
    );
  }
}

DatasetOverview.propTypes = {
  toggleOverview: PropTypes.bool,
  entity: PropTypes.object,
  onClose: PropTypes.func,
  onCloseAndRefresh: PropTypes.func,
};
