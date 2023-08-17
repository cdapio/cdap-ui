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
import DataPrepBrowserStore from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore';
import NamespaceStore from 'services/NamespaceStore';
import MyDataPrepApi from 'api/dataprep';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import { Input } from 'reactstrap';
import T from 'i18n-react';
import {
  setKafkaAsActiveBrowser,
  setError,
} from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore/ActionCreator';
import ee from 'event-emitter';
import DataPrepBrowserPageTitle from 'components/DataPrep/DataPrepBrowser/PageTitle';
import { Provider } from 'react-redux';
import DataprepBrowserTopPanel from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserTopPanel';
import { ConnectionType } from 'components/DataPrepConnections/ConnectionType';
import If from 'components/shared/If';
import history from 'services/history';

const PREFIX = 'features.DataPrep.DataPrepBrowser.KafkaBrowser';

require('./KafkaBrowser.scss');

export default class KafkaBrowser extends Component {
  static propTypes = {
    toggle: PropTypes.func,
    enableRouting: PropTypes.bool,
    onWorkspaceCreate: PropTypes.func,
    scope: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    showPanelToggle: PropTypes.bool,
  };

  static defaultProps = {
    enableRouting: true,
  };

  state = {
    connectionId: DataPrepBrowserStore.getState().kafka.connectionId,
    info: DataPrepBrowserStore.getState().kafka.info,
    loading: DataPrepBrowserStore.getState().kafka.loading,
    search: '',
    searchFocus: true,
    error: null,
    topics: [],
  };

  eventEmitter = ee(ee);

  componentDidMount() {
    this.eventEmitter.on(
      'DATAPREP_CONNECTION_EDIT_KAFKA',
      this.eventBasedFetchTopics
    );
    this.storeSubscription = DataPrepBrowserStore.subscribe(() => {
      const { kafka, activeBrowser } = DataPrepBrowserStore.getState();
      if (activeBrowser.name !== ConnectionType.KAFKA) {
        return;
      }

      this.setState({
        info: kafka.info,
        connectionId: kafka.connectionId,
        topics: kafka.topics,
        loading: kafka.loading,
      });
    });
  }

  componentWillUnmount() {
    this.eventEmitter.off(
      'DATAPREP_CONNECTION_EDIT_KAFKA',
      this.eventBasedFetchTopics
    );
    if (typeof this.storeSubscription === 'function') {
      this.storeSubscription();
    }
  }

  eventBasedFetchTopics = (connectionId) => {
    if (this.state.connectionId === connectionId) {
      setKafkaAsActiveBrowser({ name: ConnectionType.KAFKA, id: connectionId });
    }
  };

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  prepTopic(topic) {
    this.setState({
      loading: true,
    });
    const namespace = NamespaceStore.getState().selectedNamespace;
    const params = {
      context: namespace,
      connectionId: this.state.connectionId,
      topic,
      lines: 100,
    };
    if (this.props.scope) {
      params.scope = this.props.scope;
    }

    MyDataPrepApi.readTopic(params).subscribe(
      (res) => {
        const workspaceId = res.values[0].id;
        if (
          this.props.onWorkspaceCreate &&
          typeof this.props.onWorkspaceCreate === 'function'
        ) {
          this.props.onWorkspaceCreate(workspaceId);
          return;
        }
        history.push(`/ns/${namespace}/wrangler/${workspaceId}`);
      },
      (err) => {
        setError(err);
      }
    );
  }

  renderEmpty() {
    if (this.state.search.length !== 0) {
      return (
        <div className="empty-search-container">
          <div className="empty-search">
            <strong>
              {T.translate(`${PREFIX}.EmptyMessage.title`, {
                searchText: this.state.search,
              })}
            </strong>
            <hr />
            <span>
              {' '}
              {T.translate(`${PREFIX}.EmptyMessage.suggestionTitle`)}{' '}
            </span>
            <ul>
              <li>
                <span
                  className="link-text"
                  onClick={() => {
                    this.setState({
                      search: '',
                      searchFocus: true,
                    });
                  }}
                >
                  {T.translate(`${PREFIX}.EmptyMessage.clearLabel`)}
                </span>
                <span>{T.translate(`${PREFIX}.EmptyMessage.suggestion1`)}</span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="empty-search-container">
        <div className="empty-search text-center">
          <strong>
            {T.translate(`${PREFIX}.EmptyMessage.emptyKafka`, {
              connectionName: this.state.connectionName,
            })}
          </strong>
        </div>
      </div>
    );
  }

  renderContents(topics) {
    if (!topics.length) {
      return this.renderEmpty();
    }
    return (
      <div className="kafka-content-table">
        <div className="kafka-content-header">
          <div className="row">
            <div className="col-12">
              <span>{T.translate(`${PREFIX}.table.topics`)}</span>
            </div>
          </div>
        </div>
        <div className="kafka-content-body">
          {topics.map((topic) => {
            return (
              <div
                className="row content-row"
                onClick={this.prepTopic.bind(this, topic)}
                key={topic}
              >
                <div className="col-12">
                  <span>{topic}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return <LoadingSVGCentered />;
    }

    let filteredTopics = this.state.topics;
    if (this.state.search) {
      filteredTopics = this.state.topics.filter(
        (topic) =>
          topic.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
      );
    }
    const PageTitle = (...props) =>
      this.props.enableRouting ? (
        <DataPrepBrowserPageTitle
          browserI18NName="KafkaBrowser"
          browserStateName="kafka"
          {...props}
        />
      ) : null;
    return (
      <div className="kafka-browser">
        <Provider store={DataPrepBrowserStore}>
          <PageTitle />
        </Provider>
        <DataprepBrowserTopPanel
          allowSidePanelToggle={true}
          toggle={this.props.toggle}
          browserTitle={T.translate(`${PREFIX}.title`)}
          showPanelToggle={this.props.showPanelToggle}
        />
        <If condition={!this.state.error}>
          <div className="kafka-browser-header">
            <div className="kafka-metadata">
              <h5>{this.state.info.name}</h5>
              <span className="tables-count">
                {T.translate(`${PREFIX}.topicCount`, {
                  count: this.state.topics.length,
                })}
              </span>
            </div>
            <div className="table-name-search">
              <Input
                placeholder={T.translate(`${PREFIX}.searchPlaceholder`)}
                value={this.state.search}
                onChange={this.handleSearch}
                autoFocus={this.state.searchFocus}
              />
            </div>
          </div>
        </If>
        <div className="kafka-browser-content">
          {this.renderContents(filteredTopics)}
        </div>
      </div>
    );
  }
}
