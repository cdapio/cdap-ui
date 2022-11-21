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

import { ChangeEvent, Dispatch, MouseEvent, MutableRefObject, SetStateAction } from 'react';
import {
  IConnectionTabPluginArtifact,
  IConnectionTabType,
} from 'components/ConnectionList/Components/ConnectionTabs/Components/RenderLabel';

export interface IFilteredData {
  data: ITabData[];
  showTabs: boolean;
  selectedTab: string;
  toggleSearch: boolean;
}

export interface IHeaderCustomTooltipLabelProps {
  headersRefs: MutableRefObject<HTMLDivElement[]>;
  columnIndex: number;
  filteredData: IFilteredData;
}

export interface IHeaderContentProps extends IHeaderCustomTooltipLabelProps {
  levelIndex: number;
  eachFilteredData: IFilteredData;
  tabsData: IFilteredData[];
  searchHandler: (index: number) => void;
  makeCursorFocused: (index: number) => void;
  handleSearch: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  refs: MutableRefObject<HTMLDivElement[]>;
  handleClearSearch: (e: MouseEvent<HTMLInputElement>, index: number) => void;
}

export interface IHeaderCustomTooltipProps extends IHeaderCustomTooltipLabelProps {
  tabsData: IFilteredData[];
}

export interface IHeaderSearchProps {
  eachFilteredData: IFilteredData;
  columnIndex: number;
  refs: MutableRefObject<HTMLDivElement[]>;
  makeCursorFocused: (index: number) => void;
  handleSearch: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  handleClearSearch: (e: MouseEvent<HTMLInputElement>, index: number) => void;
}

export interface IHeaderSearchInputFieldProps {
  type: string;
  refs: MutableRefObject<HTMLDivElement[]>;
  onChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  columnIndex: number;
}

export interface IConnectionTabsProps {
  tabsData: IFilteredData;
  handleChange: (entity: IConnectionTabType, index: number) => void;
  value: string;
  columnIndex: number;
  connectionId: string;
  setIsErrorOnNoWorkSpace: Dispatch<SetStateAction<boolean>>;
  toggleLoader?: (value: boolean, isError?: boolean) => void;
}

export interface ITabData extends IConnectionTabType {
  SVG: JSX.Element;
  artifact: IConnectionTabPluginArtifact;
  category: string;
  count: number;
  displayName: string;
  icon: JSX.Element;
  name: string;
  type: string;
}

export interface ITabsDataResponse {
  entities: ITabData[];
  propertyHeaders: string[];
  sampleProperties: ITabsDataResponseSampleProperties[];
  totalCount: number;
}

interface IProperties {
  name: string;
  description: string;
}

export interface ITabsDataResponseSampleProperties {
  properties: IProperties;
  type: string;
}
