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
