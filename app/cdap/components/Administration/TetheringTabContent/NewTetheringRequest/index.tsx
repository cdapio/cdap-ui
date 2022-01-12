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

import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import T from 'i18n-react';
import { TetheringApi } from 'api/tethering';
import { IApiError } from '../types';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import Alert from 'components/shared/Alert';
import styled from 'styled-components';
import OmniNamespaces from './OmniNamespaces';
import CdfInfo from './CdfInfo';
import { HeaderContainer, HeaderTitle, BodyContainer, StyledButton } from '../shared.styles';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';

const Container = styled.div`
  width: 100vw;
  margin-top: -20px;
  margin-left: calc(-50vw + 50%);
`;

const BackButton = styled(Link)`
  margin-top: 1px;
  font-size: 1rem;

  &:hover {
    text-decoration: none;
  }
`;

const Divider = styled.span`
  font-size: 1.25rem;
  padding: 0 5px;
`;

const StyledBodyContainer = styled(BodyContainer)`
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
`;

const ButtonsContainer = styled.div`
  margin-left: -30px;
`;

interface IValidationErrors {
  instanceName?: IErrorObj;
  projectName?: IErrorObj;
  region?: IErrorObj;
}

const NewTetheringRequest = () => {
  const [namespace, setNamespace] = useState('');
  const [cpuLimit, setCpuLimit] = useState('');
  const [memoryLimit, setMemoryLimit] = useState('');
  const [projectName, setProjectName] = useState('');
  const [region, setRegion] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [apiErr, setApiErr] = useState({} as IApiError);
  const [validationErrors, setValidationErrors] = useState({} as IValidationErrors);
  const history = useHistory();

  const stateUpdater = {
    name: setNamespace,
    cpuLimit: setCpuLimit,
    memoryLimit: setMemoryLimit,
    projectName: setProjectName,
    region: setRegion,
    instanceName: setInstanceName,
  };

  const resetValues = () => {
    setNamespace('');
    setCpuLimit('');
    setMemoryLimit('');
    setProjectName('');
    setRegion('');
    setInstanceName('');
    setShowAlert(false);
    setApiErr({} as IApiError);
  };

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

    setValidationErrors((prevValidationErrors) => ({
      ...prevValidationErrors,
      ...errors,
    }));

    return allValid;
  };

  const handleChange = (target: string, updatedVal: string | number) => {
    stateUpdater[target](updatedVal);
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
        await TetheringApi.createTethering({}, connectionInfo).toPromise();
      } catch (err) {
        setApiErr(err);
      }
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    history.push('/administration/tethering');
  };

  const handleCloseAlert = () => {
    resetValues();
  };

  const renderAlert = () => {
    const hasError = Boolean(Object.keys(apiErr).length);
    const message = hasError
      ? `${T.translate(`${I18NPREFIX}.failure`)}: ${apiErr.response}`
      : T.translate(`${I18NPREFIX}.success`);
    const type = hasError ? 'error' : 'success';
    return <Alert message={message} type={type} showAlert={showAlert} onClose={handleCloseAlert} />;
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
