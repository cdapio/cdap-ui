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

import { ISelectColumnsState, ReplicateSelect } from './types';
import { IColumnImmutable } from 'components/Replicator/types';
import { Map } from 'immutable';

export const reducer = (state: ISelectColumnsState, action) => {
  switch (action.type) {
    case 'setTableInfo':
      return {
        ...state,
        columns: action.payload.columns,
        primaryKeys: action.payload.primaryKeys,
        selectedColumns: action.payload.selectedColumns,
        filteredColumns: action.payload.filteredColumns,
        selectedReplication:
          action.payload.selectedColumns.size === 0
            ? ReplicateSelect.all
            : ReplicateSelect.individual,
      };
    case 'setLoading':
      return {
        ...state,
        loading: action.payload,
      };
    case 'setError':
      return {
        ...state,
        error: action.payload,
      };
    case 'setSearch':
      return {
        ...state,
        search: action.payload,
      };
    case 'setSelectedColumns':
      return {
        ...state,
        selectedColumns: action.payload,
      };
    case 'setSelectedReplication':
      return {
        ...state,
        selectedReplication: action.payload,
      };
    case 'setFilteredColumns':
      return {
        ...state,
        filteredColumns: action.payload,
      };
    case 'filterErrs':
      return {
        ...state,
        filterErrs: action.payload,
      };
    case 'setColumnTransformation':
      return {
        ...state,
        transformations: [...state.transformations, action.payload],
      };
    case 'removeColumnTransformation':
      const newTransforms = state.transformations.splice(0, action.payload);
      return {
        ...state,
        transformations: newTransforms,
      };
    case 'setInitialTransformations':
      return {
        ...state,
        transformations: action.payload,
      };
    case 'setSaveButtonDisabled':
      return {
        ...state,
        saveButtonDisabled: action.payload,
      };
    default:
      return state;
  }
};

export const initialState = {
  columns: [],
  filteredColumns: [],
  filterErrs: [],
  primaryKeys: [],
  selectedReplication: ReplicateSelect.all,
  selectedColumns: Map<string, IColumnImmutable>(),
  loading: true,
  error: null,
  search: '',
  columnsWithErrors: '',
  transformations: [],
  saveButtonDisabled: true,
};
