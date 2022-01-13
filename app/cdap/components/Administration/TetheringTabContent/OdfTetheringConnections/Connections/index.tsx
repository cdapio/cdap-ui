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
import T from 'i18n-react';
import ConnectionsTable from './ConnectionsTable';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../../shared.styles';
import { IConnection } from '../../types';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.Connections`;

interface IConnectionsProps {
  connections: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

const Connections = ({ connections }: IConnectionsProps) => {
  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.connectionsHeader`)}</HeaderTitle>
      </HeaderContainer>
      <BodyContainer>
        {connections.length > 0 ? (
          <ConnectionsTable tableData={connections} />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noConnections`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default Connections;
