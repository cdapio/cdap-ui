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
import React from 'react';
import { Col, FormGroup, Label, Form } from 'reactstrap';
import AddNamespaceActions from 'services/WizardStores/AddNamespace/AddNamespaceActions';
import AddNamespaceStore from 'services/WizardStores/AddNamespace/AddNamespaceStore';
import { Provider, connect } from 'react-redux';
import InputWithValidations from 'components/InputWithValidations';
import T from 'i18n-react';

// Namespace Name
const mapStateToNamespaceNameProps = (state) => {
  return {
    value: state.general.name,
    type: 'text',
    placeholder: T.translate(
      'features.Wizard.Add-Namespace.GeneralInfoStep.name-placeholder'
    ),
    disabled: state.editableFields.fields.indexOf('name') === -1,
  };
};

const mapDispatchToNamespaceNameProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setName,
        payload: { name: e.target.value },
      });
    },
  };
};

// Namespace description
const mapStateToNamespaceDescriptionProps = (state) => {
  return {
    value: state.general.description,
    type: 'text',
    placeholder: T.translate(
      'features.Wizard.Add-Namespace.GeneralInfoStep.description-placeholder'
    ),
    disabled: state.editableFields.fields.indexOf('description') === -1,
  };
};

const mapDispatchToNamespaceDescriptionProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setDescription,
        payload: { description: e.target.value },
      });
    },
  };
};

const InputNamespaceName = connect(
  mapStateToNamespaceNameProps,
  mapDispatchToNamespaceNameProps
)(InputWithValidations);

const InputNamespaceDescription = connect(
  mapStateToNamespaceDescriptionProps,
  mapDispatchToNamespaceDescriptionProps
)(InputWithValidations);

export default function GeneralInfoStep() {
  return (
    <Provider store={AddNamespaceStore}>
      <Form
        className="form-horizontal general-info-step"
        onSubmit={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <FormGroup row>
          <Col xs="3">
            <Label className="control-label">
              {T.translate(
                'features.Wizard.Add-Namespace.GeneralInfoStep.name-label'
              )}
            </Label>
          </Col>
          <Col xs="7">
            <InputNamespaceName />
          </Col>
          <span className="fa fa-asterisk text-danger float-left" />
        </FormGroup>
        <FormGroup row>
          <Col xs="3">
            <Label className="control-label">
              {T.translate(
                'features.Wizard.Add-Namespace.GeneralInfoStep.description-label'
              )}
            </Label>
          </Col>
          <Col xs="7">
            <InputNamespaceDescription />
          </Col>
        </FormGroup>
      </Form>
    </Provider>
  );
}
