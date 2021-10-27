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
  GridVertCentered,
  GridInputVertCentered,
  HeaderGrid,
  StyledCheckbox,
  SubtitleContainer,
  HeaderWithLineThrough,
  NoPaddingP,
  CenteredTextSpan,
  GridPadLeft,
  GridPadLeftBorderRight,
  GridBorderBottom,
  KeyboardArrowDownIconWithStyle,
  SmallButton,
  RedSpan,
} from './styles';
import SearchBox from 'components/Replicator/Create/Content/SearchBox';
import StatusButton from 'components/StatusButton';

export const renderTable = ({
  state,
  handleSearch,
  toggleSelectAll,
  toggleSelected,
  I18N_PREFIX,
}: {
  state: ISelectColumnsState;
  handleSearch: (search: any) => void;
  toggleSelectAll: () => void;
  toggleSelected: (row: any) => void;
  I18N_PREFIX: string;
}) => {
  const numNotSupported = 3;
  let supportedError;
  if (numNotSupported > 0) {
    supportedError = (
      <>
        {' - '}
        <RedSpan>{numNotSupported} not or partially supported</RedSpan>
        <SmallButton variant="text" color="primary">
          SHOW
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
            <HeaderWithLineThrough> Schema properties </HeaderWithLineThrough>
          </Grid>
          <Grid item xs={4}>
            <HeaderWithLineThrough> Assessments and transformations </HeaderWithLineThrough>
          </Grid>
        </Grid>
        <HeaderGrid container direction="row">
          <GridPadLeft item xs={1} container direction="row">
            <GridInputVertCentered item xs={6}>
              <StyledCheckbox
                color="primary"
                checked={state.selectedColumns.size === state.columns.length}
                indeterminate={
                  state.selectedColumns.size < state.columns.length &&
                  state.selectedColumns.size > 0
                }
                onChange={toggleSelectAll}
              />
            </GridInputVertCentered>
            <GridVertCentered item xs={6}>
              <span>#</span>
            </GridVertCentered>
          </GridPadLeft>
          <GridPadLeft item xs={3} container direction="row">
            <GridVertCentered item xs={3}>
              <NoPaddingP>Source</NoPaddingP>
            </GridVertCentered>
            <GridVertCentered item xs={5}>
              <ArrowRight />
            </GridVertCentered>
            <GridVertCentered item xs={4}>
              <NoPaddingP>Target</NoPaddingP>
            </GridVertCentered>
          </GridPadLeft>
          <GridPadLeft item xs={2} container direction="row">
            <GridVertCentered item xs={3}>
              <NoPaddingP>Source</NoPaddingP>
            </GridVertCentered>
            <GridVertCentered item xs={5}>
              <ArrowRight />
            </GridVertCentered>
            <GridVertCentered item xs={4}>
              <NoPaddingP>Target</NoPaddingP>
            </GridVertCentered>
          </GridPadLeft>
          <GridPadLeftBorderRight item xs={2} container direction="row">
            <GridVertCentered item xs={6}>
              <CenteredTextSpan>Null</CenteredTextSpan>
            </GridVertCentered>
            <GridVertCentered item xs={6}>
              <CenteredTextSpan>Key</CenteredTextSpan>
            </GridVertCentered>
          </GridPadLeftBorderRight>
          <GridPadLeft item xs={4} container direction="row">
            <GridInputVertCentered item xs={6}>
              <StatusButton status="success" />
            </GridInputVertCentered>
            <GridVertCentered item xs={6}>
              <span>Transformations Applied</span>
            </GridVertCentered>
          </GridPadLeft>
        </HeaderGrid>

        {state.filteredColumns.map((row, i) => {
          const isPrimaryKey = state.primaryKeys.indexOf(row.name) !== -1;
          return (
            <GridBorderBottom key={row.name} container direction="row">
              <GridPadLeft item xs={1} container direction="row">
                <GridInputVertCentered
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
                </GridInputVertCentered>
                <GridVertCentered item xs={6}>
                  <span>{i + 1}</span>
                </GridVertCentered>
              </GridPadLeft>
              <GridPadLeft item xs={3} container direction="row">
                <GridVertCentered item xs={3}>
                  <NoPaddingP>{row.name}</NoPaddingP>
                </GridVertCentered>
                <Grid item xs={5}>
                  <span></span>
                </Grid>
                <GridVertCentered item xs={4}>
                  <NoPaddingP>{row.name}</NoPaddingP>
                </GridVertCentered>
              </GridPadLeft>
              <GridPadLeft item xs={2} container direction="row">
                <GridVertCentered item xs={3}>
                  <NoPaddingP> {row.type.toLowerCase()}</NoPaddingP>
                </GridVertCentered>
                <Grid item xs={5}>
                  <span></span>
                </Grid>
                <GridVertCentered item xs={4}>
                  <NoPaddingP>{row.type.toLowerCase()}</NoPaddingP>
                </GridVertCentered>
              </GridPadLeft>
              <GridPadLeftBorderRight item xs={2} container direction="row">
                <GridVertCentered item xs={6}>
                  <CenteredTextSpan>
                    <StyledCheckbox checked={row.nullable} disabled={true} />
                  </CenteredTextSpan>
                </GridVertCentered>
                <GridVertCentered item xs={6}>
                  <CenteredTextSpan>{isPrimaryKey ? 'Primary' : '--'}</CenteredTextSpan>
                </GridVertCentered>
              </GridPadLeftBorderRight>
              <GridPadLeft item xs={4} container direction="row">
                <GridInputVertCentered item xs={2}>
                  <StatusButton status="success" />
                </GridInputVertCentered>
                <GridVertCentered item xs={4}>
                  <SmallButton color="primary">
                    Transform
                    <KeyboardArrowDownIconWithStyle />
                  </SmallButton>
                </GridVertCentered>
                <GridVertCentered item xs={6}>
                  <span>--</span>
                </GridVertCentered>
              </GridPadLeft>
            </GridBorderBottom>
          );
        })}
      </Grid>
    </>
  );
};
