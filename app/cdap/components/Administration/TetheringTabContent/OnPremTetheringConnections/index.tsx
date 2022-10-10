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
import styled from 'styled-components';
import T from 'i18n-react';
import TetheringRequests from './TetheringRequests';
import Connections from '../Connections';
import { IOnPremConnectionsProps } from '../types';
import { StyledLinkBtn } from '../shared.styles';

const PREFIX = 'features.Administration.Tethering';

const ButtonContainer = styled.div`
  margin: 5px 0 25px 30px;
`;

const OnPremConnections = ({
  tetheringRequests,
  establishedConnections,
  handleEdit,
  handleDelete,
}: IOnPremConnectionsProps) => {
  return (
    <>
      <TetheringRequests
        tetheringRequests={tetheringRequests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <ButtonContainer>
        <StyledLinkBtn
          data-testid="create-tethering-req-btn"
          to="/administration/tethering/newTetheringRequest"
        >
          {T.translate(`${PREFIX}.CreateRequest.createRequestButton`)}
        </StyledLinkBtn>
      </ButtonContainer>
      <Connections
        connections={establishedConnections}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default OnPremConnections;
