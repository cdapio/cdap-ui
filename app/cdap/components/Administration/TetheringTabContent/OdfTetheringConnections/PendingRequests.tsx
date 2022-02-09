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
import RequestsTable from '../RequestsTable';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../shared.styles';
import { IConnection } from '../types';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.PendingRequests`;
const COLUMN_TEMPLATE = '1.5fr 1.5fr 2fr 1fr 2fr 1fr 1fr 1fr';
const CONNECTION_STATUS = 'PENDING';

const PendingRequestHistory = styled(Link)`
  margin-left: 40px;
  font-size: 1rem;
`;

interface IPendingRequestsProps {
  pendingRequests: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

const PendingRequests = ({ pendingRequests, handleEdit, handleDelete }: IPendingRequestsProps) => {
  const renderLastColumn = (instanceName: string) => (
    <ActionsPopover
      target={() => <IconSVG name="icon-more" />}
      confirmationTitle={T.translate(`${PREFIX}.ConfirmationModal.deleteRequestHeader`)}
      confirmationText={T.translate(`${PREFIX}.ConfirmationModal.deleteRequestCopy`)}
      onDeleteClick={() => handleDelete(CONNECTION_STATUS, instanceName)}
      onEditClick={() => handleEdit(CONNECTION_STATUS, instanceName)}
    />
  );
  const canSeeReqHistory = false; // Will remove after request history page is ready

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.pendingRequestHeader`)}</HeaderTitle>
        {canSeeReqHistory && (
          <PendingRequestHistory to="/administration/tethering/requestHistory">
            {T.translate(`${I18NPREFIX}.pendingRequestHistory`)}
          </PendingRequestHistory>
        )}
      </HeaderContainer>
      <BodyContainer>
        {pendingRequests.length > 0 ? (
          <RequestsTable
            tableData={pendingRequests}
            columnTemplate={COLUMN_TEMPLATE}
            renderLastColumn={renderLastColumn}
          />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noPendingRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default PendingRequests;
