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

import React, { ChangeEvent } from 'react';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import { Dispatch, SetStateAction } from 'react';

interface ICommonInputProps {
  handleSingleSelection: (value: IHeaderNamesList) => void;
  handleMultipleSelection: (event: ChangeEvent<HTMLInputElement>, value: IHeaderNamesList) => void;
  isSingleSelection: boolean;
  selectedColumns: IHeaderNamesList[];
  isCheckboxDisabled?: () => boolean;
}

export interface IDataTableProps extends ICommonInputProps {
  columns: IHeaderNamesList[];
  transformationDataType: string[];
  dataQualityValue: Array<Record<string, string | number>>;
  totalColumnCount: number;
  setSelectedColumns: Dispatch<SetStateAction<IHeaderNamesList[]>>;
  transformationName: string;
}

export interface ITableRowWidgetProps extends ICommonInputProps {
  dataQualityValue: Array<Record<string, string | number>>;
  columnIndex: number;
  columnDetail: IHeaderNamesList;
}

export interface IInputWidgetsProps extends ICommonInputProps {
  columnDetail: IHeaderNamesList;
  columnIndex: number;
  isCheckboxDisabled: () => boolean;
}
