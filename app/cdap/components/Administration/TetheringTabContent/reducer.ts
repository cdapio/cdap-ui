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

import { Dispatch } from 'react';
import { IAction } from 'services/redux-helpers';
import { TetheringApi } from 'api/tethering';
import { IConnection } from './types';

const CONNECTION_GROUPS = {
  PENDING: 'pendingRequests',
  REJECTED: 'rejectedRequests',
  ACCEPTED: 'establishedConnections',
};

export interface IConnectionsState {
  pendingRequests: IConnection[];
  establishedConnections: IConnection[];
  rejectedRequests: IConnection[];
}

export const initialConnectionsState = {
  pendingRequests: [],
  rejectedRequests: [],
  establishedConnections: [],
};

enum IConnectionsActions {
  SET_CONNECTIONS,
  DELETE_CONNECTION,
  RESET,
}

export const reducer = (state: IConnectionsState, action: IAction<IConnectionsActions>) => {
  switch (action.type) {
    case IConnectionsActions.SET_CONNECTIONS:
      return {
        ...state,
        establishedConnections: action.payload.establishedConnections,
        pendingRequests: action.payload.pendingRequests,
        rejectedRequests: action.payload.rejectedRequests,
      };
    case IConnectionsActions.DELETE_CONNECTION:
      return {
        ...state,
        [action.payload.connGroup]: state[action.payload.connGroup].filter(
          (conn) => conn.name !== action.payload.peer
        ),
      };
    case IConnectionsActions.RESET:
      return initialConnectionsState;
    default:
      return state;
  }
};

export const reset = (dispatch) => {
  dispatch({
    type: IConnectionsActions.RESET,
  });
};

export const fetchConnections = async (dispatch: Dispatch<IAction<IConnectionsActions>>) => {
  const list = await TetheringApi.getTetheringStatusForAll().toPromise();
  const connections = {
    establishedConnections: [],
    pendingRequests: [],
    rejectedRequests: [],
  };

  list.forEach((conn: IConnection) =>
    connections[CONNECTION_GROUPS[conn.tetheringStatus]].push(conn)
  );
  const { establishedConnections, pendingRequests, rejectedRequests } = connections;

  dispatch({
    type: IConnectionsActions.SET_CONNECTIONS,
    payload: { establishedConnections, pendingRequests, rejectedRequests },
  });
};

export const acceptOrRejectTetheringConnectionReq = async (
  dispatch: Dispatch<IAction<IConnectionsActions>>,
  { action, peer }
) => {
  await TetheringApi.acceptOrRejectTethering({ peer }, { action }).toPromise();
  await fetchConnections(dispatch);
};

export const deleteTetheringConnection = async (
  dispatch: Dispatch<IAction<IConnectionsActions>>,
  { connType = null, peer }
) => {
  await TetheringApi.deleteTethering({ peer }).toPromise();
  const connGroup = CONNECTION_GROUPS[connType];
  dispatch({ type: IConnectionsActions.DELETE_CONNECTION, payload: { connGroup, peer } });
};
