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

import React from 'react';
import { connect } from 'react-redux';
import { INamespaceAdmin } from './store';
import styled from 'styled-components';
import T from 'i18n-react';
import { FormControl, MenuItem, Select } from '@material-ui/core';

const PREFIX = 'features.NamespaceAdmin.description';

const StyledDescription = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
`;

const StyledNamespaceDropdown = styled.div`
  margin-top: 15px;
  display: flex;

  span {
    font-size: 18px;
    font-weight: 700;
    width: 250px;
  }
`;

const StyledSelect = styled(Select)`
  min-width: 150px;
  font-size: 16px;
`;

interface IDescriptionProps {
  namespace: string;
  namespaces: string[];
  description: string;
}

const DescriptionView: React.FC<IDescriptionProps> = ({ namespace, namespaces, description }) => {
  const onNamespaceChange = (event) => {
    window.location.href = `/cdap/ns/${event.target.value}/details`;
  };

  return (
    <>
      <StyledNamespaceDropdown>
        <span>{T.translate(`${PREFIX}.title`, { name: namespace })}</span>
        <span>
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
        </span>
      </StyledNamespaceDropdown>
      <StyledDescription>{description}</StyledDescription>
    </>
  );
};

const mapStateToProps = (state: INamespaceAdmin) => {
  return {
    namespace: state.namespace,
    namespaces: state.namespaces,
    description: state.description,
  };
};

const Description = connect(mapStateToProps)(DescriptionView);
export default Description;
