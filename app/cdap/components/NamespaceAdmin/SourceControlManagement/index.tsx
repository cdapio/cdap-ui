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
import { INamespaceAdminState } from '../store';

const PREFIX = 'features.SourceControlManagement';

const StyledInfo = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #bdbdbd;
  margin-bottom: 15px;
`;

export const SourceControlManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const sourceControlManagementConfig = useSelector<
    INamespaceAdminState,
    ISourceControlManagementConfig
  >((state) => state.sourceControlManagementConfig);
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  const toggleUnlinkModal = () => {
    setIsUnlinkModalOpen(!isUnlinkModalOpen);
  };

  const actions = [
    {
      label: T.translate('commons.edit'),
      actionFn: () => toggleForm(),
    },
    {
      label: T.translate('commons.delete'),
      actionFn: () => toggleUnlinkModal(),
    },
  ];

  return (
    <>
      <StyledInfo>{T.translate(`${PREFIX}.info`)}</StyledInfo>
      {!sourceControlManagementConfig && (
        <PrimaryContainedButton
          onClick={toggleForm}
          style={{ marginBottom: '15px' }}
        >
          {T.translate(`${PREFIX}.linkButton`)}
        </PrimaryContainedButton>
      )}
      {sourceControlManagementConfig && (
        <Table columnTemplate="100px 2fr 1fr 2fr 1fr 2fr 100px">
          <TableHeader>
            <TableRow>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.provider.label`)}
              </TableCell>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.repoUrl.label`)}
              </TableCell>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.auth.label`)}
              </TableCell>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.auth.pat.token`)}
              </TableCell>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.branch.label`)}
              </TableCell>
              <TableCell>
                {T.translate(`${PREFIX}.configModal.pathPrefix.label`)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              key={`${sourceControlManagementConfig.provider}-${sourceControlManagementConfig.link}`}
            >
              <TableCell>{sourceControlManagementConfig.provider}</TableCell>
              <TableCell>
                <a
                  href={sourceControlManagementConfig.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {sourceControlManagementConfig.link}
                </a>
              </TableCell>
              <TableCell>{sourceControlManagementConfig.auth.type}</TableCell>
              <TableCell>
                <StyledPasswordWrapper
                  value={sourceControlManagementConfig.auth.token}
                />
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
