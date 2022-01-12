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
import IconSVG from 'components/shared/IconSVG';
import ActionsPopover from '../../ActionPopover';
import { Grid, GridHeader, GridBody, GridRow, GridCell } from '../../shared.styles';
import { IConnection, IPendingReqsTableData } from '../../types';
import { formatAsPercentage } from 'services/DataFormatter';
import { humanReadableDate } from 'services/helpers';

const PREFIX = 'features.Administration.Tethering';
const REQUEST_DATE_FORMAT = 'MM/DD/YYYY - hh:mm A';
const COLUMN_TEMPLATE = '1.5fr 1.5fr 2fr 1fr 2fr 1fr 1fr 1fr';
const CONN_TYPE = 'PENDING';
const PENDING_REQS_TABLE_HEADERS = [
  {
    property: 'requestTime', // properties may come handy when adding sort by columns to the table, will remove if not needed
    label: T.translate(`${PREFIX}.ColumnHeaders.requestTime`),
  },
  {
    property: 'gcp',
    label: T.translate(`${PREFIX}.ColumnHeaders.gcp`),
  },
  {
    property: 'instanceName',
    label: T.translate(`${PREFIX}.ColumnHeaders.instanceName`),
  },
  {
    property: 'region',
    label: T.translate(`${PREFIX}.ColumnHeaders.region`),
  },
  {
    property: 'omniNamespace',
    label: T.translate(`${PREFIX}.ColumnHeaders.omniNamespace`),
  },
  {
    property: 'cpu',
    label: T.translate(`${PREFIX}.ColumnHeaders.cpu`),
  },
  {
    property: 'memory',
    label: T.translate(`${PREFIX}.ColumnHeaders.memory`),
  },
  {
    label: '',
  },
];

interface IPendingReqsTableProps {
  tableData: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

const PendingRequestsTable = ({ tableData, handleEdit, handleDelete }: IPendingReqsTableProps) => {
  const transformedTableData = tableData.map((req) => ({
    requestTime: humanReadableDate(Date.now(), true, false, REQUEST_DATE_FORMAT), // will be updated once backend server captures request time upon creation
    gcloudProject: req.metadata.metadata.project,
    instanceName: req.name,
    region: req.metadata.metadata.location,
    requestedResources: req.metadata.namespaceAllocations,
  }));

  const renderTableHeader = () => (
    <GridHeader>
      <GridRow columnTemplate={COLUMN_TEMPLATE}>
        {PENDING_REQS_TABLE_HEADERS.map((header, i) => {
          return <GridCell key={i}>{header.label}</GridCell>;
        })}
      </GridRow>
    </GridHeader>
  );

  const renderTableBody = (data: IPendingReqsTableData[]) => (
    <GridBody>{data.map((req: IPendingReqsTableData) => renderRow(req))}</GridBody>
  );

  const renderRow = (req: IPendingReqsTableData) => {
    const actionsElem = () => {
      return <IconSVG name="icon-more" />;
    };
    const { requestedResources, requestTime, gcloudProject, instanceName, region } = req;

    return requestedResources.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit } = resource;
      const isFirst = i === 0;
      const isLast = requestedResources.length === i + 1;
      return (
        <GridRow columnTemplate={COLUMN_TEMPLATE} border={isLast} key={i}>
          <GridCell>{isFirst ? requestTime : ''}</GridCell>
          <GridCell>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell>{isFirst ? instanceName : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell border={!isLast}>{namespace}</GridCell>
          <GridCell border={!isLast}>{cpuLimit && formatAsPercentage(cpuLimit)}</GridCell>
          <GridCell border={!isLast}>{memoryLimit && formatAsPercentage(memoryLimit)}</GridCell>
          {isFirst && (
            <GridCell lastCol={true}>
              <ActionsPopover
                target={actionsElem}
                onDeleteClick={() => handleDelete(CONN_TYPE, instanceName)}
                onEditClick={() => handleEdit(CONN_TYPE, instanceName)}
              />
            </GridCell>
          )}
        </GridRow>
      );
    });
  };

  return (
    <Grid>
      {renderTableHeader()}
      {renderTableBody(transformedTableData)}
    </Grid>
  );
};

export default PendingRequestsTable;
