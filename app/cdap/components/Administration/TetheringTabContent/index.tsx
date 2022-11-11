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
import {
  reducer,
  initialConnectionsState,
  reset,
  fetchConnections,
  deleteTetheringConnection,
  acceptOrRejectTetheringConnectionReq,
} from './reducer';
import T from 'i18n-react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Theme } from 'services/ThemeHelper';
import OnpremTetheringConnections from './OnPremTetheringConnections';
import CdfTetheringConnections from './CdfTetheringConnections';
import Alert from 'components/shared/Alert';

const PREFIX = 'features.Administration';
const I18NPREFIX = `${PREFIX}.Tethering`;

const AdminTetheringTabContainer = styled.div`
  margin-left: calc(-50vw + 50%);
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: -20px;
`;

const AdminTetheringTabContent = () => {
  const [connections, dispatch] = useReducer(reducer, initialConnectionsState);
  const [error, setError] = useState(null);
  const { establishedConnections, pendingRequests, rejectedRequests } = connections;

  const fetchConnectionsList = async () => {
    try {
      await fetchConnections(dispatch);
    } catch (err) {
      setError(`Unable to fetch connections data: ${err.response}`);
      reset(dispatch);
    }
  };

  const handleEdit = (connType: string, peer: string) => {
    // TODO: Complete this function when edit functionality is added
  };

  const handleDelete = async (connType: string, peer: string) => {
    try {
      await deleteTetheringConnection(dispatch, { connType, peer });
    } catch (err) {
      setError(`Unable to delete connection: ${err.response}`);
    }
  };

  const handleAcceptOrReject = async (action: string, peer: string) => {
    try {
      await acceptOrRejectTetheringConnectionReq(dispatch, { action, peer });
    } catch (err) {
      setError(`Unable to ${action} connection: ${err.response}`);
    }
  };

  useEffect(() => {
    fetchConnectionsList();
  }, []);

  return (
    Theme.tethering && (
      <>
        <Helmet
          title={T.translate(`${I18NPREFIX}.pageTitle`, {
            productName: Theme.productName,
          })}
        />
        <AdminTetheringTabContainer>
          {Theme.onPremTetheredInstance ? (
            <OnpremTetheringConnections
              establishedConnections={establishedConnections}
              tetheringRequests={[...pendingRequests, ...rejectedRequests]}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <CdfTetheringConnections
              establishedConnections={establishedConnections}
              newRequests={pendingRequests}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleAcceptOrReject={handleAcceptOrReject}
            />
          )}
          {error && (
            <Alert
              message={error}
              type={'error'}
              showAlert={Boolean(error)}
              onClose={() => setError(null)}
            />
          )}
        </AdminTetheringTabContainer>
      </>
    )
  );
};

export default AdminTetheringTabContent;
