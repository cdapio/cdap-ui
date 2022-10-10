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
import { IConnection, INamespaceAllocations } from '../types';
import { dateTimeFormat } from 'services/DataFormatter';
import { StyledIcon, GridRow, GridCell, LinedSpan } from '../shared.styles';
import { ICONS, PREFIX, DESC_COLUMN_TEMPLATE } from './constants';

export const getIconForStatus = (status: string, isForPendingReqs: boolean) => {
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

export const getTransformedTableData = (tableData: IConnection[]) => {
  return tableData.map((conn) => {
    // Avoid null pointer exception
    let description: string | null;
    let gcloudProject: string;
    let region: string;
    let allocationData: INamespaceAllocations[];

    const { metadata } = conn;
    if (metadata) {
      const {
        description: nestedDescription,
        metadata: nestedMetadata,
        namespaceAllocations,
      } = metadata;
      allocationData = namespaceAllocations;
      description = nestedDescription;
      if (nestedMetadata) {
        gcloudProject = nestedMetadata.project;
        region = nestedMetadata.location;
      }
    }

    return {
      requestTime: dateTimeFormat(conn.requestTime, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }),
      instanceName: conn.name,
      instanceUrl: conn.endpoint,
      tetheringStatus: conn.tetheringStatus,
      connectionStatus: conn.connectionStatus,
      description,
      gcloudProject,
      region,
      allocationData,
      highlighted: false,
    };
  });
};

export const renderAllocationsHeader = () => (
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
);

export const getTotalTableRows = (tableData: IConnection[]) =>
  tableData.reduce((acc, row) => {
    acc += row.metadata.namespaceAllocations.length;
    return acc;
  }, 0);
