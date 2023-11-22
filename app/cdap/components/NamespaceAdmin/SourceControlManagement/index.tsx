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

import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import React, { useState } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import { useSelector } from 'react-redux';
import ActionsPopover from 'components/shared/ActionsPopover';
import { UnlinkSourceControlModal } from './UnlinkSourceControlModal';
import StyledPasswordWrapper from 'components/AbstractWidget/FormInputs/Password';
import { ISourceControlManagementConfig } from './types';
import SourceControlManagementForm from './SourceControlManagementForm';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getSourceControlManagement } from '../store/ActionCreator';
import Alert from 'components/shared/Alert';
import ButtonLoadingHoc from 'components/shared/Buttons/ButtonLoadingHoc';

const PrimaryTextLoadingButton = ButtonLoadingHoc(PrimaryTextButton);

const PREFIX = 'features.SourceControlManagement';

const StyledInfo = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #bdbdbd;
  margin-bottom: 15px;
`;

export const SourceControlManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const sourceControlManagementConfig: ISourceControlManagementConfig = useSelector(
    (state) => state.sourceControlManagementConfig
  );
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const openCreateForm = () => {
    setIsEditingConfig(false);
    setIsFormOpen(true);
  };

  const openEditForm = () => {
    setIsEditingConfig(true);
    setIsFormOpen(true);
  };

  const toggleUnlinkModal = () => {
    setIsUnlinkModalOpen(!isUnlinkModalOpen);
  };

  const actions = [
    {
      label: T.translate('commons.edit'),
      actionFn: () => openEditForm(),
    },
    {
      label: T.translate('commons.delete'),
      actionFn: () => toggleUnlinkModal(),
    },
  ];

  const validateConfigAndRedirect = () => {
    setLoading(true);
    const namespace = getCurrentNamespace();
    getSourceControlManagement(namespace).subscribe(
      () => {
        window.location.href = `/ns/${namespace}/scm/sync`;
      },
      (err) => {
        setErrorMessage(err.message);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Alert
        showAlert={errorMessage !== null}
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage(null)}
      />
      <StyledInfo>{T.translate(`${PREFIX}.info`)}</StyledInfo>
      {!sourceControlManagementConfig && (
        <PrimaryContainedButton
          onClick={openCreateForm}
          style={{ marginBottom: '15px' }}
          data-testid="link-repository-button"
        >
          {T.translate(`${PREFIX}.linkButton`)}
        </PrimaryContainedButton>
      )}
      {sourceControlManagementConfig && (
        <Table columnTemplate="100px 2fr 1fr 1fr 2fr 120px 100px">
          <TableHeader>
            <TableRow>
              <TableCell>{T.translate(`${PREFIX}.configModal.provider.label`)}</TableCell>
              <TableCell>{T.translate(`${PREFIX}.configModal.repoUrl.label`)}</TableCell>
              <TableCell>{T.translate(`${PREFIX}.configModal.auth.label`)}</TableCell>
              <TableCell>{T.translate(`${PREFIX}.configModal.branch.label`)}</TableCell>
              <TableCell>{T.translate(`${PREFIX}.configModal.pathPrefix.label`)}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              key={`${sourceControlManagementConfig.provider}-${sourceControlManagementConfig.link}`}
            >
              <TableCell data-testid="repository-provider">
                {sourceControlManagementConfig.provider}
              </TableCell>
              <TableCell data-testid="repository-link">
                <a href={sourceControlManagementConfig.link} target="_blank">
                  {sourceControlManagementConfig.link}
                </a>
              </TableCell>
              <TableCell data-testid="repository-auth-type">
                {sourceControlManagementConfig.auth.type}
              </TableCell>
              <TableCell>
                {sourceControlManagementConfig.defaultBranch
                  ? sourceControlManagementConfig.defaultBranch
                  : '--'}
              </TableCell>
              <TableCell>
                {sourceControlManagementConfig.pathPrefix
                  ? sourceControlManagementConfig.pathPrefix
                  : '--'}
              </TableCell>
              <TableCell>
                <PrimaryTextLoadingButton onClick={validateConfigAndRedirect} loading={loading}>
                  {T.translate(`${PREFIX}.syncButton`)}
                </PrimaryTextLoadingButton>
              </TableCell>
              <TableCell>
                <ActionsPopover actions={actions} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      {isFormOpen && (
        <SourceControlManagementForm
          onToggle={toggleForm}
          initialSourceControlManagementConfig={sourceControlManagementConfig}
          isEdit={isEditingConfig}
        />
      )}
      <UnlinkSourceControlModal
        isOpen={isUnlinkModalOpen}
        toggleModal={toggleUnlinkModal}
        sourceControlManagementConfig={sourceControlManagementConfig}
      />
    </>
  );
};
