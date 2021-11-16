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

import React from 'react';
import T from 'i18n-react';
import Grid from '@material-ui/core/Grid';
import { ISelectColumnsState } from './types';

import {
  ArrowRight,
  GridCell,
  GridButtonCell,
  HeaderGrid,
  StyledCheckbox,
  SubtitleContainer,
  HeaderWithLineThrough,
  NoPaddingSpanLeft,
  CenteredTextSpan,
  GridCellContainer,
  GridBorderBottom,
  SmallButton,
  WarningMessage,
  GridDividerCell,
  Circle,
  SubHeaderSpanNoPadLeft,
  SubHeaderSpan,
  NumSpan,
  SchemaPropertiesHeader,
  KeySubHeaderSpan,
  PrimaryKeySpan,
} from './styles';
import SearchBox from 'components/Replicator/Create/Content/SearchBox';
import StatusButton from 'components/StatusButton';
import TransformAddButton from './TransformAdd';
import {
  ISelectedList,
  ITableInfo,
  ITransformation,
  IColumnTransformation,
} from 'components/Replicator/types';

import TransformDelete from './TransformDelete';
import { SUPPORT } from '../Assessment/TablesAssessment/Mappings/Supported';

export const renderTable = ({
  state,
  tableInfo,
  handleSearch,
  toggleSelectAll,
  toggleSelected,
  I18N_PREFIX,
  addColumnsToTransforms,
  deleteColumnsFromTransforms,
  transforms,
  tableAssessments,
  handleFilterErrors,
  filterErrs,
  selectedList,
}: {
  state: ISelectColumnsState;
  addColumnsToTransforms: (
    opts: IColumnTransformation,
    table: ITableInfo,
    columns: ISelectedList
  ) => void;
  deleteColumnsFromTransforms: (
    table: ITableInfo,
    colTransIndex: number,
    columns: ISelectedList
  ) => void;
  handleSearch: (search: any) => void;
  toggleSelectAll: () => void;
  toggleSelected: (row: any) => void;
  transforms: ITransformation;
  I18N_PREFIX: string;
  tableInfo: ITableInfo;
  tableAssessments: undefined | { [colName: string]: any };
  handleFilterErrors: (errs: string[]) => void;
  filterErrs: string[];
  selectedList: () => ISelectedList;
}) => {
  const hasTableAssessments = !!tableAssessments;
  const errNames = [];
  let errs;

  if (hasTableAssessments) {
    errs = Object.values(tableAssessments).filter((a) => {
      if (a.support !== SUPPORT.yes) {
        errNames.push(a.sourceName);
        return true;
      }
    });
  }

  const handleShowErrClick = () => {
    handleFilterErrors(!filterErrs.length ? errNames : []);
  };

  const numNotSupported = errs && errs.length;
  let supportedError;
  if (numNotSupported > 0) {
    supportedError = (
      <>
        {' - '}
        <WarningMessage>
          {numNotSupported} not or partially supported {'  '}
        </WarningMessage>
        <SmallButton variant="text" color="primary" onClick={() => handleShowErrClick()}>
          {filterErrs.length ? 'hide' : 'show'}
        </SmallButton>
      </>
    );
  }

  return (
    <>
      <SubtitleContainer>
        <div>
          {`Columns - ${state.selectedColumns.size} of ${state.columns.length} selected`}
          {numNotSupported > 0 ? supportedError : ''}
        </div>
        <div>
          <SearchBox
            value={state.search}
            onChange={handleSearch}
            placeholder="Search by column name"
            withAdornment
          />
        </div>
      </SubtitleContainer>
      <Grid
        spacing={0}
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid container direction="row">
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <HeaderWithLineThrough> Field Names </HeaderWithLineThrough>
          </Grid>
          <Grid item xs={2}>
            <HeaderWithLineThrough> Data Types </HeaderWithLineThrough>
          </Grid>
          <Grid item xs={2}>
            <SchemaPropertiesHeader> Schema properties </SchemaPropertiesHeader>
          </Grid>
          <Grid item xs={4}>
            <HeaderWithLineThrough> Assessments and transformations </HeaderWithLineThrough>
          </Grid>
        </Grid>
        <HeaderGrid container direction="row">
          <GridCellContainer item xs={1} container direction="row">
            <GridButtonCell item xs={6}>
              <StyledCheckbox
                color="primary"
                checked={state.selectedColumns.size === state.columns.length}
                indeterminate={
                  state.selectedColumns.size < state.columns.length &&
                  state.selectedColumns.size > 0
                }
                onChange={toggleSelectAll}
              />
            </GridButtonCell>
            <GridCell item xs={6} alignItems="center">
              <NumSpan>#</NumSpan>
            </GridCell>
          </GridCellContainer>
          <GridCellContainer item xs={3} container direction="row">
            <GridCell item xs={3}>
              <SubHeaderSpanNoPadLeft>Source</SubHeaderSpanNoPadLeft>
            </GridCell>
            <GridCell item xs={5}>
              <ArrowRight />
            </GridCell>
            <GridCell item xs={4}>
              <SubHeaderSpanNoPadLeft>Target</SubHeaderSpanNoPadLeft>
            </GridCell>
          </GridCellContainer>
          <GridCellContainer item xs={2} container direction="row">
            <GridCell item xs={3}>
              <SubHeaderSpanNoPadLeft>Source</SubHeaderSpanNoPadLeft>
            </GridCell>
            <GridCell item xs={5}>
              <ArrowRight />
            </GridCell>
            <GridCell item xs={4}>
              <SubHeaderSpanNoPadLeft>Target</SubHeaderSpanNoPadLeft>
            </GridCell>
          </GridCellContainer>
          <GridDividerCell item xs={2} container direction="row">
            <GridCell item xs={6}>
              <SubHeaderSpan>Null</SubHeaderSpan>
            </GridCell>
            <GridCell item xs={6}>
              <KeySubHeaderSpan>Key</KeySubHeaderSpan>
            </GridCell>
          </GridDividerCell>
          <GridCellContainer item xs={4} container direction="row">
            <GridButtonCell item xs={6}>
              <Circle />
            </GridButtonCell>
            <GridCell item xs={6}>
              <span>Transformations Applied</span>
            </GridCell>
          </GridCellContainer>
        </HeaderGrid>

        {state.filteredColumns.map((row, i) => {
          const isPrimaryKey = state.primaryKeys.indexOf(row.name) !== -1;
          let assessmentForCol;
          if (hasTableAssessments) {
            assessmentForCol = tableAssessments[row.name];
          }

          return (
            <GridBorderBottom key={row.name} container direction="row">
              <GridCellContainer item xs={1} container direction="row">
                <GridButtonCell
                  item
                  xs={6}
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
                </GridButtonCell>
                <GridCell item xs={6} alignItems="center">
                  <NumSpan>{i + 1}</NumSpan>
                </GridCell>
              </GridCellContainer>
              <GridCellContainer item xs={3} container direction="row">
                <GridCell item xs={3}>
                  <NoPaddingSpanLeft>{row.name}</NoPaddingSpanLeft>
                </GridCell>
                <Grid item xs={5}>
                  <span></span>
                </Grid>
                <GridCell item xs={4}>
                  <NoPaddingSpanLeft>{row.name}</NoPaddingSpanLeft>
                </GridCell>
              </GridCellContainer>
              <GridCellContainer item xs={2} container direction="row">
                <GridCell item xs={3}>
                  <NoPaddingSpanLeft> {row.type.toLowerCase()}</NoPaddingSpanLeft>
                </GridCell>
                <Grid item xs={5}>
                  <span></span>
                </Grid>
                <GridCell item xs={4}>
                  <NoPaddingSpanLeft>{row.type.toLowerCase()}</NoPaddingSpanLeft>
                </GridCell>
              </GridCellContainer>
              <GridDividerCell item xs={2} container direction="row">
                <GridCell item xs={6}>
                  <CenteredTextSpan>
                    <StyledCheckbox checked={row.nullable} disabled={true} />
                  </CenteredTextSpan>
                </GridCell>
                <GridCell item xs={6}>
                  <PrimaryKeySpan>{isPrimaryKey ? 'Primary' : '--'}</PrimaryKeySpan>
                </GridCell>
              </GridDividerCell>
              <GridCellContainer item xs={4} container direction="row">
                <GridButtonCell item xs={2}>
                  {!!assessmentForCol && (
                    <StatusButton
                      status={assessmentForCol.support}
                      message={assessmentForCol.suggestion}
                    />
                  )}
                </GridButtonCell>
                <GridCell item xs={4}>
                  <TransformAddButton
                    row={row}
                    addColumnsToTransforms={addColumnsToTransforms}
                    tableInfo={tableInfo}
                    columns={selectedList}
                  />
                </GridCell>
                <GridCell item xs={6}>
                  <TransformDelete
                    row={row}
                    tableInfo={tableInfo}
                    transforms={transforms}
                    deleteColumnsFromTransforms={deleteColumnsFromTransforms}
                    columns={selectedList}
                  />
                </GridCell>
              </GridCellContainer>
            </GridBorderBottom>
          );
        })}
      </Grid>
    </>
  );
};
