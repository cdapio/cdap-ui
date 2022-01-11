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
import { Link } from 'react-router-dom';
import T from 'i18n-react';
import styled from 'styled-components';
import OmniNamespaces from './OmniNamespaces';
import CdfInfo from './CdfInfo';
import { HeaderContainer, HeaderTitle, BodyContainer, StyledButton } from '../shared.styles';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const I18N_CDF_PREFIX = `${I18NPREFIX}.CDFInformation`;

const Container = styled.div`
  width: 100vw;
  margin-top: -20px;
  margin-left: calc(-50vw + 50%);
`;

const BackButton = styled(Link)`
  margin-top: 1px;
  font-size: 1rem;

  &:hover {
    text-decoration: none;
  }
`;

const Divider = styled.span`
  font-size: 1.25rem;
  padding: 0 5px;
`;

const StyledBodyContainer = styled(BodyContainer)`
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-left: -30px;
`;

const NewTetheringRequest = () => {
  return (
    <Container>
      <HeaderContainer>
        <BackButton to="/administration/tethering">
          {`<< ${T.translate(`${I18NPREFIX}.backButton`)}`}
        </BackButton>
        <Divider> | </Divider>
        <HeaderTitle>{T.translate(`${I18NPREFIX}.headerTitle`)}</HeaderTitle>
      </HeaderContainer>
      <StyledBodyContainer>
        <OmniNamespaces />
        <CdfInfo />
        <ButtonsContainer>
          <StyledButton>{T.translate(`${I18NPREFIX}.sendButton`)}</StyledButton>
          <StyledButton>{T.translate(`${I18NPREFIX}.cancelButton`)}</StyledButton>
        </ButtonsContainer>
      </StyledBodyContainer>
    </Container>
  );
};

export default NewTetheringRequest;
