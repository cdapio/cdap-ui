/*
 * Copyright © 2022 Cask Data, Inc.
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
import {
  Grid,
  GridHeader,
  GridBody,
  GridRow,
  GridCell,
  StyledIcon,
  LinedSpan,
} from '../shared.styles';
import { ICONS, CONNECTIONS_TABLE_HEADERS, PREFIX, DESC_COLUMN_TEMPLATE } from './constants';
import { IConnection, ITableData } from '../types';
import { dateTimeFormat } from 'services/DataFormatter';

const COLUMN_TEMPLATE = '50px 200px 2fr 1.5fr 1.5fr 200px 1.5fr 120px 120px 225px';

const getIconForStatus = (status: string, isForPendingReqs: boolean) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <StyledIcon
          name={ICONS.active.name}
          color={ICONS.active.color}
          tooltip={ICONS.active.tooltip}
        />
      );
    case 'INACTIVE':
      return (
        <StyledIcon
          name={ICONS.inactive.name}
          color={ICONS.inactive.color}
          tooltip={isForPendingReqs ? ICONS.inactive.pendingReqTooltip : ICONS.inactive.tooltip}
        />
      );
    default:
      return <StyledIcon name={ICONS.default.name} color={ICONS.default.color} />;
  }
};

interface ITetheringTableProps {
  tableData: IConnection[];
  showAllocationHeader?: boolean;
  isForPendingReqs?: boolean;
  renderLastColumn: (instanceName: string) => JSX.Element;
}

const renderTableHeader = (showAllocationHeader: boolean) => (
  <>
    {showAllocationHeader && (
      <GridRow columnTemplate={DESC_COLUMN_TEMPLATE}>
        <GridCell />
        <GridCell />
        <GridCell />
        <GridCell />
        <GridCell />
        <GridCell>
          <LinedSpan>{T.translate(`${PREFIX}.Connections.allocation`)}</LinedSpan>
        </GridCell>
        <GridCell />
      </GridRow>
    )}
    <GridHeader>
      <GridRow columnTemplate={COLUMN_TEMPLATE}>
        {CONNECTIONS_TABLE_HEADERS.map((header, i) => {
          return <GridCell key={i}>{header.label}</GridCell>;
        })}
      </GridRow>
    </GridHeader>
  </>
);

const renderTableBody = (
  data: ITableData[],
  renderRowFn: (conn: ITableData, idx: number) => React.ReactNode
) => <GridBody>{data.map((conn, idx) => renderRowFn(conn, idx))}</GridBody>;

const TetheringTable = ({
  tableData,
  showAllocationHeader,
  isForPendingReqs,
  renderLastColumn,
}: ITetheringTableProps) => {
  const transformedTableData = tableData.map((conn) => ({
    requestTime: dateTimeFormat(conn.requestTime, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }),
    description: conn.metadata.description,
    gcloudProject: conn.metadata.metadata.project,
    instanceName: conn.name,
    region: conn.metadata.metadata.location,
    allocationData: conn.metadata.namespaceAllocations,
    status: conn.connectionStatus,
  }));

  const renderRow = (conn: ITableData, idx: number) => {
    const {
      status,
      allocationData,
      requestTime,
      gcloudProject,
      description,
      instanceName,
      region,
    } = conn;
    const icon = getIconForStatus(status, isForPendingReqs);

    return allocationData.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit } = resource;
      const isFirst = i === 0;
      const isLast = allocationData.length === i + 1;
      const isLastConn = idx === transformedTableData.length - 1;

      return (
        <GridRow columnTemplate={COLUMN_TEMPLATE} border={isLast && !isLastConn} key={i}>
          <GridCell>{isFirst ? icon : ''}</GridCell>
          <GridCell>{isFirst ? requestTime : ''}</GridCell>
          <GridCell title={description}>{isFirst ? description : ''}</GridCell>
          <GridCell title={gcloudProject}>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell title={instanceName}>{isFirst ? instanceName : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell title={namespace} border={!isLast}>
            {namespace}
          </GridCell>
          <GridCell border={!isLast}>{cpuLimit}</GridCell>
          <GridCell border={!isLast}>{memoryLimit}</GridCell>
          {isFirst && <GridCell lastCol={true}>{renderLastColumn(instanceName)}</GridCell>}
        </GridRow>
      );
    });
  };

  return (
    <Grid>
      {renderTableHeader(showAllocationHeader)}
      {renderTableBody(transformedTableData, renderRow)}
    </Grid>
  );
};

export default TetheringTable;
