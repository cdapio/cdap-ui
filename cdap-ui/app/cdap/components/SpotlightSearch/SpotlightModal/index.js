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
import { MySearchApi } from 'api/search';
import NamespaceStore from 'services/NamespaceStore';
import { parseMetadata } from 'services/metadata-parser';
import { convertEntityTypeToApi } from 'services/entity-type-api-converter';
import NavLinkWrapper from 'components/NavLinkWrapper';
import Mousetrap from 'mousetrap';
import classnames from 'classnames';
import uuidV4 from 'uuid/v4';
import Pagination from 'components/Pagination';
import SpotlightModalHeader from 'components/SpotlightSearch/SpotlightModal/SpotlightModalHeader';
import T from 'i18n-react';

import { Col, Modal, ModalBody, Badge } from 'reactstrap';

require('./SpotlightModal.scss');

const PREFIX = 'features.SpotlightSearch.SpotlightModal';
const PAGE_SIZE = 10;

export default class SpotlightModal extends Component {
  static propTypes = {
    query: PropTypes.string,
    tag: PropTypes.string,
    target: PropTypes.array,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    isNativeLink: PropTypes.bool,
  };

  static defaultProps = {
    isNativeLink: false,
  };

  state = {
    searchResults: { results: [] },
    currentPage: 1,
    numPages: 1,
    focusIndex: 0,
    isPaginationExpanded: false,
  };

  componentWillMount() {
    Mousetrap.bind('up', this.handleUpDownArrow.bind(this, 'UP'));
    Mousetrap.bind('down', this.handleUpDownArrow.bind(this, 'DOWN'));
    Mousetrap.bind('enter', this.handleEnter.bind(this));

    this.handleSearch(1);
  }

  componentWillUnmount() {
    Mousetrap.unbind('up');
    Mousetrap.unbind('down');
    Mousetrap.unbind('enter');
  }

  handleUpDownArrow(direction) {
    if (direction === 'UP') {
      let focusIndex = this.state.focusIndex === 0 ? 0 : this.state.focusIndex - 1;
      this.setState({ focusIndex });
    } else if (direction === 'DOWN') {
      let totalResults = this.state.searchResults.results.length;

      let focusIndex =
        this.state.focusIndex === totalResults - 1
          ? this.state.focusIndex
          : this.state.focusIndex + 1;

      this.setState({ focusIndex });
    }
  }

  handlePaginationToggle = () => {
    this.setState({
      isPaginationExpanded: !this.state.isPaginationExpanded,
    });
  };

  handleEnter() {
    let entity = parseMetadata(this.state.searchResults.results[this.state.focusIndex]);

    // Redirect to entity once we have entity detail page
    // Right now console logging entity for identification purposes

    console.log('ENTER on:', entity.id);
  }

  handleSearch(page) {
    if (page === 0 || page > this.state.numPages) {
      return;
    }

    let offset = (page - 1) * PAGE_SIZE;

    let query = 'tags:' + this.props.tag;
    let target = this.props.target ? this.props.target : [];

    // removed sort, cannot search and sort at the same time
    MySearchApi.search({
      namespace: NamespaceStore.getState().selectedNamespace,
      query,
      target,
      limit: PAGE_SIZE,
      offset,
    }).subscribe((res) => {
      this.setState({
        searchResults: res,
        currentPage: page,
        numPages: Math.ceil(res.total / PAGE_SIZE),
        focusIndex: 0,
      });
    });
  }

  renderBodyContent() {
    if (!this.state.searchResults.results.length) {
      return (
        <div className="text-xs-center no-search-results">
          {T.translate(`${PREFIX}.noResults`, { tag: this.props.tag })}
        </div>
      );
    }

    let currentNamespace = NamespaceStore.getState().selectedNamespace;
    let searchResultsToBeRendered = this.state.searchResults.results
      .map(parseMetadata)
      .map((entity, index) => {
        let entityTypeLabel = convertEntityTypeToApi(entity.type);
        let entityUrl = `/ns/${currentNamespace}/${entityTypeLabel}/${entity.id}`;
        return (
          <NavLinkWrapper
            key={entity.id}
            to={this.props.isNativeLink ? `/cdap${entityUrl}` : entityUrl}
            isNativeLink={this.props.isNativeLink}
          >
            <div
              key={uuidV4()}
              className={classnames('row search-results-item', {
                active: index === this.state.focusIndex,
              })}
            >
              <Col xs="6">
                <div className="entity-title">
                  <span className="entity-icon">
                    <span className={entity.icon} />
                  </span>
                  <span className="entity-name">{entity.id}</span>
                </div>
                <div className="entity-description">
                  <span>{entity.metadata.metadata.SYSTEM.properties.description}</span>
                </div>
              </Col>

              <Col xs="6">
                <div className="entity-tags-container text-xs-right">
                  {entity.metadata.metadata.SYSTEM.tags.map((tag) => {
                    return <Badge key={uuidV4()}>{tag}</Badge>;
                  })}
                  {entity.metadata.metadata.USER
                    ? entity.metadata.metadata.USER.tags.map((tag) => {
                        return <Badge key={uuidV4()}>{tag}</Badge>;
                      })
                    : null}
                </div>
              </Col>
            </div>
          </NavLinkWrapper>
        );
      });

    return <div>{searchResultsToBeRendered}</div>;
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className="search-results-modal"
        size="lg"
        backdrop="static"
      >
        <SpotlightModalHeader
          toggle={this.props.toggle}
          handleSearch={this.handleSearch.bind(this)}
          currentPage={this.state.currentPage}
          query={this.props.query}
          tag={this.props.tag}
          numPages={this.state.numPages}
          total={this.state.searchResults.total}
        />
        <ModalBody>
          <div className="search-results-container">
            <Pagination
              setCurrentPage={this.handleSearch.bind(this)}
              currentPage={this.state.currentPage}
            >
              {this.renderBodyContent()}
            </Pagination>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
