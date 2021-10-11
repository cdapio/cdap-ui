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
    default:
      return state;
  }
};

export const initialState = {
  columns: [],
  filteredColumns: [],
  primaryKeys: [],
  selectedReplication: ReplicateSelect.all,
  selectedColumns: Map<string, IColumnImmutable>(),
  loading: true,
  error: null,
  search: '',
};
