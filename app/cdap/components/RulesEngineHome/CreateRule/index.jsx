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
import { Row, Col, Input, Form, FormGroup, Label } from 'reactstrap';
import { preventPropagation } from 'services/helpers';
import DSVEditor from 'components/DSVEditor';
import MyRulesEngine from 'api/rulesengine';
import NamespaceStore from 'services/NamespaceStore';
import {
  getRules,
  setError,
} from 'components/RulesEngineHome/RulesEngineStore/RulesEngineActions';
import isEmpty from 'lodash/isEmpty';
import T from 'i18n-react';

require('./CreateRule.scss');
const PREFIX = 'features.RulesEngine.CreateRule';

export default class CreateRule extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  componentDidMount() {
    if (this.nameRef) {
      setTimeout(() => this.nameRef.focus(), 1);
    }
  }

  state = {
    when: '',
    description: '',
    then: [
      {
        property: '',
        uniqueId: 0,
      },
    ],
    name: '',
  };

  onNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  onRulesChange = (conditions) => {
    this.setState({
      then: conditions,
    });
  };
  onConditionChange = (e) => {
    this.setState({
      when: e.target.value,
    });
  };

  onDescriptionChange = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  isActionsEmpty = () => {
    return isEmpty(this.state.then.map((action) => action.property).join(''));
  };

  isApplyBtnDisabled = () => {
    return (
      isEmpty(this.state.name) ||
      isEmpty(this.state.description) ||
      isEmpty(this.state.when) ||
      this.isActionsEmpty()
    );
  };

  createRule = () => {
    const { selectedNamespace: namespace } = NamespaceStore.getState();
    let config = {};
    const { name: id, when, description } = this.state;
    let then = this.state.then;
    then = then.map((clause) => clause.property);
    config = { id, description, when, then };
    MyRulesEngine.createRule({ namespace }, config).subscribe(() => {
      getRules();
      this.props.onClose();
    }, setError);
  };

  render() {
    return (
      <div className="create-rule-container">
        <Row>
          <Col xs="6">
            <Input
              value={this.state.name}
              onChange={this.onNameChange}
              placeholder={T.translate(`${PREFIX}.form.nameplaceholder`)}
              innerRef={(ref) => (this.nameRef = ref)}
            />
          </Col>
          <Col xs="6">{T.translate(`${PREFIX}.form.today`)}</Col>
          <Col xs="12">
            <Form
              onSubmit={preventPropagation}
              className="when-then-clause-container"
            >
              <FormGroup row>
                <Label sm={2}>
                  {' '}
                  {T.translate(`${PREFIX}.form.description`)}{' '}
                </Label>
                <Col sm={9} className="when-then-value">
                  <textarea
                    value={this.state.description}
                    onChange={this.onDescriptionChange}
                    placeholder={T.translate(
                      `${PREFIX}.form.descriptionplaceholder`
                    )}
                    className="form-control"
                    row={10}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}> {T.translate('commons.when')} </Label>
                <Col sm={9} className="when-then-value">
                  <textarea
                    value={this.state.when}
                    placeholder={T.translate(
                      `${PREFIX}.form.whenClausePlaceholder`
                    )}
                    onChange={this.onConditionChange}
                    className="form-control"
                    row={15}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2}> {T.translate('commons.then')} </Label>
                <Col sm={9} className="when-then-value">
                  <DSVEditor
                    values={this.state.then}
                    onChange={this.onRulesChange}
                    placeholder={T.translate(
                      `${PREFIX}.form.actionplaceholder`
                    )}
                  />
                </Col>
              </FormGroup>
              <p className="fields-required-text">
                <i>
                  {T.translate('features.RulesEngine.shared.allFieldsRequired')}
                </i>
              </p>
            </Form>
          </Col>
        </Row>
        <hr />
        <div className="btn-container">
          <button
            className="btn btn-primary"
            onClick={this.createRule}
            disabled={this.isApplyBtnDisabled()}
          >
            {T.translate(`${PREFIX}.form.apply`)}
          </button>
          <div className="btn btn-secondary" onClick={this.props.onClose}>
            {T.translate(`${PREFIX}.form.cancel`)}
          </div>
        </div>
      </div>
    );
  }
}
