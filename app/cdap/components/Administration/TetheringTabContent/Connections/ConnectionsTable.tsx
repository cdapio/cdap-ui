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
import styled from 'styled-components';
import { Grid, GridHeader, GridBody, GridRow, GridCell } from '../shared.styles';
import { IConnection, IConnectionsTableData } from '../types';
import IconSVG from 'components/shared/IconSVG';
import { formatAsPercentage } from 'services/DataFormatter';

const PREFIX = 'features.Administration.Tethering';

const StyledIcon = styled(IconSVG)`
  fill: ${(props) => props.color};
  font-size: 17px;
`;

const ICONS = {
  active: {
    name: 'icon-check-circle',
    color: 'var(--green)',
  },
  inactive: {
    name: 'icon-times-circle',
    color: 'var(--red)',
  },
  header: {
    name: 'icon-circle',
    color: 'var(--grey05)',
  },
  default: {
    name: 'icon-circle',
    color: 'black',
  },
};

const CONNECTIONS_TABLE_HEADERS = [
  {
    label: <StyledIcon name={ICONS.header.name} color={ICONS.header.color} />,
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
    property: 'pods',
    label: T.translate(`${PREFIX}.ColumnHeaders.pods`),
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

const getIconForStatus = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <StyledIcon name={ICONS.active.name} color={ICONS.active.color} />;
    case 'INACTIVE':
      return <StyledIcon name={ICONS.inactive.name} color={ICONS.inactive.color} />;
    default:
      return <StyledIcon name={ICONS.default.name} color={ICONS.default.color} />;
  }
};

interface IConnectionsTableProps {
  tableData: IConnection[];
  columnTemplate: string;
  renderLastColumn: (instanceName: string) => JSX.Element;
}

const ConnectionsTable = ({
  tableData,
  columnTemplate,
  renderLastColumn,
}: IConnectionsTableProps) => {
  const transformedTableData = tableData.map((conn) => ({
    gcloudProject: conn.metadata.metadata.project,
    instanceName: conn.name,
    region: conn.metadata.metadata.location,
    allocationData: conn.metadata.namespaceAllocations,
    status: conn.connectionStatus,
  }));

  const renderTableHeader = () => (
    <GridHeader>
      <GridRow columnTemplate={columnTemplate}>
        {CONNECTIONS_TABLE_HEADERS.map((header, i) => {
          return <GridCell key={i}>{header.label}</GridCell>;
        })}
      </GridRow>
    </GridHeader>
  );

  const renderTableBody = (data: IConnectionsTableData[]) => (
    <GridBody>{data.map((req: IConnectionsTableData) => renderRow(req))}</GridBody>
  );

  const renderRow = (req: IConnectionsTableData) => {
    const { status, allocationData, gcloudProject, instanceName, region } = req;
    const icon = getIconForStatus(status);

    return allocationData.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit, pods } = resource;
      const isFirst = i === 0;
      const isLast = allocationData.length === i + 1;
      return (
        <GridRow columnTemplate={columnTemplate} border={isLast} key={i}>
          <GridCell>{isFirst ? icon : ''}</GridCell>
          <GridCell>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell>{isFirst ? instanceName : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell border={!isLast}>{namespace}</GridCell>
          <GridCell border={!isLast}>{pods}</GridCell>
          <GridCell border={!isLast}>{cpuLimit && formatAsPercentage(cpuLimit)}</GridCell>
          <GridCell border={!isLast}>{memoryLimit && formatAsPercentage(memoryLimit)}</GridCell>
          {isFirst && <GridCell lastCol={true}>{renderLastColumn(instanceName)}</GridCell>}
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

export default ConnectionsTable;
