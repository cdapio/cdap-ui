/*
 * Copyright © 2022 Cask Data, Inc.
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

import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import T from 'i18n-react';
import {
  reducer,
  initialState,
  updateInputField,
  updateError,
  updateAlertState,
  reset,
  createTethering,
} from './reducer';
import Alert from 'components/shared/Alert';
import OmniNamespaces from './OmniNamespaces';
import CdfInfo from './CdfInfo';
import { HeaderContainer, HeaderTitle, StyledButton } from '../shared.styles';
import { Container, BackButton, Divider, StyledBodyContainer, ButtonsContainer } from './styles';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';

const NewTetheringRequest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { inputFields, showAlert, apiError, validationErrors } = state;
  const { projectName, region, instanceName, namespace, cpuLimit, memoryLimit } = inputFields;
  const history = useHistory();

  const areInputsValid = (): boolean => {
    const requiredFields = [
      { name: 'projectName', val: projectName },
      { name: 'region', val: region },
      { name: 'instanceName', val: instanceName },
    ];
    let allValid = true;
    const errors = {};

    requiredFields.forEach((field) => {
      let errObj = {};
      if (!field.val) {
        errObj = {
          msg: T.translate(`${I18NPREFIX}.validationError`, { fieldName: field.name }),
        };
        allValid = false;
      }
      errors[field.name] = errObj;
    });
    updateError(dispatch, { errType: 'validationErrors', errVal: errors });
    return allValid;
  };

  const handleChange = (target: string, updatedVal: string | number) => {
    updateInputField(dispatch, { [target]: updatedVal });
  };

  const handleSend = async () => {
    if (areInputsValid()) {
      const connectionInfo = {
        peer: instanceName,
        endpoint: 'http://www.google.com', // TODO: needs clarification on how to obtain
        namespaceAllocations: [{ namespace, cpuLimit, memoryLimit }],
        metadata: {
          project: projectName,
          location: region,
        },
      };
      try {
        await createTethering(connectionInfo);
      } catch (err) {
        updateError(dispatch, { errType: 'apiError', errVal: err });
      }
      updateAlertState(dispatch, true);
    }
  };

  const handleCancel = () => {
    history.push('/administration/tethering');
  };

  const renderAlert = () => {
    const hasError = Boolean(Object.keys(apiError).length);
    const message = hasError
      ? `${T.translate(`${I18NPREFIX}.failure`)}: ${apiError.response}`
      : T.translate(`${I18NPREFIX}.success`);
    const type = hasError ? 'error' : 'success';
    return (
      <Alert
        message={message}
        type={type}
        showAlert={showAlert}
        onClose={() => reset(dispatch, hasError)}
      />
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <BackButton to="/administration/tethering">
          {`<< ${T.translate(`${I18NPREFIX}.backButton`)}`}
        </BackButton>
        <Divider> | </Divider>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.headerTitle`)}</HeaderTitle>
      </HeaderContainer>
      <StyledBodyContainer>
        <OmniNamespaces
          name={namespace}
          cpuLimit={cpuLimit}
          memoryLimit={memoryLimit}
          broadcastChange={handleChange}
        />
        <CdfInfo
          projectName={projectName}
          region={region}
          instanceName={instanceName}
          broadcastChange={handleChange}
          validationErrors={validationErrors}
        />
        <ButtonsContainer>
          <StyledButton onClick={handleSend}>
            {T.translate(`${I18NPREFIX}.sendButton`)}
          </StyledButton>
          <StyledButton onClick={handleCancel}>
            {T.translate(`${I18NPREFIX}.cancelButton`)}
          </StyledButton>
        </ButtonsContainer>
      </StyledBodyContainer>
      {showAlert && renderAlert()}
    </Container>
  );
};

export default NewTetheringRequest;
