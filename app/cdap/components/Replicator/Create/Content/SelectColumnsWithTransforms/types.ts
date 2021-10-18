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

import { IColumnsList, IColumnImmutable, ITableInfo } from 'components/Replicator/types';

export interface ISelectColumnsProps {
  tableInfo?: ITableInfo;
  onSave: (tableInfo: ITableInfo, columns: IColumnsList) => void;
  initialSelected: IColumnsList;
  toggle: () => void;
  draftId: string;
}

interface IColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export enum ReplicateSelect {
  all = 'ALL',
  individual = 'INDIVIDUAL',
}

export interface ISelectColumnsState {
  columns: IColumn[];
  filteredColumns: IColumn[];
  primaryKeys: string[];
  selectedReplication: ReplicateSelect;
  selectedColumns: Map<string, IColumnImmutable>;
  loading: boolean;
  error: any;
  search: string;
}
