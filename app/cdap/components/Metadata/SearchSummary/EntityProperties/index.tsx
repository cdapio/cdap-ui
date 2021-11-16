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
import T from 'i18n-react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Input from '@material-ui/core/Input';
import { MySearchApi } from 'api/search';
import { IPropertiesResponse, ISearchParams } from 'components/Metadata/SearchSummary/helper';

const I18N_PREFIX = 'features.MetadataSummary';

const PropertiesTable = styled.table`
  width: 100%;
  tr:nth-child(odd) {
    background: var(--white);
  }
  tr > th,
  tr > td {
    border-bottom: solid 1px var(--grey06);
    border-right: solid 1px var(--grey06);
    padding: 10px;
  }
  tr > th:first-child,
  tr > td:first-child {
    width: 30%;
  }
  tr > td:nth-child(2n) {
    color: var(--grey02);
  }
  tr > td:nth-child(3n) {
    width: 50px;
    padding: 0;
    text-align: center;
  }
  tr > th:last-child,
  tr > td:last-child {
    border-right: none;
  }
`;

const InputCell = styled.td`
  background: var(--white);
  padding: 0 !important;
  vertical-align: bottom;
`;

const InputText = styled(Input)`
  padding: 7px 8px;
  width: 100%;
`;

const KeyCell = styled.td`
  text-transform: capitalize;
`;

const HeaderCell = styled.th`
  text-transform: capitalize;
`;

const Headers = styled.h4`
  color: var(--grey01);
  font-size: 1.08rem !important;
  margin: 0;
`;

const NoPropertiesMsg = styled(Headers)`
  text-align: center;
  padding: 20px 0;
  color: var(--grey09);
`;

const EntityTab = styled(Tab)`
  font-size: 1rem !important;
`;

interface IEntityPropertiesProps {
  properties: IPropertiesResponse;
  searchParams: ISearchParams;
  externalDatasetProperties: { [key: string]: string };
  onPropertiesChange: (properties: IPropertiesResponse) => void;
}

const EntityProperties: React.FC<IEntityPropertiesProps> = ({
  searchParams,
  properties,
  externalDatasetProperties,
  onPropertiesChange,
}) => {
  const propertiesTabAriaLabel = T.translate(`${I18N_PREFIX}.propertiesTabAriaLabel`);
  const deletePropertyLabel = T.translate(`${I18N_PREFIX}.deleteProperty`);
  const [propertyKeyToAdd, setPropertyKeyToAdd] = useState('');
  const [propertyValueToAdd, setPropertyValueToAdd] = useState('');
  const [propertyTypeTab, setPropertyTypeTab] = useState(0);

  function handleTabChange(event, newValue: string) {
    setPropertyTypeTab(Number(newValue));
  }

  function addProperty(event) {
    if (propertyKeyToAdd.trim() === '' || propertyValueToAdd.trim() === '') {
      event.preventDefault();
      return;
    }
    MySearchApi.addEntityProperty(searchParams, {
      [propertyKeyToAdd]: propertyValueToAdd,
    }).subscribe(() => {
      const updatedProperties = Object.assign({ ...properties.properties });
      updatedProperties.user[propertyKeyToAdd] = propertyValueToAdd;
      onPropertiesChange(
        Object.assign(
          { ...properties },
          {
            properties: updatedProperties,
          }
        )
      );
      setPropertyKeyToAdd('');
      setPropertyValueToAdd('');
    });
    event.preventDefault();
  }

  function deleteProperty(key: string) {
    const deleteParams = Object.assign({ ...searchParams }, { key });
    MySearchApi.deleteEntityProperty(deleteParams).subscribe(() => {
      const updatedProperties = Object.assign({ ...properties.properties });
      delete updatedProperties.user[key];
      onPropertiesChange(
        Object.assign(
          { ...properties },
          {
            properties: updatedProperties,
          }
        )
      );
    });
  }

  function onPropertyInputChange(isKey, event) {
    if (isKey) {
      setPropertyKeyToAdd(event.target.value);
    } else {
      setPropertyValueToAdd(event.target.value);
    }
  }

  return (
    <>
      <Tabs
        variant="fullWidth"
        value={propertyTypeTab}
        onChange={handleTabChange}
        aria-label={`${propertiesTabAriaLabel}`}
      >
        <EntityTab
          label={T.translate(`${I18N_PREFIX}.business`)}
          id={'0'}
          aria-controls="tabpanel-business"
        />
        <EntityTab
          label={T.translate(`${I18N_PREFIX}.system`)}
          id={'1'}
          aria-controls="tabpanel-system"
        />
      </Tabs>
      <div
        role="tabpanel"
        hidden={propertyTypeTab === 1}
        aria-labelledby={'0'}
        id={`tabpanel-business`}
      >
        <form onSubmit={addProperty}>
          <PropertiesTable>
            <tbody>
              {Object.keys(externalDatasetProperties).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{externalDatasetProperties[key]}</td>
                    <td></td>
                  </tr>
                );
              })}
              {Object.keys(properties.properties.user).map((key, index) => {
                return (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{properties.properties.user[key]}</td>
                    <td>
                      <IconButton
                        type="button"
                        onClick={deleteProperty.bind(this, key)}
                        aria-label={`${deletePropertyLabel}`}
                      >
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <InputCell>
                  <InputText
                    onChange={onPropertyInputChange.bind(this, true)}
                    value={propertyKeyToAdd}
                    placeholder={T.translate(`${I18N_PREFIX}.enterPropertyKey`)}
                    aria-label={T.translate(`${I18N_PREFIX}.propertyKey`)}
                  />
                </InputCell>
                <InputCell>
                  <InputText
                    onChange={onPropertyInputChange.bind(this, false)}
                    value={propertyValueToAdd}
                    placeholder={T.translate(`${I18N_PREFIX}.enterPropertyValue`)}
                    aria-label={T.translate(`${I18N_PREFIX}.propertyValue`)}
                  />
                </InputCell>
                <InputCell>
                  <IconButton type="submit">
                    <Add />
                  </IconButton>
                </InputCell>
              </tr>
            </tbody>
          </PropertiesTable>
        </form>
      </div>
      <div
        role="tabpanel"
        hidden={propertyTypeTab === 0}
        aria-labelledby={'1'}
        id={`tabpanel-system`}
      >
        {!properties.properties.isSystemEmpty && (
          <PropertiesTable>
            <tbody>
              <tr>
                <HeaderCell>{T.translate(`${I18N_PREFIX}.propertyKey`)}</HeaderCell>
                <HeaderCell>{T.translate(`${I18N_PREFIX}.propertyValue`)}</HeaderCell>
              </tr>
              {Object.keys(properties.properties.system).map((key, index) => {
                if (key !== 'schema') {
                  return (
                    <tr key={index}>
                      <KeyCell>{key}</KeyCell>
                      <td>{properties.properties.system[key]}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </PropertiesTable>
        )}
        {properties.properties.isSystemEmpty && (
          <NoPropertiesMsg>{T.translate(`${I18N_PREFIX}.noSystemProperties`)}</NoPropertiesMsg>
        )}
      </div>
    </>
  );
};

export default EntityProperties;
