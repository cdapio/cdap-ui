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
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { StyledButton } from '../shared.styles';
import T from 'i18n-react';
import styled from 'styled-components';

const PREFIX = 'features.Administration.Tethering';

const ButtonsContainer = styled.div`
  margin-left: -30px;
  box-sizing: border-box;
  height: 30px;
`;

const GridCellButton = styled(StyledButton)`
  font-size: 0.9rem;
  width: 90px;
  height: 18px;
`;

const connectionActions = {
  ACCEPT: 'accept',
  REJECT: 'reject',
};

interface INewReqLastColumnProps {
  instanceName: string;
  handleAcceptOrReject: (action: string, peer: string) => void;
}

const NewReqLastColumn = ({ instanceName, handleAcceptOrReject }: INewReqLastColumnProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModalOpen = () => {
    setModalOpen((prevState) => !prevState);
  };

  const confirmReject = () => {
    toggleModalOpen();
    handleAcceptOrReject(connectionActions.REJECT, instanceName);
  };
  const confirmRejectElem = (
    <div>{T.translate(`${PREFIX}.ConfirmationModal.rejectRequestCopy`)}</div>
  );

  return (
    <>
      <ButtonsContainer>
        <GridCellButton
          onClick={() => handleAcceptOrReject(connectionActions.ACCEPT, instanceName)}
          data-testid="accept-connection"
        >
          {T.translate(`${PREFIX}.TetheringRequests.acceptButton`)}
        </GridCellButton>
        <GridCellButton onClick={toggleModalOpen} data-testid="reject-connection">
          {T.translate(`${PREFIX}.TetheringRequests.rejectButton`)}
        </GridCellButton>
      </ButtonsContainer>
      <ConfirmationModal
        isOpen={modalOpen}
        headerTitle={T.translate(`${PREFIX}.ConfirmationModal.rejectRequestHeader`)}
        confirmationElem={confirmRejectElem}
        confirmButtonText={T.translate(`${PREFIX}.TetheringRequests.rejectButton`)}
        confirmFn={confirmReject}
        cancelFn={toggleModalOpen}
      />
    </>
  );
};

export default NewReqLastColumn;
