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
require('./DatasetTab.scss');
import { objectQuery } from 'services/helpers';
import ViewSwitch from 'components/shared/ViewSwitch';
import DatasetCards from 'components/DatasetCards';
import DatasetTable from 'components/DatasetTable';
import NamespaceStore from 'services/NamespaceStore';
import { MyMetricApi } from 'api/metric';
import { MyDatasetApi } from 'api/dataset';
import {
  humanReadableNumber,
  HUMANREADABLESTORAGE_NODECIMAL,
} from 'services/helpers';

export default class DatasetTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entity: this.props.entity,
      entitiesForTable: this.getEntitiesForTable(this.props.entity),
    };
    this.state.entity.datasets.forEach(this.addDatasetMetrics.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    const entitiesMatch =
      objectQuery(nextProps, 'entity', 'name') ===
      objectQuery(this.props, 'entity', 'name');
    if (!entitiesMatch) {
      this.setState({
        entity: nextProps.entity,
        entitiesForTable: this.getEntitiesForTable(nextProps.entity),
      });
      this.state.entity.datasets.forEach(this.addDatasetMetrics.bind(this));
    }
  }
  onTabSwitch() {
    this.state.entity.datasets.forEach(this.addDatasetMetrics.bind(this));
  }
  getEntitiesForTable({ datasets }) {
    return datasets.map((dataset) =>
      Object.assign({}, dataset, { type: 'dataset', id: dataset.name })
    );
  }

  addDatasetMetrics(dataset) {
    const currentNamespace = NamespaceStore.getState().selectedNamespace;
    const datasetParams = {
      namespace: currentNamespace,
      datasetId: this.props.entity.name,
    };
    const metricsParams = {
      tag: [`namespace:${currentNamespace}`, `dataset:${dataset.name}`],
      metric: [
        'system.dataset.store.bytes',
        'system.dataset.store.writes',
        'system.dataset.store.reads',
      ],
      aggregate: true,
    };

    MyMetricApi.query(metricsParams)
      .combineLatest(MyDatasetApi.getPrograms(datasetParams))
      .subscribe((res) => {
        const ops = 'n/a';
        let writes = 0,
          bytes = 0,
          reads = 0;
        if (res[0].series.length > 0) {
          res[0].series.forEach((metric) => {
            if (metric.metricName === 'system.dataset.store.writes') {
              writes = metric.data[0].value;
            } else if (metric.metricName === 'system.dataset.store.bytes') {
              bytes = humanReadableNumber(
                metric.data[0].value,
                HUMANREADABLESTORAGE_NODECIMAL
              );
            } else if (metric.metricName === 'system.dataset.store.reads') {
              reads = metric.data[0].value;
            }
          });
        }

        const entities = this.state.entitiesForTable.map((e) => {
          if (e.name === dataset.name) {
            return Object.assign({}, e, {
              events: ops,
              writes,
              reads,
              bytes,
              programs: res[1].length,
              loading: false,
            });
          }
          return e;
        });
        this.setState({
          entitiesForTable: entities,
        });
      });
  }
  render() {
    return (
      <div className="dataset-tab">
        <div className="message-section float-left">
          <strong>
            {' '}
            {T.translate('features.Overview.DatasetTab.title', {
              appId: this.state.entity.name,
            })}{' '}
          </strong>
        </div>
        {
          <ViewSwitch onSwitch={this.onTabSwitch.bind(this)}>
            <DatasetCards dataEntities={this.state.entity.datasets} />
            <DatasetTable dataEntities={this.state.entitiesForTable} />
          </ViewSwitch>
        }
      </div>
    );
  }
}

DatasetTab.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }),
};
