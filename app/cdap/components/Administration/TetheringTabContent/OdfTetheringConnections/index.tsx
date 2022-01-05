/*
 * Copyright © 2021 Cask Data, Inc.
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
import styled from 'styled-components';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import PendingRequests from './PendingRequests';
import Connections from './Connections';
import { TetheringApi } from 'api/tethering';
import { IConnection } from './types';

const PREFIX = 'features.Administration.Tethering';
const PENDING_STATUS = 'PENDING';

const NewRequestBtn = styled(Button)`
  margin: 0 0 20px 30px;
  background-color: ${(props) => props.theme.palette.white[50]};
  color: ${(props) => props.theme.palette.primary.main};
  height: 30px;
  width: 190px;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.white[50]};
  }
`;

const OdfTetheringConnections = (): JSX.Element => {
  const handleCreateButtonClick = () => {
    // TODO: navigate to create request page
  };

  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchConnectionsList = async () => {
    try {
      const list = await TetheringApi.getTetheringStatusForAll().toPromise();
      const establishedConnections = [];
      const pendingConnections = [];

      list.map((conn: IConnection) =>
        conn.tetheringStatus === PENDING_STATUS
          ? pendingConnections.push(conn)
          : establishedConnections.push(conn)
      );

      setConnections(establishedConnections);
      setPendingRequests(pendingConnections);
    } catch (e) {
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
      <NewRequestBtn variant="contained" onClick={handleCreateButtonClick}>
        {T.translate(`${PREFIX}.createRequest`)}
      </NewRequestBtn>
      <Connections connections={connections} />
    </>
  );
};

export default OdfTetheringConnections;
