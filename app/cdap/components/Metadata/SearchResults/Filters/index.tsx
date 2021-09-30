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

import T from 'i18n-react';
import * as React from 'react';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';

const I18N_PREFIX = 'features.MetadataSearch';

const HoverLink = styled.a`
  visibility: hidden;
`;

const FilterHeader = styled.h4`
  display: flex;
  align-items: center;
  margin: 20px 0 10px 0;
  padding-left: 10px;
  justify-content: space-between;
  font-size: 1rem !important;
  font-weight: 500;
  &:hover ${HoverLink} {
    cursor: pointer;
    visibility: visible;
    text-decoration: underline;
    color: var(--brand-primary-color);
  }
`;

const FilterList = styled.ul`
  margin: 0;
  list-style: none;
  padding: 0;
`;

const FilterItem = styled.label`
  display: flex;
  align-items: center;
  margin: 0;
  justify-content: space-between;
  font-weight: 500;
  cursor: pointer;
  &:hover ${HoverLink} {
    visibility: visible;
    text-decoration: underline;
    color: var(--brand-primary-color);
  }
`;

const Count = styled.a`
  margin-left: 10px;
`;

export interface IFilterItem {
  name: string;
  isActive: boolean;
  count: number;
  filter: string;
}

interface IFilterProps {
  title: string;
  list: IFilterItem[];
  onChange: (operation: Operations, filter: IFilterItem, isMetadata: boolean) => void;
  isMetadata: boolean;
}

export enum Operations {
  All = 'all',
  Only = 'only',
  Toggle = 'toggle',
}

const Filters: React.FC<IFilterProps> = ({ title, list, onChange, isMetadata }) => {
  function onShowAll() {
    onChange(Operations.All, null, isMetadata);
  }

  function onLabelClick(filter: IFilterItem, event) {
    if (event.target.tagName.toLowerCase() === 'a') {
      onChange(Operations.Only, filter, isMetadata);
    } else {
      onChange(Operations.Toggle, filter, isMetadata);
    }
    event.preventDefault();
  }

  return (
    <>
      <FilterHeader>
        <span>{title}</span>
        <HoverLink onClick={onShowAll}>{T.translate(`${I18N_PREFIX}.showAll`)}</HoverLink>
      </FilterHeader>
      <FilterList>
        {list.map(
          (listInfo) =>
            listInfo.count > 0 && (
              <li key={listInfo.name}>
                <FilterItem onClick={onLabelClick.bind(this, listInfo)}>
                  <span>
                    <Checkbox
                      checked={listInfo.isActive}
                      inputProps={{ 'aria-label': listInfo.name }}
                    />{' '}
                    {listInfo.name}
                  </span>
                  <span>
                    <HoverLink>{T.translate(`${I18N_PREFIX}.only`)}</HoverLink>
                    <Count>{listInfo.count}</Count>
                  </span>
                </FilterItem>
              </li>
            )
        )}
      </FilterList>
    </>
  );
};

export default Filters;
