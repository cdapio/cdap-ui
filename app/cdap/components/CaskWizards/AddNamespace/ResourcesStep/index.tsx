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
import AddNamespaceStore from 'services/WizardStores/AddNamespace/AddNamespaceStore';
import AddNamespaceActions from 'services/WizardStores/AddNamespace/AddNamespaceActions';
import T from 'i18n-react';
import InputWithValidations from 'components/InputWithValidations';
import { Provider, connect } from 'react-redux';

// K8S Namespace
const mapStateToK8sNamespaceNameProps = (state) => {
  return {
    value: state.resources.k8sNamespace,
    type: 'text',
    placeholder: T.translate('features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-name-placeholder'),
    disabled: state.editableFields.fields.indexOf('k8sNamespace') === -1,
  };
};

const mapDispatchToK8sNamespaceNameProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setK8sNamespace,
        payload: { k8sNamespace: e.target.value },
      });
    },
  };
};

const mapStateToK8sCpuLimitProps = (state) => {
  return {
    value: state.resources.k8sNamespaceCpuLimit,
    type: 'number',
    min: 0,
    placeholder: T.translate(
      'features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-cpu-limit-placeholder'
    ),
    disabled: state.editableFields.fields.indexOf('k8sNamespaceCpuLimit') === -1,
  };
};

const mapDispatchToK8sCpuLimitProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setK8sNamespaceCpuLimit,
        payload: { k8sNamespaceCpuLimit: e.target.value },
      });
    },
  };
};

const mapStateToK8sMemoryLimitProps = (state) => {
  return {
    value: state.resources.k8sNamespaceMemoryLimit,
    type: 'number',
    min: 0,
    placeholder: T.translate(
      'features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-memory-limit-placeholder'
    ),
    disabled: state.editableFields.fields.indexOf('k8sNamespaceMemoryLimit') === -1,
  };
};

const mapDispatchToK8sMemoryLimitProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setK8sNamespaceMemoryLimit,
        payload: { k8sNamespaceMemoryLimit: e.target.value },
      });
    },
  };
};

const mapStateToServiceAccountEmailProps = (state) => {
  return {
    value: state.resources.serviceAccountEmail,
    type: 'text',
    placeholder: T.translate(
      'features.Wizard.Add-Namespace.ResourcesStep.service-account-email-placeholder'
    ),
    disabled: state.editableFields.fields.indexOf('serviceAccountEmail') === -1,
  };
};

const mapDispatchToServiceAccountEmailProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: AddNamespaceActions.setServiceAccountEmail,
        payload: { serviceAccountEmail: e.target.value },
      });
    },
  };
};

const InputK8sNamespace = connect(
  mapStateToK8sNamespaceNameProps,
  mapDispatchToK8sNamespaceNameProps
)(InputWithValidations);

const InputK8sCpuLimit = connect(
  mapStateToK8sCpuLimitProps,
  mapDispatchToK8sCpuLimitProps
)(InputWithValidations);

const InputK8sMemoryLimit = connect(
  mapStateToK8sMemoryLimitProps,
  mapDispatchToK8sMemoryLimitProps
)(InputWithValidations);

const InputK8sServiceAccountEmail = connect(
  mapStateToServiceAccountEmailProps,
  mapDispatchToServiceAccountEmailProps
)(InputWithValidations);

export default function ResourcesStep() {
  return (
    <Provider store={AddNamespaceStore}>
      <Form
        className="form-horizontal mapping-step"
        onSubmit={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <FormGroup row>
          <Col xs="4">
            <Label className="control-label">
              {T.translate('features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-name-label')}
            </Label>
          </Col>
          <Col xs="7">
            <InputK8sNamespace />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="4">
            <Label className="control-label">
              {T.translate('features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-cpu-limit-label')}
            </Label>
          </Col>
          <Col xs="7">
            <InputK8sCpuLimit />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="4">
            <Label className="control-label">
              {T.translate('features.Wizard.Add-Namespace.ResourcesStep.k8s-nm-memory-limit-label')}
            </Label>
          </Col>
          <Col xs="7">
            <InputK8sMemoryLimit />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="4">
            <Label className="control-label">
              {T.translate(
                'features.Wizard.Add-Namespace.ResourcesStep.service-account-email-label'
              )}
            </Label>
          </Col>
          <Col xs="7">
            <InputK8sServiceAccountEmail />
          </Col>
        </FormGroup>
      </Form>
    </Provider>
  );
}
