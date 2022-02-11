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

import React, { useState } from 'react';
import TetheringTable from '../TetheringTable';
import T from 'i18n-react';
import styled from 'styled-components';
import {
  HeaderContainer,
  HeaderTitle,
  BodyContainer,
  NoDataText,
  StyledAlert,
} from '../shared.styles';
import NewReqLastColumn from './NewReqLastColumn';
import { IConnection } from '../types';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.NewRequests`;
const ACCEPT_ACTION = 'accept';

const CustomAlert = styled(StyledAlert)`
  width: 100%;
  margin-top: 10px;
  margin-bottom: -20px;
`;

interface INewRequestsProps {
  newRequests: IConnection[];
  handleAcceptOrReject: (action: string, peer: string) => void;
}

const NewRequests = ({ newRequests, handleAcceptOrReject }: INewRequestsProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const renderLastColumn = (instanceName: string) => (
    <NewReqLastColumn
      instanceName={instanceName}
      handleAcceptOrReject={handleChangeRequestStatus}
    />
  );

  const handleChangeRequestStatus = (action: string, peer: string) => {
    if (action === ACCEPT_ACTION) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    handleAcceptOrReject(action, peer);
  };

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.newRequestsHeader`)}</HeaderTitle>
      </HeaderContainer>
      <BodyContainer>
        {showAlert && (
          <CustomAlert severity="success">
            {T.translate(`${PREFIX}.PendingRequests.acceptSuccess`)}
          </CustomAlert>
        )}
        {newRequests.length > 0 ? (
          <TetheringTable tableData={newRequests} renderLastColumn={renderLastColumn} />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noNewRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default NewRequests;
