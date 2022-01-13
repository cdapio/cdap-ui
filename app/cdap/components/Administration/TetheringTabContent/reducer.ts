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

const PENDING_STATUS = 'PENDING';

export interface IConnectionsState {
  pendingRequests: IConnection[];
  establishedConnections: IConnection[];
}

export const initialConnectionsState = {
  pendingRequests: [],
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
  const establishedConnections = [];
  const pendingRequests = [];

  list.forEach((conn: IConnection) =>
    conn.tetheringStatus === PENDING_STATUS
      ? pendingRequests.push(conn)
      : establishedConnections.push(conn)
  );

  dispatch({
    type: IConnectionsActions.SET_CONNECTIONS,
    payload: { establishedConnections, pendingRequests },
  });
};

export const deleteTetheringConnection = async (
  dispatch: Dispatch<IAction<IConnectionsActions>>,
  { connType, peer }
) => {
  await TetheringApi.deleteTethering({ peer }).toPromise();
  const connGroup = connType === PENDING_STATUS ? 'pendingRequests' : 'establishedConnections';
  dispatch({ type: IConnectionsActions.DELETE_CONNECTION, payload: { connGroup, peer } });
};
