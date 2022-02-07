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
import ClearIcon from '@material-ui/icons/Clear';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyReplicatorApi } from 'api/replicator';
import LoadingSVG from 'components/LoadingSVG';
import Heading, { HeadingTypes } from 'components/Heading';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { IColumnImmutable, ITableInfo, ISelectedList } from 'components/Replicator/types';
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
} from './styles';
import { IconButton } from '@material-ui/core';

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

    const body: ITableInfo = {
      table: props.tableInfo.table,
      database: props.tableInfo.database,
    };

    if (props.tableInfo.schema) {
      body.schema = props.tableInfo.schema;
    }

    MyReplicatorApi.getTableInfo(params, body).subscribe(
      (res) => {
        const selectedColumns = getInitialSelectedColumns(res.columns);

        dispatch({
          type: 'setTableInfo',
          payload: {
            columns: res.columns,
            primaryKeys: res.primaryKey,
            selectedColumns,
            filteredColumns: res.columns,
            selectedReplication:
              selectedColumns.size === 0 ? ReplicateSelect.all : ReplicateSelect.individual,
          },
        });
      },
      (err) => {
        dispatch({ type: 'setError', payload: err });
      },
      () => {
        dispatch({ type: 'setLoading', payload: false });
      }
    );
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
    props.onSave(props.tableInfo, returnSelectedList());
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

  const isSaveDisabled = () => {
    if (
      state.selectedReplication === ReplicateSelect.individual &&
      state.selectedColumns.size === 0
    ) {
      return true;
    }

    return state.loading;
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
          {/* 
            Will need to add this back for the 6.6 version https://cdap.atlassian.net/browse/CDAP-18593
          <ButtonWithMarginRight variant="text" color="primary" onClick={props.toggle}>
            Cancel
          </ButtonWithMarginRight> */}
          <IconButton
            // variant="contained"
            // color="primary"
            onClick={handleSave}
            // disabled={isSaveDisabled()}
          >
            <ClearIcon />
          </IconButton>
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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => props.handleAssessTable(props.tableInfo, returnSelectedList())}
              >
                <CachedIcon /> REFRESH
              </Button>
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
              addColumnsToTransforms: props.addColumnsToTransforms,
              deleteColumnsFromTransforms: props.deleteColumnsFromTransforms,
              transforms: props.transformations[props.tableInfo.table],
              tableInfo: props.tableInfo,
              tableAssessments: props.tableAssessments,
              handleFilterErrors,
              filterErrs: state.filterErrs,
              selectedList: returnSelectedList,
            })}
      </Root>
    </Backdrop>
  );
};

const SelectColumns = createContextConnect(SelectColumnsView);
export default SelectColumns;
