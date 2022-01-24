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
} from './reducer';
import T from 'i18n-react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Theme } from 'services/ThemeHelper';
import OdfTetheringConnections from './OdfTetheringConnections';
import CdfTetheringConnections from './CdfTetheringConnections';
import Alert from 'components/shared/Alert';

const PREFIX = 'features.Administration';
const I18NPREFIX = `${PREFIX}.Tethering`;

const AdminTetheringTabContainer = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 10px;
  margin-bottom: 10px;
`;

const AdminTetheringTabContent = () => {
  const [connections, dispatch] = useReducer(reducer, initialConnectionsState);
  const [error, setError] = useState(null);
  const { establishedConnections, pendingRequests } = connections;

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

  useEffect(() => {
    fetchConnectionsList();
  }, []);

  return (
    <>
      <Helmet
        title={T.translate(`${I18NPREFIX}.pageTitle`, {
          productName: Theme.productName,
        })}
      />
      <AdminTetheringTabContainer>
        {Theme.odf ? (
          <OdfTetheringConnections
            establishedConnections={establishedConnections}
            pendingRequests={pendingRequests}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <CdfTetheringConnections
            establishedConnections={establishedConnections}
            newRequests={pendingRequests}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
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
  );
};

export default AdminTetheringTabContent;
