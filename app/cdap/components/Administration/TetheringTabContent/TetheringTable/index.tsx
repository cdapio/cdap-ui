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

import React, { useState, useEffect } from 'react';
import { Grid, GridHeader, GridBody, GridRow, GridCell } from '../shared.styles';
import { CONNECTIONS_TABLE_HEADERS, TETHERING_STATUS } from './constants';
import { IConnection, ITableData } from '../types';
import { trimMemoryLimit } from '../utils';
import { getIconForStatus, renderAllocationsHeader, getTransformedTableData } from './utils';

const COLUMN_TEMPLATE = '50px 170px 170px 2fr 2fr 2fr 2fr 170px 2fr 140px 140px 225px';

interface ITetheringTableProps {
  tableData: IConnection[];
  showAllocationHeader?: boolean;
  isForTetheringReqs?: boolean;
  renderLastColumn: (instanceName: string, tetheringStatus: string) => JSX.Element;
}

const renderTableHeader = (showAllocationHeader: boolean) => (
  <>
    {showAllocationHeader && renderAllocationsHeader()}
    <GridHeader>
      <GridRow columnTemplate={COLUMN_TEMPLATE}>
        {CONNECTIONS_TABLE_HEADERS.map((header, i) => {
          return (
            <GridCell key={i} title={header.label}>
              {header.label}
            </GridCell>
          );
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
  isForTetheringReqs,
  renderLastColumn,
}: ITetheringTableProps) => {
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    let timer;
    const transformedTableData = getTransformedTableData(tableData);

    setGridData((prevState) => {
      if (
        !isForTetheringReqs &&
        prevState.length &&
        prevState.length < transformedTableData.length
      ) {
        let index = -1;
        // Check if a new connection has been added to established connections
        transformedTableData.some((conn, idx) => {
          const alreadyExists = prevState.find((prevConn) => {
            return prevConn.instanceName === conn.instanceName;
          });
          if (!alreadyExists) {
            index = idx;
          }
          return !alreadyExists;
        });

        // Move the newly added connection to the top of the Connections Table and highlight it for three seconds
        if (index !== -1) {
          const tempConn = { ...transformedTableData[index] };
          tempConn.highlighted = true;
          transformedTableData.splice(index, 1);
          transformedTableData.unshift(tempConn);
          timer = setTimeout(() => {
            tempConn.highlighted = false;
            setGridData([...transformedTableData]);
          }, 3000);
        }
      }
      return transformedTableData;
    });

    return () => clearTimeout(timer);
  }, [tableData]);

  const renderRow = (conn: ITableData, idx: number) => {
    const {
      tetheringStatus,
      connectionStatus,
      allocationData,
      requestTime,
      gcloudProject,
      description,
      instanceName,
      instanceUrl,
      region,
      highlighted,
    } = conn;
    const icon = getIconForStatus(connectionStatus, isForTetheringReqs);

    return allocationData.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit } = resource;
      const isFirst = i === 0;
      const isLast = allocationData.length === i + 1;
      const isLastConn = idx === gridData.length - 1;

      return (
        <GridRow
          highlighted={highlighted}
          columnTemplate={COLUMN_TEMPLATE}
          border={isLast && !isLastConn}
          key={i}
        >
          <GridCell>{isFirst ? icon : ''}</GridCell>
          <GridCell>{isFirst ? TETHERING_STATUS[tetheringStatus] : ''}</GridCell>
          <GridCell>{isFirst ? requestTime : ''}</GridCell>
          <GridCell title={description}>{isFirst ? description : ''}</GridCell>
          <GridCell title={gcloudProject}>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell title={instanceName}>{isFirst ? instanceName : ''}</GridCell>
          <GridCell title={instanceUrl}>{isFirst ? instanceUrl : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell title={namespace} border={!isLast}>
            {namespace}
          </GridCell>
          <GridCell border={!isLast}>{cpuLimit}</GridCell>
          <GridCell border={!isLast}>{trimMemoryLimit(memoryLimit)}</GridCell>
          {isFirst && (
            <GridCell lastCol={true}>{renderLastColumn(instanceName, tetheringStatus)}</GridCell>
          )}
        </GridRow>
      );
    });
  };

  return (
    <Grid>
      {renderTableHeader(showAllocationHeader)}
      {renderTableBody(gridData, renderRow)}
    </Grid>
  );
};

export default TetheringTable;
