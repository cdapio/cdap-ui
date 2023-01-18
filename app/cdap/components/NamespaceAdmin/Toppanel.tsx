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
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useSelector } from 'react-redux';

const PREFIX = 'features.NamespaceAdmin.toppanel';

const StyledToppanel = styled.div`
  display: flex;
  height: 50px;
  background: #eeeeee;
  span {
    padding-top: 2px;
    padding-left: 2px;
    font-size: 14px;
  }
  button {
    margin-left: 10px;
  }
`;

const StyledTitle = styled.div`
  margin-left: 16.19px;
  padding-top: 12px;
  width: 200px;
  font-size: 18px;
  border-right: 1px solid #e4e4e4;
`;

const StyledSelect = styled(Select)`
  min-width: 150px;
  font-size: 16px;
`;

export const NamespaceAdminToppanel = () => {
  const namespace = useSelector((state) => state.namespace);
  const namespaces = useSelector((state) => state.namespaces);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const toggleWizard = () => {
    setIsWizardOpen(!isWizardOpen);
  };

  const onNamespaceChange = (event) => {
    window.location.href = `/cdap/ns/${event.target.value}/details`;
  };

  return (
    <>
      <StyledToppanel>
        <StyledTitle>{T.translate(`${PREFIX}.title`, { name: namespace })}</StyledTitle>
        <StyledTitle>
          <FormControl variant="standard">
            <StyledSelect
              value={namespace}
              onChange={onNamespaceChange}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              {namespaces.map((ns) => (
                <MenuItem value={ns}>{ns}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </StyledTitle>
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
