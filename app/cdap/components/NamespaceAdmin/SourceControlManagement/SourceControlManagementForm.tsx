/*
 * Copyright © 2023 Cask Data, Inc.
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

import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import { ISourceControlManagementConfig } from './types';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import PrimaryOutlinedButton from 'components/shared/Buttons/PrimaryOutlinedButton';
import ButtonLoadingHoc from 'components/shared/Buttons/ButtonLoadingHoc';
import { authKeys, providers, scmAuthType } from './constants';
import { defaultSourceControlManagement, sourceControlManagementFormReducer } from './reducer';
import { addOrValidateSourceControlManagementForm } from '../store/ActionCreator';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { EntityTopPanel } from 'components/EntityTopPanel';
import Alert from 'components/shared/Alert';
import PropertyRow from './PropertyRow';

const PREFIX = 'features.SourceControlManagement.configModal';

const PrimaryOutlinedLoadingButton = ButtonLoadingHoc(PrimaryOutlinedButton);

const ModalRoot = styled.div`
  position: absolute;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1061;
  text-align: left;
  background-color: white;
  overflow: auto;
`;

const BoldHeader = styled.h2`
  font-size: 1.4rem !important;
  font-weight: bold;
  margin-bottom: 2px;
  margin-top: 5px;
`;

const StyledForm = styled.div`
  margin: 30px 50px;
  border: 1px solid #dbdbdb;
`;

const StyledButtonGroup = styled.div`
  margin: 30px 50px;
  button {
    margin-right: 10px;
  }
`;

const StyledGroup = styled.div`
  margin: 30px;
  max-width: 800px;
`;

const StyledHr = styled.hr`
  margin-top: 0;
  margin-bottom: 20px;
  margin-left: 0;
`;

interface ISourceControlManagementFormProps {
  initialSourceControlManagementConfig?: ISourceControlManagementConfig | null;
  onToggle: () => void;
}

const SourceControlManagementForm = ({
  initialSourceControlManagementConfig,
  onToggle,
}: ISourceControlManagementFormProps) => {
  const [formState, formStateDispatch] = useReducer(
    sourceControlManagementFormReducer,
    defaultSourceControlManagement
  );

  const getMissingFieldsCount = () => {
    let count = 0;
    if (!formState.config?.link) {
      count++;
    }
    if (!formState.config?.auth.token) {
      count++;
    }
    if (!formState.config?.auth.tokenName) {
      count++;
    }
    return count;
  };

  useEffect(() => {
    // since the initialSourceControlManagementConfig can be null
    // we want to reset the form to get the correct default value if null
    formStateDispatch({
      type: 'INIT',
      payload: {
        config: initialSourceControlManagementConfig,
      },
    });
  }, []);

  const handleValueChange = (value, key) => {
    const payload = {
      key,
      value,
    };
    // for auth object
    if (authKeys.includes(key)) {
      const newAuth = { ...formState.config.auth };
      newAuth[key] = value;
      payload.key = 'auth';
      payload.value = newAuth;
    }
    formStateDispatch({
      type: 'SET_VALUE',
      payload,
    });
  };

  const validateForm = () => {
    const missingFieldsCount = getMissingFieldsCount();
    if (missingFieldsCount > 0) {
      formStateDispatch({
        type: 'SET_ERROR',
        payload: {
          error: T.translate(`${PREFIX}.validate.errorMessage`, {
            context: missingFieldsCount,
          }).toString(),
        },
      });
    }
    return missingFieldsCount === 0;
  };

  const validateConnection = () => {
    formStateDispatch({
      type: 'SET_LOADING',
    });
    if (!validateForm()) {
      return;
    }
    addOrValidateSourceControlManagementForm(
      getCurrentNamespace(),
      formState.config,
      true
    ).subscribe(
      () => {
        formStateDispatch({
          type: 'SET_SUCCESS',
        });
      },
      (err) => {
        formStateDispatch({
          type: 'SET_ERROR',
          payload: {
            error: err.message,
          },
        });
      }
    );
  };

  const onSubmit = () => {
    addOrValidateSourceControlManagementForm(getCurrentNamespace(), formState.config).subscribe(
      () => {
        onToggle();
      },
      (err) => {
        formStateDispatch({
          type: 'SET_ERROR',
          payload: {
            error: err.message,
          },
        });
      }
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onSubmit();
  };

  return (
    <ModalRoot>
      <EntityTopPanel
        title={T.translate(`${PREFIX}.title`).toString()}
        closeBtnAnchorLink={onToggle}
        breadCrumbAnchorLabel={T.translate('commons.namespaceAdmin').toString()}
        onBreadCrumbClick={onToggle}
      />
      <StyledForm>
        <StyledGroup>
          <BoldHeader>{T.translate(`${PREFIX}.basicHeader`)}</BoldHeader>
          <StyledHr />
          <PropertyRow
            value={formState.config?.provider ? formState.config?.provider : providers.github}
            property={{
              name: 'provider',
              description: T.translate(`${PREFIX}.provider.helperText`).toString(),
              label: T.translate(`${PREFIX}.provider.label`).toString(),
              'widget-type': 'select',
              'widget-attributes': {
                default: providers.github,
                values: Object.values(providers),
              },
            }}
            onChange={(val) => {
              handleValueChange(val, 'provider');
            }}
          />
          <PropertyRow
            value={formState.config?.link}
            property={{
              name: 'repoUrl',
              description: T.translate(`${PREFIX}.repoUrl.helperText`).toString(),
              label: T.translate(`${PREFIX}.repoUrl.label`).toString(),
              required: true,
            }}
            onChange={(val) => {
              handleValueChange(val, 'link');
            }}
            errors={
              !formState.config?.link && formState.error
                ? [{ msg: T.translate('commons.requiredFieldMissingMsg').toString() }]
                : []
            }
          />
          <PropertyRow
            value={formState.config?.defaultBranch}
            property={{
              name: 'defaultBranch',
              description: T.translate(`${PREFIX}.branch.helperText`).toString(),
              label: T.translate(`${PREFIX}.branch.label`).toString(),
            }}
            onChange={(val) => {
              handleValueChange(val, 'defaultBranch');
            }}
          />
          <PropertyRow
            value={formState.config?.pathPrefix}
            property={{
              name: 'pathPrefix',
              description: T.translate(`${PREFIX}.pathPrefix.helperText`).toString(),
              label: T.translate(`${PREFIX}.pathPrefix.label`).toString(),
            }}
            onChange={(val) => {
              handleValueChange(val, 'pathPrefix');
            }}
          />
        </StyledGroup>
        <StyledGroup>
          <BoldHeader>{T.translate(`${PREFIX}.authHeader`)}</BoldHeader>
          <StyledHr />
          <PropertyRow
            value={formState.config?.auth?.type ? formState.config.auth.type : scmAuthType[0].id}
            property={{
              name: 'auth',
              description: T.translate(`${PREFIX}.auth.helperText`).toString(),
              label: T.translate(`${PREFIX}.auth.label`).toString(),
              'widget-type': 'radio-group',
              'widget-attributes': {
                default: scmAuthType[0].id,
                layout: 'inline',
                options: scmAuthType,
              },
            }}
            onChange={(val) => {
              handleValueChange(val, 'type');
            }}
          />
          {formState.config?.auth?.type === scmAuthType[0].id && (
            <>
              <PropertyRow
                value={formState.config?.auth?.tokenName}
                property={{
                  name: 'tokenName',
                  description: T.translate(`${PREFIX}.auth.pat.tokenNameHelperText`).toString(),
                  label: T.translate(`${PREFIX}.auth.pat.tokenName`).toString(),
                  required: true,
                }}
                onChange={(val) => {
                  handleValueChange(val, 'tokenName');
                }}
                errors={
                  !formState.config?.auth?.tokenName && formState.error
                    ? [{ msg: T.translate('commons.requiredFieldMissingMsg').toString() }]
                    : []
                }
              />
              <PropertyRow
                value={formState.config?.auth?.token}
                property={{
                  name: 'token',
                  description: T.translate(`${PREFIX}.auth.pat.tokenHelperText`).toString(),
                  label: T.translate(`${PREFIX}.auth.pat.token`).toString(),
                  required: true,
                  'widget-type': 'password',
                }}
                onChange={(val) => {
                  handleValueChange(val, 'token');
                }}
                errors={
                  !formState.config?.auth?.token && formState.error
                    ? [{ msg: T.translate('commons.requiredFieldMissingMsg').toString() }]
                    : []
                }
              />
              <PropertyRow
                value={formState.config?.auth?.username}
                property={{
                  name: 'username',
                  description: T.translate(`${PREFIX}.auth.pat.usernameHelperText`).toString(),
                  label: T.translate(`${PREFIX}.auth.pat.username`).toString(),
                }}
                onChange={(val) => {
                  handleValueChange(val, 'username');
                }}
              />
            </>
          )}
        </StyledGroup>
      </StyledForm>
      <StyledButtonGroup>
        <PrimaryOutlinedLoadingButton
          onClick={validateConnection}
          loading={formState.loading}
          disabled={formState.loading}
          data-testid="validate-repo-config-button"
        >
          {T.translate(`${PREFIX}.validate.button`)}
        </PrimaryOutlinedLoadingButton>
        <PrimaryContainedButton onClick={handleSubmit} data-testid="save-repo-config-button">
          {T.translate(`${PREFIX}.linkConfirm`)}
        </PrimaryContainedButton>
      </StyledButtonGroup>
      {formState.error && (
        <Alert
          message={formState.error}
          type="error"
          showAlert={true}
          onClose={() => {
            formStateDispatch({
              type: 'RESET_VALIDATE',
            });
          }}
        />
      )}
      {formState.success && (
        <Alert
          message={T.translate('commons.connectionSuccess')}
          type="success"
          showAlert={true}
          onClose={() => {
            formStateDispatch({
              type: 'RESET_VALIDATE',
            });
          }}
        />
      )}
    </ModalRoot>
  );
};

export default SourceControlManagementForm;
