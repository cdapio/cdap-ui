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
import T from 'i18n-react';
import { createContextConnect } from 'components/Replicator/Create';
import { Map } from 'immutable';
import Button from '@material-ui/core/Button';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyReplicatorApi } from 'api/replicator';
import LoadingSVG from 'components/LoadingSVG';
import Heading, { HeadingTypes } from 'components/Heading';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchBox from 'components/Replicator/Create/Content/SearchBox';
import { IColumnImmutable, ITableInfo } from 'components/Replicator/types';
import { useDebounce } from 'services/react/customHooks/useDebounce';

import { ISelectColumnsProps, ReplicateSelect } from './types';
import { reducer, initialState } from './reducer';
import {
  ActionButtons,
  Backdrop,
  ButtonWithMarginRight,
  GridWrapper,
  Header,
  LoadingContainer,
  Root,
  RadioContainer,
  StyledCheckbox,
  StyledRadio,
  StyledRadioGroup,
  SubtitleContainer,
} from './styles';

const I18N_PREFIX = 'features.Replication.Create.Content.SelectColumns';

const SelectColumnsView: React.FC<ISelectColumnsProps> = (props) => {
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

  const debouncedSearch = useDebounce(state.search);

  useEffect(() => {
    let filteredColumns = state.columns;
    if (debouncedSearch !== '') {
      filteredColumns = filteredColumns.filter((row) => {
        const normalizedColumn = row.name.toLowerCase();
        const normalizedSearch = debouncedSearch.toLowerCase();

        return normalizedColumn.indexOf(normalizedSearch) !== -1;
      });
    }

    dispatch({ type: 'setFilteredColumns', payload: filteredColumns });
  }, [debouncedSearch]);

  const handleSave = () => {
    const selectedList =
      state.selectedReplication === ReplicateSelect.all ? null : state.selectedColumns.toList();

    props.onSave(props.tableInfo, selectedList);
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

  const isSaveDisabled = () => {
    if (
      state.selectedReplication === ReplicateSelect.individual &&
      state.selectedColumns.size === 0
    ) {
      return true;
    }

    return state.loading;
  };

  const renderContent = () => {
    return (
      <>
        <SubtitleContainer>
          <div>{`Columns - ${state.selectedColumns.size} of ${state.columns.length} selected`}</div>

          <div>
            <SearchBox
              value={state.search}
              onChange={handleSearch}
              placeholder="Search by column name"
            />
          </div>
        </SubtitleContainer>
        <GridWrapper className="grid-wrapper">
          <div className="grid grid-container grid-compact">
            <div className="grid-header">
              <div className="grid-row">
                <div>
                  <StyledCheckbox
                    color="primary"
                    checked={state.selectedColumns.size === state.columns.length}
                    indeterminate={
                      state.selectedColumns.size < state.columns.length &&
                      state.selectedColumns.size > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </div>
                <div>#</div>
                <div>Column name</div>
                <div>Type</div>
                <div>Null</div>
                <div>Key</div>
              </div>
            </div>

            <div className="grid-body">
              {state.filteredColumns.map((row, i) => {
                const isPrimaryKey = state.primaryKeys.indexOf(row.name) !== -1;
                return (
                  <div key={row.name} className="grid-row">
                    <div
                      title={
                        isPrimaryKey
                          ? T.translate(`${I18N_PREFIX}.primaryKeyDescription`).toString()
                          : ''
                      }
                    >
                      <StyledCheckbox
                        color="primary"
                        checked={!!state.selectedColumns.get(row.name)}
                        disabled={isPrimaryKey}
                        onChange={toggleSelected.bind(this, row)}
                      />
                    </div>
                    <div>{i + 1}</div>
                    <div>{row.name}</div>
                    <div>{row.type}</div>
                    <div>
                      <StyledCheckbox checked={row.nullable} disabled={true} />
                    </div>
                    <div>{isPrimaryKey ? 'Primary' : '--'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </GridWrapper>
      </>
    );
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
          <ButtonWithMarginRight variant="text" color="primary" onClick={props.toggle}>
            Cancel
          </ButtonWithMarginRight>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaveDisabled()}
          >
            Save
          </Button>
        </ActionButtons>
      </Header>
      <Root>
        {!state.loading && (
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
        )}
        {state.loading ? renderLoading() : renderContent()}
      </Root>
    </Backdrop>
  );
};

const SelectColumns = createContextConnect(SelectColumnsView);
export default SelectColumns;
