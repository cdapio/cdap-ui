/*
 * Copyright © 2023 Cask Data, Inc.
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

import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreateIcon from '@material-ui/icons/Create';
import AbstractWizard from 'components/AbstractWizard';
import T from 'i18n-react';

const PREFIX = 'features.NamespaceAdmin.toppanel';

const StyledToppanel = styled.div`
  display: flex;
  border-bottom: 1px solid #e4e4e4;
  div {
    margin-left: 16.19px;
    margin-top: 12.5px;
    margin-bottom: 11.5px;
    width: 148px;
    font-size: 18px;
    border-right: 1px solid #e4e4e4;
  }
  span {
    padding-top: 2px;
    padding-left: 2px;
    font-size: 14px;
  }
  button {
    margin-left: 10px;
  }
`;

export const NamespaceAdminToppanel = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const toggleWizard = () => {
    setIsWizardOpen(!isWizardOpen);
  };

  return (
    <>
      <StyledToppanel>
        <div>{T.translate(`${PREFIX}.datafusion`)}</div>
        <div>{T.translate(`${PREFIX}.namespaces`)}</div>

        <PrimaryTextButton
          children={
            <>
              <CreateIcon />
              <span>{T.translate(`${PREFIX}.addNamespaceButton`)}</span>
            </>
          }
          onClick={toggleWizard}
        />
      </StyledToppanel>
      <AbstractWizard isOpen={isWizardOpen} onClose={toggleWizard} wizardType="add_namespace" />
    </>
  );
};
