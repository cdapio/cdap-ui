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
import { Col, Form, FormGroup, Label, Row } from 'reactstrap';
import IconSVG from 'components/shared/IconSVG';
import moment from 'moment';
import classnames from 'classnames';
import MyRulesEngineApi from 'api/rulesengine';
import NamespaceStore from 'services/NamespaceStore';
import LoadingSVG from 'components/shared/LoadingSVG';
import DSVEditor from 'components/DSVEditor';
import RulesEngineStore, {
  RULESENGINEACTIONS,
} from 'components/RulesEngineHome/RulesEngineStore';
import uuidV4 from 'uuid/v4';
import { preventPropagation } from 'services/helpers';
import RulebooksPopover from 'components/RulesEngineHome/RulesTab/Rule/RulebooksPopover';
import {
  getRuleBooks,
  setError,
} from 'components/RulesEngineHome/RulesEngineStore/RulesEngineActions';
import { DragSource } from 'react-dnd';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { getRules } from 'components/RulesEngineHome/RulesEngineStore/RulesEngineActions';
import T from 'i18n-react';

require('./Rule.scss');

const PREFIX = 'features.RulesEngine.Rule';
const DragTypes = {
  RULE: 'RULE',
};

export { DragTypes };

const ruleSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    const rule = { rule: props.rule };
    return rule;
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}
class Rule extends Component {
  static propTypes = {
    rule: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  state = {
    viewDetails: false,
    detailsLoading: false,
    ruleDetails: null,
    edit: false,
    errorMessage: '',
    loading: false,
    extendedMessage: '',
    confirmationModalIsOpen: false,
  };

  componentDidMount() {
    this.rulesStoreSubscription = RulesEngineStore.subscribe(() => {
      const { rules } = RulesEngineStore.getState();
      if (rules.activeRuleId === this.props.rule.id) {
        this.fetchRuleDetails();
      } else {
        if (this.state.viewDetails) {
          this.setState({
            viewDetails: false,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.rulesStoreSubscription) {
      this.rulesStoreSubscription();
    }
  }

  viewDetails = () => {
    if (this.state.viewDetails) {
      RulesEngineStore.dispatch({
        type: RULESENGINEACTIONS.RESETACTIVERULE,
      });
      return;
    }
    RulesEngineStore.dispatch({
      type: RULESENGINEACTIONS.SETACTIVERULE,
      payload: {
        activeRuleId: this.props.rule.id,
      },
    });
  };

  fetchRuleDetails = () => {
    if (this.state.viewDetails) {
      return;
    }
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    this.setState({
      viewDetails: true,
      detailsLoading: true,
    });
    MyRulesEngineApi.getRuleDetails({
      namespace,
      ruleid: this.props.rule.id,
    }).subscribe(
      (res) => {
        this.setState({
          ruleDetails: res.values,
          detailsLoading: false,
        });
      },
      () => {
        this.setState({
          detailsLoading: false,
        });
      }
    );
  };

  toggleConfirmationModal = () => {
    this.setState({
      confirmationModalIsOpen: !this.state.confirmationModalIsOpen,
    });
  };

  onDeleteRule = () => {
    this.setState({
      loading: true,
    });
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    MyRulesEngineApi.deleteRule({
      namespace,
      ruleid: this.state.ruleDetails.id,
    }).subscribe(
      () => {
        getRules();
        this.setState({
          loading: false,
          confirmationModalIsOpen: false,
        });
      },
      (err) => {
        this.setState({
          errorMessage: T.translate(
            `${PREFIX}.ConfirmationModal.failedMessage`,
            {
              id: this.state.ruleDetails.id,
            }
          ),
          extendedMessage: JSON.stringify(err),
          loading: false,
        });
      }
    );
  };

  onRulesChange(rows) {
    // TODO: add edit feature for rule in rules tab.
    console.log(rows);
  }

  onRuleBookSelect = (rulebookid) => {
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    MyRulesEngineApi.addRuleToRuleBook({
      namespace,
      rulebookid,
      ruleid: this.props.rule.id,
    }).subscribe(() => {
      getRuleBooks();
    }, setError);
  };

  renderDetails = () => {
    if (this.state.detailsLoading) {
      return (
        <Col xs="12" className="text-center">
          <LoadingSVG />
        </Col>
      );
    }
    const rules = this.state.ruleDetails.action.map((action) => ({
      uniqueId: uuidV4(),
      property: action,
    }));
    return (
      <Col xs="12">
        <Form onSubmit={preventPropagation}>
          <FormGroup row>
            <Col sm={12}>
              <p className="description">
                {' '}
                {this.state.ruleDetails.description}
              </p>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}> {T.translate('commons.when')} </Label>
            <Col sm={10}>
              <textarea
                value={this.state.ruleDetails.condition}
                className="form-control"
                row={10}
                disabled
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}> {T.translate('commons.then')} </Label>
            <Col sm={10}>
              <fieldset disabled={!this.state.edit}>
                <DSVEditor
                  values={rules}
                  onChange={this.onRulesChange}
                  disabled={!this.state.edit}
                />
              </fieldset>
            </Col>
          </FormGroup>
          <Row>
            <Col xs={6}>
              <RulebooksPopover onChange={this.onRuleBookSelect} />
            </Col>
            <Col xs={6} className="text-right delete-btn-container">
              <div
                className="btn btn-secondary"
                onClick={this.toggleConfirmationModal}
              >
                <IconSVG name="icon-trash" className="text-danger" />
              </div>
              <ConfirmationModal
                headerTitle={T.translate(`${PREFIX}.ConfirmationModal.title`)}
                toggleModal={this.toggleConfirmationModal}
                confirmationText={T.translate(
                  `${PREFIX}.ConfirmationModal.text`,
                  {
                    id: this.state.ruleDetails.id,
                  }
                )}
                confirmFn={this.onDeleteRule}
                cancelFn={this.toggleConfirmationModal}
                isOpen={this.state.confirmationModalIsOpen}
                isLoading={this.state.loading}
                errorMessage={this.state.errorMessage}
                extendedMessage={this.state.extendedMessage}
              />
            </Col>
          </Row>
        </Form>
      </Col>
    );
  };

  renderRow = () => {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div onClick={this.viewDetails}>
        <Col xs="6">
          <div className="rule-name-container">
            <div className="svg-arrow-wrapper">
              {!this.state.viewDetails ? (
                <IconSVG name="icon-caret-right" />
              ) : (
                <IconSVG name="icon-caret-down" />
              )}
            </div>
            <div className="rule-name" title={this.props.rule.id}>
              {this.props.rule.id}
            </div>
          </div>
        </Col>
        <Col xs="5">
          {moment(this.props.rule.updated * 1000).format('MM-DD-YYYY')}
        </Col>
        <Col xs="1">
          <IconSVG name="icon-bars" />
        </Col>
      </div>
    );
  };

  render() {
    return (
      <div
        className={classnames('engine-rule row', {
          expanded: this.state.viewDetails,
        })}
      >
        {this.renderRow()}
        {this.state.viewDetails ? this.renderDetails() : null}
      </div>
    );
  }
}

export default DragSource(DragTypes.RULE, ruleSource, collect)(Rule);
