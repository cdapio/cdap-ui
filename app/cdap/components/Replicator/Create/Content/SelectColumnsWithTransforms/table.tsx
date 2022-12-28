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
  IColumnTransformation,
  ITableAssessmentColumn,
} from 'components/Replicator/types';

import TransformDelete from './TransformDelete';
import { SUPPORT } from '../Assessment/TablesAssessment/Mappings/Supported';

// uses the last created rename directive on that column to show the target column name
const useLastRenameOrRowName = (columnName: string, transforms: IColumnTransformation[]) => {
  const renameDir = transforms
    .slice()
    .reverse()
    .find((tr) => {
      return tr.directive.startsWith('rename') && tr.columnName === columnName;
    });

  if (renameDir) {
    return renameDir.directive.split(' ')[2];
  }

  return columnName;
};

export const renderTable = ({
  state,
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
  tinkEnabled,
}: {
  state: ISelectColumnsState;
  addColumnsToTransforms: (opts: IColumnTransformation) => void;
  deleteColumnsFromTransforms: (colTransIndex: number) => void;
  handleSearch: (search: any) => void;
  toggleSelectAll: () => void;
  toggleSelected: (row: any) => void;
  transforms: IColumnTransformation[];
  I18N_PREFIX: string;
  tableInfo: ITableInfo;
  tableAssessments: { [colName: string]: ITableAssessmentColumn };
  handleFilterErrors: (errs: string[]) => void;
  filterErrs: string[];
  selectedList: () => ISelectedList;
  tinkEnabled: boolean;
}) => {
  const hasTableAssessments = !!tableAssessments;
  // empty table assessments object means there were no errors
  const allAssessmentsPassed = hasTableAssessments && Object.keys(tableAssessments).length === 0;
  const errNames = [];
  const getCurrentColumnName = (columnName: string) => {
    const sameColumnRenames = transforms.filter(
      (transform) => transform.columnName === columnName && transform.directive.includes('rename')
    );
    if (sameColumnRenames.length > 0) {
      const currName = sameColumnRenames[sameColumnRenames.length - 1].directive.split(' ')[2];
      return currName;
    }
    return columnName;
  };

  let errs;

  if (hasTableAssessments) {
    errs = Object.values(tableAssessments).filter((a) => {
      if (a.support !== SUPPORT.yes) {
        // toLowerCase because search/filtering is lower cased
        errNames.push(a.sourceName.toLowerCase());
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

          if (allAssessmentsPassed) {
            // show all green checks if all the assessments pass
            assessmentForCol = { support: SUPPORT.yes };
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
                  <NoPaddingSpanLeft>
                    {useLastRenameOrRowName(row.name, transforms)}
                  </NoPaddingSpanLeft>
                </GridCell>
              </GridCellContainer>
              <GridCellContainer item xs={2} container direction="row">
                <GridCell item xs={3}>
                  <NoPaddingSpanLeft> {row.sourceType.toLowerCase()}</NoPaddingSpanLeft>
                </GridCell>
                <Grid item xs={5}>
                  <span></span>
                </Grid>
                <GridCell item xs={4}>
                  <NoPaddingSpanLeft>{row.targetType.toLowerCase()}</NoPaddingSpanLeft>
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
                    tinkEnabled={tinkEnabled}
                    currentColumnName={getCurrentColumnName(row.name)}
                    addColumnsToTransforms={addColumnsToTransforms}
                  />
                </GridCell>
                <GridCell item xs={6}>
                  <TransformDelete
                    row={row}
                    transforms={transforms}
                    deleteColumnsFromTransforms={deleteColumnsFromTransforms}
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
