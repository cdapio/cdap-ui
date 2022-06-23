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

import React, { useReducer, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import T from 'i18n-react';
import {
  reducer,
  initialState,
  updateInputField,
  updateError,
  updateAlertState,
  updateSelectedNamespaces,
  reset,
  createTethering,
  fetchNamespaceList,
} from './reducer';
import TetheredNamespaces from './TetheredNamespaces';
import CdfInfo from './CdfInfo';
import { HeaderContainer, HeaderTitle, StyledButton, StyledAlert } from '../shared.styles';
import { Container, BackButton, Divider, StyledBodyContainer, ButtonsContainer } from './styles';
import { areInputsValid } from '../utils';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';

const NewTetheringRequest = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    namespaces,
    selectedNamespaces,
    inputFields,
    showAlert,
    apiError,
    validationErrors,
  } = state;
  const history = useHistory();

  const fetchNamespaces = async () => {
    try {
      await fetchNamespaceList(dispatch);
    } catch (err) {
      updateError(dispatch, { errType: 'apiError', errVal: err });
      reset(dispatch, true);
    }
  };

  useEffect(() => {
    fetchNamespaces();
  }, []);

  const handleInputChange = (target: string, updatedVal: string | number) => {
    updateInputField(dispatch, { [target]: updatedVal });
  };

  const handleNamespaceChange = (ns: string) => {
    updateSelectedNamespaces(dispatch, ns, selectedNamespaces);
  };

  const handleSend = async () => {
    reset(dispatch, true);
    const { errors, allValid: inputsAreValid } = areInputsValid({
      selectedNamespaces,
      inputFields,
    });
    updateError(dispatch, { errType: 'validationErrors', errVal: errors });
    if (inputsAreValid) {
      const { projectName, region, instanceName, instanceUrl, description } = inputFields;
      const connectionInfo = {
        peer: instanceName,
        endpoint: instanceUrl,
        namespaceAllocations: namespaces.filter((ns) => selectedNamespaces.includes(ns.namespace)),
        description,
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
      <StyledAlert data-testid={type} severity={type} onClose={() => reset(dispatch, hasError)}>
        {message}
      </StyledAlert>
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
        <TetheredNamespaces
          namespaces={namespaces}
          selectedNamespaces={selectedNamespaces}
          validationError={validationErrors.namespaces}
          broadcastChange={handleNamespaceChange}
        />
        <CdfInfo
          inputFields={inputFields}
          broadcastChange={handleInputChange}
          validationErrors={validationErrors}
        />
        {showAlert && renderAlert()}
        <ButtonsContainer>
          <StyledButton data-testid="tethering-req-accept-btn" onClick={handleSend}>
            {T.translate(`${I18NPREFIX}.sendButton`)}
          </StyledButton>
          <StyledButton data-testid="tethering-req-reject-btn" onClick={handleCancel}>
            {T.translate(`${I18NPREFIX}.cancelButton`)}
          </StyledButton>
        </ButtonsContainer>
      </StyledBodyContainer>
    </Container>
  );
};

export default NewTetheringRequest;
