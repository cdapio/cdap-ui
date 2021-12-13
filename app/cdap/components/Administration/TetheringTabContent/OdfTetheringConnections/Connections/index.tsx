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

import React, { useState } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import ConnectionsTable from './ConnectionsTable';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../../shared.styles';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.Connections`;

const ConnectionsHeader = styled(HeaderContainer)`
  background-color: ${(props) => props.theme.palette.grey[700]};
`;

const Connections = (): JSX.Element => {
  const [Connections, setConnections] = useState([]);

  return (
    <>
      <ConnectionsHeader>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.connectionsHeader`)}</HeaderTitle>
      </ConnectionsHeader>
      <BodyContainer>
        {Connections.length > 0 ? (
          <ConnectionsTable />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noConnections`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default Connections;
