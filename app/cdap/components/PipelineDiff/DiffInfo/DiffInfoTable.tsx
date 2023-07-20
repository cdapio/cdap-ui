/*
 * Copyright © 2023 Cask Data, Inc.
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
import styled from 'styled-components';

import { DiffIndicator, IPipelineStage } from '../types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

const DiffInfoTableContainer = styled(TableContainer)`
  flex-grow: 1;
  width: 100%;
`;

function getEntryData(diffIndicator: DiffIndicator, propertyName: string, propertyValue) {
  const ADDED_REGEX = /__added$/;
  const DELETED_REGEX = /__deleted$/;

  if (diffIndicator === DiffIndicator.DELETED || diffIndicator === DiffIndicator.ADDED) {
    return { name: propertyName, value: propertyValue as string };
  }

  if (typeof propertyValue === 'string' && propertyName.match(ADDED_REGEX)) {
    return {
      name: propertyName.replace(ADDED_REGEX, ''),
      oldValue: '-',
      newValue: propertyValue,
    };
  }

  if (typeof propertyValue === 'string' && propertyName.match(DELETED_REGEX)) {
    return {
      name: propertyName.replace(DELETED_REGEX, ''),
      oldValue: propertyValue,
      newValue: '-',
    };
  }

  if (typeof propertyValue === 'string') {
    return {
      name: propertyName,
      oldValue: '-',
      newValue: '-',
    };
  }

  return {
    name: propertyName,
    oldValue: propertyValue.__old,
    newValue: propertyValue.__new,
  };
}

interface IDiffInfoTableProps {
  diffIndicator: DiffIndicator;
  pluginProperties: IPipelineStage['plugin']['properties'] | undefined;
}

export const DiffInfoTable = ({ diffIndicator, pluginProperties }: IDiffInfoTableProps) => {
  return (
    <DiffInfoTableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {diffIndicator === DiffIndicator.MODIFIED ? (
              <>
                <TableCell align="right">Old</TableCell>
                <TableCell align="right">New</TableCell>
              </>
            ) : (
              <TableCell align="right">Value</TableCell>
            )}
          </TableRow>
        </TableHead>
        {Object.keys(pluginProperties ?? {}).map((property) => {
          const entryData = getEntryData(diffIndicator, property, pluginProperties[property]);
          if (diffIndicator === DiffIndicator.MODIFIED) {
            return (
              <TableRow key={`properties.${property}`}>
                <TableCell component="th" scope="row">
                  properties.{entryData.name}
                </TableCell>
                <TableCell align="right">{entryData.oldValue}</TableCell>
                <TableCell align="right">{entryData.newValue}</TableCell>
              </TableRow>
            );
          }
          return (
            <TableRow key={`properties.${property}`}>
              <TableCell component="th" scope="row">
                properties.{entryData.name}
              </TableCell>
              <TableCell align="right">{entryData.value}</TableCell>
            </TableRow>
          );
        })}
      </Table>
    </DiffInfoTableContainer>
  );
};
