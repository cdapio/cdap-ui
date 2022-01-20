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
import { IConnection } from '../types';
import T from 'i18n-react';
import ConnectionsTable from './ConnectionsTable';
import IconSVG from 'components/shared/IconSVG';
import ActionsPopover from '../ActionPopover';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../shared.styles';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.Connections`;
const COLUMN_TEMPLATE = '50px 1.5fr 2fr 1.5fr 2fr 1fr 1fr 1fr 1fr';
const CONNECTION_STATUS = 'ACCEPTED';

interface IConnectionsProps {
  connections: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

const Connections = ({ connections, handleEdit, handleDelete }: IConnectionsProps) => {
  const renderLastColumn = (instanceName: string) => (
    <ActionsPopover
      target={() => <IconSVG name="icon-more" />}
      onDeleteClick={() => handleDelete(CONNECTION_STATUS, instanceName)}
      onEditClick={() => handleEdit(CONNECTION_STATUS, instanceName)}
    />
  );

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.connectionsHeader`)}</HeaderTitle>
      </HeaderContainer>
      <BodyContainer>
        {connections.length > 0 ? (
          <ConnectionsTable
            tableData={connections}
            columnTemplate={COLUMN_TEMPLATE}
            renderLastColumn={renderLastColumn}
          />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noConnections`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default Connections;
