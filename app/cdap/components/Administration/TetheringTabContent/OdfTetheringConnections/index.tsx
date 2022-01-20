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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import T from 'i18n-react';
import PendingRequests from './PendingRequests';
import Connections from './Connections';
import { TetheringApi } from 'api/tethering';
import { IConnection } from './types';

const PREFIX = 'features.Administration.Tethering';
const PENDING_STATUS = 'PENDING';

const ButtonContainer = styled.div`
  margin: 5px 0 25px 30px;
`;

const NewRequestBtn = styled(Link)`
  padding: 5px 20px;
  background-color: var(--white);
  color: var(--primary);
  height: 30px;
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: var(--primary);
    color: var(--white);
    text-decoration: none;
  }
`;

const OdfTetheringConnections = (): JSX.Element => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchConnectionsList = async () => {
    try {
      const list = await TetheringApi.getTetheringStatusForAll().toPromise();
      const establishedConnections = [];
      const pendingConnections = [];

      list.forEach((conn: IConnection) =>
        conn.tetheringStatus === PENDING_STATUS
          ? pendingConnections.push(conn)
          : establishedConnections.push(conn)
      );

      setConnections(establishedConnections);
      setPendingRequests(pendingConnections);
    } catch (e) {
      // TODO: Add proper error messaging here
      setConnections([]);
      setPendingRequests([]);
    }
  };

  useEffect(() => {
    fetchConnectionsList();
  }, []);

  return (
    <>
      <PendingRequests pendingRequests={pendingRequests} />
      <ButtonContainer>
        <NewRequestBtn to="/administration/tethering/newTetheringRequest">
          {T.translate(`${PREFIX}.CreateRequest.createRequestButton`)}
        </NewRequestBtn>
      </ButtonContainer>
      <Connections connections={connections} />
    </>
  );
};

export default OdfTetheringConnections;
