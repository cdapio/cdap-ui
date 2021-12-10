/*
 * Copyright © 2018 Cask Data, Inc.
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
import styled from 'styled-components';
import T from 'i18n-react';
import Button from '@material-ui/core/Button';
import PendingRequests from './PendingRequests';
import Connections from './Connections';

const PREFIX = 'features.Administration.Tethering';

const OdfTetheringContainer = styled.div``;

const NewRequestBtn = styled(Button)`
  margin: 0 0 20px 30px;
  background-color: ${(props) => props.theme.palette.white[50]};
  color: ${(props) => props.theme.palette.primary.main};
  height: 30px;
  width: 190px;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.white[50]};
  }
`;

const OdfTetheringConnections = (): JSX.Element => {
  const handleCreateButtonClick = () => {
    // TODO: navigate to create request page
  };

  return (
    <OdfTetheringContainer>
      <PendingRequests />
      <NewRequestBtn variant="contained" onClick={handleCreateButtonClick}>
        {T.translate(`${PREFIX}.createRequest`)}
      </NewRequestBtn>
      <Connections />
    </OdfTetheringContainer>
  );
};

export default OdfTetheringConnections;
