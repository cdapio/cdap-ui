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
import { HeaderContainer, HeaderTitle, BodyContainer, NoDataText } from '../shared.styles';

const PREFIX = 'features.Administration.Tethering';
const I18NPREFIX = `${PREFIX}.NewRequests`;

const NewRequestsHeader = styled(HeaderContainer)`
  background-color: ${(props) => props.theme.palette.grey[700]};
`;

const NewRequests = (): JSX.Element => {
  const [NewRequests, setNewRequests] = useState([]);

  return (
    <>
      <NewRequestsHeader>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.newRequestsHeader`)}</HeaderTitle>
      </NewRequestsHeader>
      <BodyContainer>
        {NewRequests.length > 0 ? (
          <span>NewRequests Table goes here</span>
        ) : (
          <NoDataText>{T.translate(`${I18NPREFIX}.noNewRequests`)}</NoDataText>
        )}
      </BodyContainer>
    </>
  );
};

export default NewRequests;
