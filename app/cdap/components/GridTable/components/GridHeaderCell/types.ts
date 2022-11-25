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

import { IType } from 'components/GridTable/types';

export interface IGridHeaderCellProps {
  label: string;
  types: Array<string | boolean | Record<string, IType>>;
  key: string;
  columnSelected: string;
  setColumnSelected: (columnName: string) => void;
  onColumnSelection: (columnName: string) => void;
  eachHeaderIndex: number;
}
