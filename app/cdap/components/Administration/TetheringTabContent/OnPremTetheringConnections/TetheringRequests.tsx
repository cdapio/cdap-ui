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

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import T from 'i18n-react';
import IconSVG from 'components/shared/IconSVG';
import ActionsPopover from '../ActionPopover';
import TetheringTable from '../TetheringTable';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../shared.styles';
import { IConnection } from '../types';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.TetheringRequests`;

const TetheringRequestHistory = styled(Link)`
  margin-left: 40px;
  font-size: 1rem;
`;

interface ITetheringRequestsProps {
  tetheringRequests: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

const TetheringRequests = ({
  tetheringRequests,
  handleEdit,
  handleDelete,
}: ITetheringRequestsProps) => {
  const renderLastColumn = (instanceName: string, tetheringStatus: string) => (
    <ActionsPopover
      target={() => <IconSVG name="icon-more" dataTestId="tethering-request" />}
      confirmationTitle={T.translate(`${PREFIX}.ConfirmationModal.deleteRequestHeader`)}
      confirmationText={T.translate(`${PREFIX}.ConfirmationModal.deleteRequestCopy`)}
      onDeleteClick={() => handleDelete(tetheringStatus, instanceName)}
      onEditClick={() => handleEdit(tetheringStatus, instanceName)}
      dataTestIds={{ delete: 'delete-tethering-request', edit: 'edit-tethering-request' }}
    />
  );
  const canSeeReqHistory = false; // Will remove after request history page is ready

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.tetheringRequestHeader`)}</HeaderTitle>
        {canSeeReqHistory && (
          <TetheringRequestHistory to="/administration/tethering/requestHistory">
            {T.translate(`${I18NPREFIX}.tetheringRequestHistory`)}
          </TetheringRequestHistory>
        )}
      </HeaderContainer>
      <BodyContainer>
        {tetheringRequests.length > 0 ? (
          <TetheringTable
            tableData={tetheringRequests}
            isForTetheringReqs={true}
            renderLastColumn={renderLastColumn}
          />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noTetheringRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default TetheringRequests;
