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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ExploreAction from 'components/FastAction/ExploreAction';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyMetadataApi } from 'api/metadata';
import { isNilOrEmpty } from 'services/helpers';
import ExploreTablesStore from 'services/ExploreTables/ExploreTablesStore';
import { fetchTables } from 'services/ExploreTables/ActionCreator';
import uuidV4 from 'uuid/v4';
import { SCOPES } from 'services/global-constants';
require('./PredictionDatasetExploreModal.scss');

export default class PredictionDatasetExploreModal extends Component {
  static propTypes = {
    predictionDataset: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  state = {
    showModal: false,
    predictionDataset: this.props.predictionDataset,
    datasetDetails: null,
  };

  componentDidMount() {
    if (!isNilOrEmpty(this.state.predictionDataset)) {
      this.fetchDatasetDetails();
      ExploreTablesStore.dispatch(fetchTables(getCurrentNamespace()));
    }
  }

  fetchDatasetDetails = () => {
    MyMetadataApi.getProperties({
      namespace: getCurrentNamespace(),
      entityType: 'datasets',
      entityId: this.state.predictionDataset,
      scope: SCOPES.SYSTEM,
    }).subscribe(
      (datasetDetails) => {
        this.setState({
          datasetDetails: {
            schema: datasetDetails.schema,
            id: this.state.predictionDataset,
            type: 'dataset',
            uniqueId: uuidV4(),
            properties: datasetDetails,
          },
        });
      },
      (err) => {
        // FIXME: Handle error state.
        console.log('Error fetching dataset details: ', err);
      }
    );
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  render() {
    let ActionButton = (tooltipId) => (
      <div className="btn-link" onClick={this.toggleModal} id={tooltipId}>
        <span>Explore Predictions</span>
      </div>
    );
    const disabledTarget = (
      <button className="btn btn-secondary btn-sm" disabled>
        Explore Predictions
      </button>
    );
    if (isNilOrEmpty(this.state.datasetDetails) || this.props.disabled) {
      return disabledTarget;
    }
    return (
      <ExploreAction
        entity={this.state.datasetDetails}
        opened={this.state.showModal}
        renderActionButton={ActionButton}
        onClose={this.toggleModal}
        customTooltip="Explore predictions generated by this model"
      />
    );
  }
}
