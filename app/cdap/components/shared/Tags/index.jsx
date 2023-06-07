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
import { MyMetadataApi } from 'api/metadata';
import isObject from 'lodash/isObject';
import Mousetrap from 'mousetrap';
import NamespaceStore from 'services/NamespaceStore';
import { convertEntityTypeToApi } from 'services/entity-type-api-converter';
import Tag from 'components/shared/Tags/Tag';
import Alert from 'components/shared/Alert';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
require('./Tags.scss');
import T from 'i18n-react';
import { SCOPES } from 'services/global-constants';

const PREFIX = 'features.Tags';

export default class Tags extends Component {
  static defaultProps = {
    showCountLabel: true,
    isNativeLink: false,
    viewOnly: false,
    displayAll: false,
    preventDefault: false,
  };

  static propTypes = {
    entity: PropTypes.object,
    showCountLabel: PropTypes.bool,
    isNativeLink: PropTypes.bool,
    viewOnly: PropTypes.bool,
    displayAll: PropTypes.bool,
    preventDefault: PropTypes.bool,
  };

  state = {
    userTags: [],
    showInputField: false,
    loading: false,
    currentInputTag: '',
    showAllTagsLabel: false,
    showAllTagsPopover: false,
  };

  params = {
    namespace: NamespaceStore.getState().selectedNamespace,
    entityType: convertEntityTypeToApi(this.props.entity.type),
    entityId: this.props.entity.id,
  };

  subscriptions = [];

  componentDidMount() {
    Mousetrap.bind('return', this.addTag);
    Mousetrap.bind('escape', this.closeInputFieldIfEmpty);

    this.getTags();
  }

  componentWillUnmount() {
    Mousetrap.unbind('return');
    Mousetrap.unbind('escape');

    this.subscriptions.map((subscriber) => subscriber.unsubscribe());
  }

  getTags = () => {
    this.setState({ loading: false });

    const tagsSubscription = MyMetadataApi.getTags(this.params).subscribe(
      (res) => {
        this.setState(
          {
            userTags: res.tags
              .filter((tag) => tag.scope === SCOPES.USER)
              .map((tag) => tag.name)
              .sort(),
            loading: false,
          },
          this.isTagsOverflowing
        );

        if (this.state.showInputField) {
          this.toggleInputField();
        }
      },
      (err) => {
        this.setState({
          error: isObject(err) ? err.response : err,
          loading: false,
        });
      }
    );

    this.subscriptions.push(tagsSubscription);
  };

  toggleInputField = () => {
    if (!this.state.loading) {
      if (this.state.showInputField) {
        this.setState({
          currentInputTag: '',
          error: false,
        });
      }
      this.setState({
        showInputField: !this.state.showInputField,
      });
    }
  };

  closeInputFieldIfEmpty = () => {
    if (this.state.currentInputTag === '' && this.state.showInputField) {
      this.setState({
        showInputField: false,
        error: false,
      });
    }
  };

  onInputTagChange = (e) => {
    this.setState({
      currentInputTag: e.target.value,
    });
  };

  addTag = () => {
    if (this.state.currentInputTag !== '') {
      this.setState({
        loading: true,
      });
      const addTagsSubscription = MyMetadataApi.addTags(this.params, [
        this.state.currentInputTag,
      ]).subscribe(
        () => {
          this.getTags();
        },
        (err) => {
          this.setState({
            error: isObject(err) ? err.response : err,
            loading: false,
          });
        }
      );

      this.subscriptions.push(addTagsSubscription);
    }
  };

  deleteTag(tag, event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    const params = Object.assign({}, this.params, { key: tag });

    const deleteTagsSubscription = MyMetadataApi.deleteTags(params).subscribe(
      () => {
        this.getTags();
      },
      (err) => {
        this.setState({
          error: isObject(err) ? err.response : err,
        });
      }
    );

    this.subscriptions.push(deleteTagsSubscription);
  }

  isTagsOverflowing = () => {
    if (this.props.displayAll) {
      return;
    }

    const tagsListElem = document.getElementsByClassName('tags-list')[0];
    if (!tagsListElem) {
      return;
    }

    const tagsAreOverflowing =
      tagsListElem.clientWidth < tagsListElem.scrollWidth;

    if (
      (tagsAreOverflowing && this.state.showAllTagsLabel) ||
      (!tagsAreOverflowing && !this.state.showAllTagsLabel)
    ) {
      return;
    }

    this.setState({
      showAllTagsLabel: tagsAreOverflowing,
    });
  };

  toggleAllTagsPopover = () => {
    this.setState({
      showAllTagsPopover: !this.state.showAllTagsPopover,
    });
  };

  renderUserTags() {
    return (
      <span>
        {this.state.userTags.map((tag) => {
          return (
            <Tag
              value={tag}
              onDelete={this.deleteTag.bind(this, tag)}
              scope={SCOPES.USER}
              isNativeLink={this.props.isNativeLink}
              viewOnly={this.props.viewOnly}
              preventDefault={this.props.preventDefault}
              key={tag}
            />
          );
        })}
      </span>
    );
  }

  renderTagsPopover() {
    const labelElem = () => {
      return (
        <span className="all-tags-label">
          {T.translate(`${PREFIX}.allTags`)}
        </span>
      );
    };

    const tagsCount = this.state.userTags.length;

    return (
      <Popover
        target={labelElem}
        className="tags-popover"
        placement="bottom"
        bubbleEvent={false}
        enableInteractionInPopover={true}
        showPopover={this.state.showAllTagsPopover}
      >
        <div className="tags-popover-header">
          <strong>
            {T.translate(`${PREFIX}.labelWithCount`, { count: tagsCount })}
          </strong>
          <IconSVG name="icon-close" onClick={this.toggleAllTagsPopover} />
        </div>
        {this.renderUserTags()}
      </Popover>
    );
  }

  renderInputField() {
    return (
      <span>
        <input
          type="text"
          className="tag-input form-control mousetrap"
          value={this.state.currentInputTag}
          onChange={this.onInputTagChange}
          onBlur={this.toggleInputField}
          autoFocus={true}
          disabled={this.state.loading ? 'disabled' : null}
          data-testid="tag-input"
        />
      </span>
    );
  }

  renderPlusButton() {
    return (
      <span
        className="btn btn-primary plus-button-container"
        onClick={this.toggleInputField}
        data-testid="tag-plus-button"
      >
        <IconSVG name="icon-plus" className="text-white" />
      </span>
    );
  }

  renderAddTag() {
    if (this.props.viewOnly) {
      return null;
    }

    return this.state.showInputField
      ? this.renderInputField()
      : this.renderPlusButton();
  }

  getNoTagsText() {
    if (this.props.viewOnly) {
      return T.translate(`${PREFIX}.noTagsViewonly`);
    }

    return T.translate(`${PREFIX}.notags`);
  }

  render() {
    const tagsCount = this.state.userTags.length;

    return (
      <div className="tags-holder">
        {this.props.showCountLabel ? (
          <strong>{`${T.translate(`${PREFIX}.labelWithCount`, {
            count: tagsCount,
          })}:`}</strong>
        ) : null}
        {!tagsCount && !this.state.loading ? (
          <i>{T.translate(`${PREFIX}.notags`)}</i>
        ) : null}
        {!tagsCount && !this.state.loading ? (
          <i>{this.getNoTagsText()}</i>
        ) : null}
        <span className="tags-list">{this.renderUserTags()}</span>
        {this.state.showAllTagsLabel ? this.renderTagsPopover() : null}
        {this.renderAddTag()}
        {this.state.loading ? (
          <IconSVG
            name="icon-spinner"
            className="fa-lg fa-spin"
            data-testid="loading-icon"
          />
        ) : null}
        {this.state.error ? (
          <Alert
            message={this.state.error}
            type="error"
            showAlert={true}
            onClose={() => this.setState({ error: false })}
          />
        ) : null}
      </div>
    );
  }
}
