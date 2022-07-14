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

import React, { useEffect, useReducer } from 'react';
import { createContextConnect } from 'components/Replicator/Create';
import { Map } from 'immutable';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CachedIcon from '@material-ui/icons/Cached';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyReplicatorApi } from 'api/replicator';
import LoadingSVG from 'components/shared/LoadingSVG';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  IColumnImmutable,
  ITableInfo,
  ISelectedList,
  IColumnTransformation,
  IDeltaConfig,
} from 'components/Replicator/types';
import { useDebounce } from 'services/react/customHooks/useDebounce';

import { ISelectColumnsProps, ReplicateSelect } from './types';
import { reducer, initialState } from './reducer';

import { renderTable } from './table';

import {
  ActionButtons,
  Backdrop,
  Header,
  LoadingContainer,
  StyledRadio,
  Root,
  RadioContainer,
  StyledRadioGroup,
  RefreshContainer,
  CancelButton,
} from './styles';
import ButtonLoadingHoc from 'components/shared/Buttons/ButtonLoadingHoc';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { Observable } from 'rxjs/Observable';

const LoadingButton = ButtonLoadingHoc(Button);

const I18N_PREFIX = 'features.Replication.Create.Content.SelectColumns';

const SelectColumnsView = (props: ISelectColumnsProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getInitialSelectedColumns = (columns): Map<string, IColumnImmutable> => {
    const existingColumns = {};
    columns.forEach((column) => {
      existingColumns[column.name] = true;
    });

    let hasChange = false;

    const selectedColumns = {};
    if (props.initialSelected && props.initialSelected.size > 0) {
      props.initialSelected.forEach((row: IColumnImmutable) => {
        const rowName = row.get('name') as string;
        if (existingColumns[rowName]) {
          selectedColumns[rowName] = row;
        } else {
          hasChange = true;
        }
      });
    }

    const response: Map<string, IColumnImmutable> = Map(selectedColumns);

    if (hasChange) {
      props.onSave(props.tableInfo, response.toList());
    }

    return response;
  };

  const returnSelectedList = (): ISelectedList => {
    return state.selectedReplication === ReplicateSelect.all
      ? null
      : state.selectedColumns.toList();
  };

  useEffect(() => {
    dispatch({ type: 'setLoading', payload: true });

    const params = {
      namespace: getCurrentNamespace(),
      draftId: props.draftId,
    };

    const paramsTargetTable = {
      namespace: getCurrentNamespace(),
    };

    const body: ITableInfo = {
      table: props.tableInfo.table,
      database: props.tableInfo.database,
    };

    if (props.tableInfo.schema) {
      body.schema = props.tableInfo.schema;
    }

    const replicatorConfig = props.getReplicatorConfig();

    // This checks if the clicked table is selected or not.
    // The getTargetTableInfo requires the submitted table
    // to be in replicatorConfig.tables, below process inserts
    // the unselected table into the payload if necessary
    let needInsertTable = true;
    replicatorConfig.tables.forEach((table) => {
      if (table.table === body.table) {
        needInsertTable = false;
        return;
      }
    });
    if (needInsertTable) {
      replicatorConfig.tables = [...replicatorConfig.tables, body];
    }

    const bodyTargetTable: IDeltaConfig = {
      dBTable: body,
      deltaConfig: replicatorConfig,
    };

    Observable.forkJoin([
      MyReplicatorApi.getTableInfo(params, body),
      MyReplicatorApi.getTargetTableInfo(paramsTargetTable, bodyTargetTable),
    ]).subscribe({
      next: (value: any) => {
        const [tableInfo, assessedTable] = value;
        const combinedColumns = tableInfo.columns.map((t1) => ({
          ...t1,
          ...assessedTable.columns.find((t2) => t2.sourceName === t1.name),
        }));
        const selectedColumns = getInitialSelectedColumns(combinedColumns);
        dispatch({
          type: 'setTableInfo',
          payload: {
            columns: combinedColumns,
            primaryKeys: tableInfo.primaryKey,
            selectedColumns,
            filteredColumns: combinedColumns,
            selectedReplication:
              selectedColumns.size === 0 ? ReplicateSelect.all : ReplicateSelect.individual,
          },
        });
      },
      error: (err) => {
        dispatch({ type: 'setError', payload: err });
      },
      complete: () => {
        dispatch({ type: 'setLoading', payload: false });
      },
    });
  }, []);

  useEffect(() => {
    if (state.selectedReplication === ReplicateSelect.all) {
      toggleSelectAll();
    }
  }, [state.selectedReplication]);

  useEffect(() => {
    if (state.columns.length > 0 && state.selectedColumns.size === 0) {
      toggleSelectAll();
    }
  }, [state.columns]);

  useEffect(() => {
    Object.values(props.transformations).forEach((tableTransformation) => {
      if (tableTransformation.tableName === props.tableInfo.table) {
        dispatch({
          type: 'setInitialTransformations',
          payload: tableTransformation.columnTransformations,
        });
      }
    });
  }, []);

  const handleSearch = (search) => {
    dispatch({ type: 'setSearch', payload: search });
  };

  const handleFilterErrors = (errs: string[]) => {
    dispatch({ type: 'filterErrs', payload: errs });
  };

  const debouncedSearch = useDebounce(state.search);

  useEffect(() => {
    let filteredColumns = state.columns;
    if (debouncedSearch !== '' || state.filterErrs.length > 0) {
      filteredColumns = filteredColumns.filter((row) => {
        const normalizedColumn = row.name.toLowerCase();
        const normalizedSearch = debouncedSearch.toLowerCase();
        const matchedColumns = state.filterErrs.indexOf(normalizedColumn) !== -1;
        const matchedSearch = normalizedColumn.indexOf(normalizedSearch) !== -1;

        // if search and show only errors, match both
        if (state.filterErrs.length && debouncedSearch !== '') {
          return matchedColumns && matchedSearch;
        }

        if (state.filterErrs.length) {
          return matchedColumns;
        }

        return normalizedColumn.indexOf(normalizedSearch) !== -1;
      });
    }

    dispatch({ type: 'setFilteredColumns', payload: filteredColumns });
  }, [debouncedSearch, state.filterErrs]);

  const handleSave = () => {
    props.saveTransformationsAndColumns(
      props.tableInfo,
      { tableName: props.tableInfo.table, columnTransformations: state.transformations },
      returnSelectedList()
    );

    props.toggle();
  };

  const toggleSelected = (row) => {
    if (state.selectedReplication === ReplicateSelect.all) {
      return;
    }

    const key = row.name;
    if (state.selectedColumns.get(key)) {
      dispatch({
        type: 'setSelectedColumns',
        payload: state.selectedColumns.delete(key),
      });
      return;
    }

    dispatch({
      type: 'setSelectedColumns',
      payload: state.selectedColumns.set(key, Map({ name: row.name, type: row.type })),
    });
  };

  const toggleSelectAll = () => {
    if (
      state.selectedColumns.size > state.primaryKeys.length &&
      state.selectedReplication !== ReplicateSelect.all
    ) {
      // primary keys are required so don't remove them from the selected columns
      const primaryKeyMap = {};
      state.columns.forEach((row) => {
        if (state.primaryKeys.indexOf(row.name) !== -1) {
          primaryKeyMap[row.name] = Map({ name: row.name, type: row.type });
        }
      });

      dispatch({ type: 'setSelectedColumns', payload: Map(primaryKeyMap) });

      return;
    }

    const selectedMap = {};
    state.columns.forEach((row) => {
      selectedMap[row.name] = Map({ name: row.name, type: row.type });
    });

    dispatch({
      type: 'setSelectedColumns',
      payload: Map(selectedMap),
    });
  };

  const handleReplicationSelection = (e) => {
    dispatch({
      type: 'setSelectedReplication',
      payload: e.target.value,
    });
  };

  useEffect(() => {
    props.onSave(props.tableInfo, returnSelectedList());
  }, [state.selectedColumns, state.selectedReplication]);

  useEffect(() => {
    dispatch({
      type: 'setSaveButtonDisabled',
      payload: true,
    });
  }, [state.transformations]);

  const isSaveDisabled = () => {
    if (
      state.selectedReplication === ReplicateSelect.individual &&
      state.selectedColumns.size === 0
    ) {
      return true;
    }
    // disable saving table if assessment hasn't been run or if there are any errors
    // table assessment with be an empty object if there are no errors for this table
    const tableAssessment = props.tableAssessments;
    if (!tableAssessment || (tableAssessment && Object.keys(tableAssessment).length !== 0)) {
      return true;
    }

    return state.loading || state.saveButtonDisabled || props.assessmentLoading;
  };

  const renderLoading = () => {
    return (
      <LoadingContainer>
        <LoadingSVG />
      </LoadingContainer>
    );
  };

  if (!props.tableInfo) {
    return null;
  }

  return (
    <Backdrop>
      <Header>
        <Heading
          type={HeadingTypes.h4}
          label={`${props.tableInfo.table} - Mappings, assessments and transformations`}
        />
        <ActionButtons>
          <CancelButton onClick={props.toggle}>Cancel</CancelButton>
          <PrimaryContainedButton onClick={handleSave} disabled={isSaveDisabled()}>
            Save
          </PrimaryContainedButton>
        </ActionButtons>
      </Header>
      <Root>
        {!state.loading && (
          <Box sx={{ display: 'flex' }}>
            <RadioContainer>
              <StyledRadioGroup
                value={state.selectedReplication}
                onChange={handleReplicationSelection}
              >
                <FormControlLabel
                  value={ReplicateSelect.all}
                  control={<StyledRadio color="primary" />}
                  label="Replicate all available columns"
                />
                <FormControlLabel
                  value={ReplicateSelect.individual}
                  control={<StyledRadio color="primary" />}
                  label="Select the columns to replicate"
                />
              </StyledRadioGroup>
            </RadioContainer>
            <RefreshContainer>
              <LoadingButton
                loading={props.assessmentLoading}
                variant="outlined"
                color="primary"
                onClick={() => {
                  props.handleAssessTable(
                    props.tableInfo,
                    state.transformations,
                    returnSelectedList()
                  );
                  dispatch({
                    type: 'setSaveButtonDisabled',
                    payload: false,
                  });
                }}
              >
                <CachedIcon /> REFRESH
              </LoadingButton>
            </RefreshContainer>
          </Box>
        )}
        {state.loading
          ? renderLoading()
          : renderTable({
              state,
              toggleSelectAll,
              toggleSelected,
              I18N_PREFIX,
              handleSearch,
              addColumnsToTransforms: (opts: IColumnTransformation) =>
                dispatch({ type: 'setColumnTransformation', payload: opts }),
              deleteColumnsFromTransforms: (colTransIndex: number) =>
                dispatch({ type: 'removeColumnTransformation', payload: colTransIndex }),
              transforms: state.transformations,
              tableInfo: props.tableInfo,
              tableAssessments: props.tableAssessments,
              handleFilterErrors,
              filterErrs: state.filterErrs,
              selectedList: returnSelectedList,
              tinkEnabled: props.tinkEnabled,
            })}
      </Root>
    </Backdrop>
  );
};

const SelectColumns = createContextConnect(SelectColumnsView);
export default SelectColumns;
