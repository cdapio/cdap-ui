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

import React, { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import PendingRequests from './PendingRequests';
import Connections from './Connections';
import { TetheringApi } from 'api/tethering';
import { IConnection } from './types';
import { StyledLinkBtn } from '../shared.styles';
import Alert from 'components/shared/Alert';

const PREFIX = 'features.Administration.Tethering';
const PENDING_STATUS = 'PENDING';

const ButtonContainer = styled.div`
  margin: 5px 0 25px 30px;
`;

interface IConnectionsState {
  pendingRequests: IConnection[];
  establishedConnections: IConnection[];
}

const initialConnectionsState = {
  pendingRequests: [],
  establishedConnections: [],
};

const reducer = (state: IConnectionsState, action) => {
  switch (action.type) {
    case 'SET_CONNECTIONS':
      return {
        ...state,
        establishedConnections: action.payload.establishedConnections,
        pendingRequests: action.payload.pendingRequests,
      };
    case 'DELETE_ESTABLISHED_CONNECTION':
      return {
        ...state,
        establishedConnections: state.establishedConnections.filter(
          (conn) => conn.name !== action.peer
        ),
      };
    case 'DELETE_PENDING_REQUEST':
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter((req) => req.name !== action.peer),
      };
    case 'RESET':
      return initialConnectionsState;
    default:
      return state;
  }
};

const OdfTetheringConnections = (): JSX.Element => {
  const [connections, dispatch] = useReducer(reducer, initialConnectionsState);
  const [error, setError] = useState(null);

  const fetchConnectionsList = async () => {
    try {
      const list = await TetheringApi.getTetheringStatusForAll().toPromise();
      const establishedConnections = [];
      const pendingRequests = [];

      list.forEach((conn: IConnection) =>
        conn.tetheringStatus === PENDING_STATUS
          ? pendingRequests.push(conn)
          : establishedConnections.push(conn)
      );
      dispatch({ type: 'SET_CONNECTIONS', payload: { establishedConnections, pendingRequests } });
    } catch (err) {
      setError(`Unable to fetch connections data: ${err.response}`);
      dispatch({ type: 'RESET' });
    }
  };

  const handleEdit = (reqType: string, peer: string) => {
    // TODO: Complete this function when edit functionality is added
  };

  const handleDelete = async (reqType: string, peer: string) => {
    try {
      await TetheringApi.deleteTethering({ peer }).toPromise();
      if (reqType === PENDING_STATUS) {
        dispatch({ type: 'DELETE_PENDING_REQUEST', peer });
      } else {
        dispatch({ type: 'DELETE_ESTABLISHED_CONNECTION', peer });
      }
    } catch (err) {
      setError(`Unable to delete request/connection: ${err.response}`);
    }
  };

  useEffect(() => {
    fetchConnectionsList();
  }, []);

  return (
    <>
      <PendingRequests
        pendingRequests={connections.pendingRequests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <ButtonContainer>
        <StyledLinkBtn to="/administration/tethering/newTetheringRequest">
          {T.translate(`${PREFIX}.CreateRequest.createRequestButton`)}
        </StyledLinkBtn>
      </ButtonContainer>
      <Connections
        connections={connections.establishedConnections}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {error && (
        <Alert
          message={error}
          type={'error'}
          showAlert={Boolean(error)}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
};

export default OdfTetheringConnections;
