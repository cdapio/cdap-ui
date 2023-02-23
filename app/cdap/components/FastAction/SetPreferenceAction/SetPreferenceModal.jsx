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
import isObject from 'lodash/isObject';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import T from 'i18n-react';
import uuidV4 from 'uuid/v4';
import { Modal, ModalHeader, ModalBody, Tooltip } from 'reactstrap';
import { MyPreferenceApi } from 'api/preference';
import { convertProgramToApi } from 'services/program-api-converter';
import KeyValuePairs from 'components/shared/KeyValuePairs';
import KeyValueStore from 'components/shared/KeyValuePairs/KeyValueStore';
import KeyValueStoreActions from 'components/shared/KeyValuePairs/KeyValueStoreActions';
import NamespaceStore from 'services/NamespaceStore';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
import { SCOPES } from 'services/global-constants';
import If from 'components/shared/If';

export const PREFERENCES_LEVEL = {
  SYSTEM: SCOPES.SYSTEM,
  NAMESPACE: 'NAMESPACE',
};

const PREFIX = 'features.FastAction.SetPreferences';

export default class SetPreferenceModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      showResetMessage: false,
      keyValues: {},
      inheritedPreferences: [],
      sortByAttribute: 'key',
      sortOrder: 'asc',
    };

    const namespace = NamespaceStore.getState().selectedNamespace;

    this.params = {};

    if (this.props.setAtLevel === PREFERENCES_LEVEL.SYSTEM) {
      this.getSpecifiedPreferencesApi = MyPreferenceApi.getSystemPreferences;
      this.setPreferencesApi = MyPreferenceApi.setSystemPreferences;
    } else {
      this.params.namespace = namespace;
      this.getSpecifiedPreferencesApi = MyPreferenceApi.getNamespacePreferences;
      this.getInheritedPreferencesApi = MyPreferenceApi.getSystemPreferences;
      this.setPreferencesApi = MyPreferenceApi.setNamespacePreferences;

      if (this.props.entity) {
        if (this.props.entity.type === 'application') {
          this.params.appId = this.props.entity.id;
          this.getSpecifiedPreferencesApi = MyPreferenceApi.getAppPreferences;
          this.getInheritedPreferencesApi =
            MyPreferenceApi.getNamespacePreferencesResolved;
          this.setPreferencesApi = MyPreferenceApi.setAppPreferences;
        } else {
          this.params.appId = this.props.entity.applicationId;
          this.params.programId = this.props.entity.id;
          this.params.programType = convertProgramToApi(
            this.props.entity.programType
          );
          this.getSpecifiedPreferencesApi =
            MyPreferenceApi.getProgramPreferences;
          this.getInheritedPreferencesApi =
            MyPreferenceApi.getAppPreferencesResolved;
          this.setPreferencesApi = MyPreferenceApi.setProgramPreferences;
        }
      }
    }

    this.apiSubscriptions = [];
    this.eventEmitter = ee(ee);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.onKeyValueChange = this.onKeyValueChange.bind(this);
    this.preventPropagation = this.preventPropagation.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  componentWillMount() {
    this.getSpecifiedPreferences();
    this.getInheritedPreferences();
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
    this.apiSubscriptions.forEach((apiSubscription) =>
      apiSubscription.unsubscribe()
    );
  }

  onKeyValueChange(keyValues) {
    this.setState({ keyValues });
  }

  getSpecifiedPreferences() {
    this.apiSubscriptions.push(
      this.getSpecifiedPreferencesApi(this.params).subscribe(
        (res) => {
          let keyValues;
          if (isEmpty(res)) {
            keyValues = {
              pairs: [
                {
                  key: '',
                  value: '',
                  uniqueId: uuidV4(),
                },
              ],
            };
          } else {
            keyValues = { pairs: this.getKeyValPair(res) };
          }
          this.setState({
            keyValues,
          });
          KeyValueStore.dispatch({
            type: KeyValueStoreActions.onUpdate,
            payload: { pairs: keyValues.pairs },
          });
        },
        (error) => {
          this.setState({
            error: isObject(error) ? error.response : error,
          });
        }
      )
    );
  }

  getInheritedPreferences() {
    if (!this.getInheritedPreferencesApi) {
      return;
    }
    this.apiSubscriptions.push(
      this.getInheritedPreferencesApi(this.params).subscribe(
        (res) => {
          let resolvedPrefArray = this.getKeyValPair(res);
          resolvedPrefArray = orderBy(
            resolvedPrefArray,
            [this.state.sortByAttribute],
            [this.state.sortOrder]
          );
          this.setState({
            inheritedPreferences: resolvedPrefArray,
          });
        },
        (error) => {
          this.setState({
            error: isObject(error) ? error.response : error,
          });
        }
      )
    );
  }

  setPreferences() {
    this.setState({ saving: true });
    this.apiSubscriptions.push(
      this.setPreferencesApi(this.params, this.getKeyValObject()).subscribe(
        () => {
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
          if (this.props.setAtLevel === PREFERENCES_LEVEL.NAMESPACE) {
            this.eventEmitter.emit(globalEvents.NSPREFERENCESSAVED);
          }
          this.props.toggleModal();
          this.setState({ saving: false });
        },
        (error) => {
          this.setState({
            saving: false,
            error: isObject(error) ? error.response : error,
          });
        }
      )
    );
  }

  getKeyValPair(prefObj) {
    // doing this to make sure that we iterate through the keys
    // in alphabetical order
    const sortedPrefObjectKeys = [...Object.keys(prefObj)].sort();
    return sortedPrefObjectKeys.map((key) => {
      return {
        key: key,
        value: prefObj[key],
        uniqueId: uuidV4(),
      };
    });
  }

  getKeyValObject() {
    const keyValArr = this.state.keyValues.pairs;
    const keyValObj = {};
    keyValArr.forEach((pair) => {
      if (pair.key.length > 0 && pair.value.length > 0) {
        keyValObj[pair.key] = pair.value;
      }
    });
    return keyValObj;
  }

  toggleTooltip() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  toggleSorted(attribute) {
    let sortOrder = 'asc';
    if (this.state.sortByAttribute !== attribute) {
      this.setState({ sortOrder });
    } else {
      if (this.state.sortOrder === 'asc') {
        sortOrder = 'desc';
      }
      this.setState({ sortOrder });
    }
    this.setState({ sortByAttribute: attribute });
    const newInheritedPreferences = orderBy(
      this.state.inheritedPreferences,
      attribute,
      sortOrder
    );
    this.setState({ inheritedPreferences: newInheritedPreferences });
  }

  oneFieldMissing() {
    if (this.state.keyValues.pairs) {
      return this.state.keyValues.pairs.some((keyValuePair) => {
        const emptyKeyField = keyValuePair.key.length === 0;
        const emptyValueField = keyValuePair.value.length === 0;
        return (
          (emptyKeyField && !emptyValueField) ||
          (!emptyKeyField && emptyValueField)
        );
      });
    }
    return false;
  }

  isTitleOverflowing() {
    const modalTitle = document.querySelector(
      '.specify-preferences-description h4'
    );
    if (modalTitle) {
      return modalTitle.offsetWidth < modalTitle.scrollWidth;
    }
    return false;
  }

  resetFields(event) {
    event.preventDefault();
    this.setState({
      showResetMessage: true,
      error: null,
    });
    this.getSpecifiedPreferences();
    setTimeout(() => {
      this.setState({
        showResetMessage: false,
      });
    }, 3000);
  }

  preventPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  renderSpecifyPreferences() {
    const actionLabel = T.translate(`${PREFIX}.actionLabel`);
    let entity, entityWithType, description, tooltipID;
    if (this.props.setAtLevel === PREFERENCES_LEVEL.SYSTEM) {
      entityWithType = 'system';
      description = T.translate(`${PREFIX}.DescriptionLabel.system`);
      tooltipID = `${entityWithType}-title`;
    } else {
      entity = this.params.namespace;
      entityWithType = `namespace "${entity}"`;
      description = T.translate(`${PREFIX}.DescriptionLabel.namespace`);
      tooltipID = `${entity}-title`;
      if (this.props.entity) {
        entity = this.props.entity.id;
        entityWithType = `${this.props.entity.type} "${entity}"`;
        tooltipID = `setpreference-modaltitle-${this.props.entity.uniqueId}`;
        if (this.props.entity.type === 'application') {
          description = T.translate(`${PREFIX}.DescriptionLabel.app`);
        } else {
          description = T.translate(`${PREFIX}.DescriptionLabel.program`);
        }
      }
    }
    const title = `${actionLabel} for ${entityWithType}`;
    const keyLabel = T.translate(`${PREFIX}.ColumnLabel.key`);
    const valueLabel = T.translate(`${PREFIX}.ColumnLabel.value`);
    return (
      <div>
        {this.isTitleOverflowing() ? (
          <Tooltip
            placement="top"
            isOpen={this.state.tooltipOpen}
            target={tooltipID}
            toggle={this.toggleTooltip}
            className="entity-preferences-modal"
            delay={0}
          >
            {entity}
          </Tooltip>
        ) : null}
        <div className="specify-preferences-description">
          <h4 id={tooltipID}>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="specify-preferences-list">
          <div className="specify-preferences-labels">
            <span className="key-label">{keyLabel}</span>
            <span className="value-label">{valueLabel}</span>
          </div>
          <div className="specify-preferences-values">
            {!isEmpty(this.state.keyValues) ? (
              <KeyValuePairs
                keyValues={this.state.keyValues}
                onKeyValueChange={this.onKeyValueChange}
              />
            ) : (
              <span className="fa fa-spinner fa-spin" />
            )}
          </div>
        </div>
      </div>
    );
  }

  renderInheritedPreferencesColumnHeader(column) {
    const columnToAttribute = column.toLowerCase();
    return (
      <th>
        <span
          className="toggleable-columns"
          onClick={this.toggleSorted.bind(this, columnToAttribute)}
        >
          {this.state.sortByAttribute === columnToAttribute ? (
            <span>
              <span className="text-underline">{column}</span>
              <span>
                {this.state.sortOrder === 'asc' ? (
                  <i className="fa fa-caret-down fa-lg" />
                ) : (
                  <i className="fa fa-caret-up fa-lg" />
                )}
              </span>
            </span>
          ) : (
            <span>{column}</span>
          )}
        </span>
      </th>
    );
  }

  renderInheritedPreferences() {
    if (!this.getInheritedPreferencesApi) {
      return null;
    }
    const titleLabel = T.translate(`${PREFIX}.inheritedPrefsLabel`);
    const keyLabel = T.translate(`${PREFIX}.ColumnLabel.key`);
    const valueLabel = T.translate(`${PREFIX}.ColumnLabel.value`);
    const numInheritedPreferences = this.state.inheritedPreferences.length;
    return (
      <div>
        <div className="inherited-preferences-label">
          <h4>
            {titleLabel} ({numInheritedPreferences})
          </h4>
        </div>
        <div className="inherited-preferences-list">
          {numInheritedPreferences ? (
            <div>
              <table>
                <thead>
                  <tr>
                    {this.renderInheritedPreferencesColumnHeader(keyLabel)}
                    {this.renderInheritedPreferencesColumnHeader(valueLabel)}
                  </tr>
                </thead>
                <tbody>
                  {this.state.inheritedPreferences.map(
                    (inheritedPreference, index) => {
                      return (
                        <tr className="inherited-preference" key={index}>
                          <td>{inheritedPreference.key}</td>
                          <td>{inheritedPreference.value}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">
              {T.translate(`${PREFIX}.noInheritedPrefs`)}
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const modalLabel = T.translate(`${PREFIX}.modalLabel`);
    const savingLabel = T.translate(`${PREFIX}.ButtonLabel.saving`);
    const saveAndCloseLabel = T.translate(`${PREFIX}.ButtonLabel.saveAndClose`);
    const resetLink = T.translate(`${PREFIX}.reset`);
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggleModal}
        className="confirmation-modal set-preference-modal cdap-modal"
        size="lg"
        backdrop="static"
        zIndex="1601"
      >
        <ModalHeader className="modal-header">
          <div className="float-left">
            <span className="button-icon fa fa-wrench" />
            <span className="button-icon title">{modalLabel}</span>
          </div>
          <div className="float-right">
            <div className="close-modal-btn" onClick={this.props.toggleModal}>
              <span className="button-icon fa fa-times" />
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="modal-body" onClick={this.preventPropagation}>
          <div className="preferences-container">
            <div className="specify-preferences-container">
              {this.renderSpecifyPreferences()}
              <div className="clearfix">
                {this.state.saving ? (
                  <button
                    className="btn btn-primary float-left saving"
                    disabled="disabled"
                  >
                    <span className="fa fa-spinner fa-spin" />
                    <span>{savingLabel}</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-primary float-left not-saving"
                    onClick={this.setPreferences}
                    disabled={this.oneFieldMissing()}
                    data-cy="save-prefs-btn"
                    data-testid="save-prefs-btn"
                  >
                    <span>{saveAndCloseLabel}</span>
                  </button>
                )}
                <span className="float-left reset">
                  <a onClick={this.resetFields}>{resetLink}</a>
                </span>
                <If condition={this.state.showResetMessage}>
                  <span className="float-left text-success reset-success">
                    Reset Successful
                  </span>
                </If>
                {this.state.keyValues.pairs ? (
                  <span className="float-right num-rows">
                    {this.state.keyValues.pairs.length === 1 ? (
                      <span>{this.state.keyValues.pairs.length} row</span>
                    ) : (
                      <span>{this.state.keyValues.pairs.length} rows</span>
                    )}
                  </span>
                ) : null}
              </div>
              <div className="preferences-error">
                <If condition={this.state.error}>
                  <div className="text-danger">{this.state.error}</div>
                </If>
              </div>
            </div>
            <If condition={!this.props.setAtLevel === PREFERENCES_LEVEL.SYSTEM}>
              <hr />
            </If>
            <div className="inherited-preferences-container">
              {this.renderInheritedPreferences()}
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

SetPreferenceModal.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    applicationId: PropTypes.string,
    uniqueId: PropTypes.string,
    type: PropTypes.oneOf(['application', 'program']).isRequired,
    programType: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setAtLevel: PropTypes.string,
  onSuccess: PropTypes.func,
};

SetPreferenceModal.defaultProps = {
  onSuccess: () => {},
};
