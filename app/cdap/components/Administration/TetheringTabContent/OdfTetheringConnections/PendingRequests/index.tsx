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
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import T from 'i18n-react';
import PendingRequestsTable from './PendingRequestsTable';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../../shared.styles';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.PendingRequests`;

const PendingRequestsHeader = styled(HeaderContainer)`
  background-color: ${(props) => props.theme.palette.grey[700]};
`;

const PendingRequestHistory = styled(Link)`
  margin-left: 40px;
  font-size: 1rem;
`;

const PendingRequests = (): JSX.Element => {
  const [pendingRequests, setPendingRequests] = useState([]);

  return (
    <>
      <PendingRequestsHeader>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.pendingRequestHeader`)}</HeaderTitle>
        <PendingRequestHistory to="/administration/tethering/newRequest">
          {T.translate(`${I18NPREFIX}.pendingRequestHistory`)}
        </PendingRequestHistory>
      </PendingRequestsHeader>
      <BodyContainer>
        {pendingRequests.length > 0 ? (
          <PendingRequestsTable />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noPendingRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default PendingRequests;
