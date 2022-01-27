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
import RequestsTable from '../RequestsTable';
import T from 'i18n-react';
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../shared.styles';
import NewReqLastColumn from './NewReqLastColumn';
import { IConnection } from '../types';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.NewRequests`;
const COLUMN_TEMPLATE = '1.5fr 1.5fr 2fr 1fr 2fr 1fr 1fr 1.5fr';

interface INewRequestsProps {
  newRequests: IConnection[];
  handleAcceptOrReject: (action: string, peer: string) => void;
}

const NewRequests = ({ newRequests, handleAcceptOrReject }: INewRequestsProps) => {
  const renderLastColumn = (instanceName: string) => (
    <NewReqLastColumn instanceName={instanceName} handleAcceptOrReject={handleAcceptOrReject} />
  );

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.newRequestsHeader`)}</HeaderTitle>
      </HeaderContainer>
      <BodyContainer>
        {newRequests.length > 0 ? (
          <RequestsTable
            tableData={newRequests}
            columnTemplate={COLUMN_TEMPLATE}
            renderLastColumn={renderLastColumn}
          />
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noNewRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default NewRequests;
