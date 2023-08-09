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
import T from 'i18n-react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { Diff, ChangedArray, DiffIndicator, IPipelineStage, ChangedObject } from '../types';
import { ADDED_REGEX, DELETED_REGEX, I18N_PREFIX } from '../constants';

function _flattenObject<T>(obj: T, name: string = '') {
  if (typeof obj !== 'object' && name === '') {
    return obj;
  }
  if (typeof obj !== 'object') {
    return { [name]: obj };
  }

  const flatObj: Record<string, any> = {};
  Object.keys(obj).forEach((keyName) => {
    const newKeyName = name !== '' ? `${name}.${keyName}` : keyName;
    Object.assign(flatObj, _flattenObject(obj[keyName], newKeyName));
  });
  return flatObj;
}

function _getModifiedArrayDiffRows<T extends any[]>(diff: ChangedArray<T>, name: string = '') {
  const namePrefix = name !== '' ? `${name}.` : '';
  return [].concat(
    ...diff.map((item, index) => {
      if (item[0] === ' ') {
        return [];
      }
      if (item[0] !== DiffIndicator.MODIFIED) {
        const flatDiffItem = _flattenObject(item[1], `${namePrefix}${index}`);
        return Object.keys(flatDiffItem).map((name) => ({
          name,
          oldValue: item[0] === DiffIndicator.DELETED ? flatDiffItem[name] : '-',
          newValue: item[0] === DiffIndicator.ADDED ? flatDiffItem[name] : '-',
        }));
      }
      return _getModifiedDiffRows(item[1], `${namePrefix}${index}`);
    })
  );
}

function _getModifiedObjectDiffRows<T>(diff: ChangedObject<T>, name: string = '') {
  if (typeof diff.__new === 'object' && typeof diff.__old === 'object') {
    return [
      {
        name,
        oldValue: JSON.stringify(diff.__old, null, 2),
        newValue: JSON.stringify(diff.__new, null, 2),
      },
    ];
  }
  if (typeof diff.__old === 'object') {
    const flatOld = _flattenObject(diff.__old, name);
    const oldEntries = Object.keys(flatOld).map((name) => ({
      name,
      oldValue: flatOld[name],
      newValue: '-',
    }));
    return [
      {
        name,
        oldValue: '-',
        newValue: diff.__new,
      },
      ...oldEntries,
    ];
  }
  if (typeof diff.__new === 'object') {
    const flatNew = _flattenObject(diff.__new, name);
    const newEntries = Object.keys(flatNew).map((name) => ({
      name,
      oldValue: '-',
      newValue: flatNew[name],
    }));
    return [
      {
        name,
        oldValue: diff.__old,
        newValue: '-',
      },
      ...newEntries,
    ];
  }
  return [
    {
      name,
      oldValue: diff.__old,
      newValue: diff.__new,
    },
  ];
}

function _getModifiedPropertyDiffRows<T>(diff: Diff<T>, name: string = '') {
  const namePrefix = name !== '' ? `${name}.` : '';
  return [].concat(
    ...Object.keys(diff).map((keyName) => {
      if (keyName.match(ADDED_REGEX)) {
        const name = `${namePrefix}${keyName.replace(ADDED_REGEX, '')}`;
        if (typeof diff[keyName] === 'object') {
          const flatAdded = _flattenObject(diff[keyName], name);
          return Object.keys(flatAdded).map((name) => ({
            name,
            oldValue: '-',
            newValue: flatAdded[name],
          }));
        }
        return [
          {
            name,
            oldValue: '-',
            newValue: diff[keyName],
          },
        ];
      }
      if (keyName.match(DELETED_REGEX)) {
        const name = `${namePrefix}${keyName.replace(DELETED_REGEX, '')}`;
        if (typeof diff[keyName] === 'object') {
          const flatDeleted = _flattenObject(diff[keyName], name);
          return Object.keys(flatDeleted).map((name) => ({
            name,
            oldValue: flatDeleted[name],
            newValue: '-',
          }));
        }
        return [
          {
            name,
            oldValue: diff[keyName],
            newValue: '-',
          },
        ];
      }
      return _getModifiedDiffRows(diff[keyName], `${namePrefix}${keyName}`);
    })
  );
}

function _getModifiedDiffRows<T>(diff: Diff<T>, name: string = '') {
  // An array in difference setting is represented as in `DiffArray` type. For that reason
  // if an element of the array is different, every element needs to be checked and
  // handled accordingly
  if (Array.isArray(diff)) {
    return _getModifiedArrayDiffRows(diff, name);
  }
  // If the object has changed types (like from an object to a string) or its primitive value
  // has changed, its diff will be of type `ChangedObject`.
  if (typeof diff === 'object' && '__old' in diff && '__new' in diff) {
    return _getModifiedObjectDiffRows(diff, name);
  }

  // If function call reaches to this point, the diff object has a property
  // that has been added, deleted or modified.
  return _getModifiedPropertyDiffRows(diff, name);
}

function getDiffRows(diffIndicator: DiffIndicator, diff: Diff<IPipelineStage>) {
  if (diffIndicator === DiffIndicator.DELETED || diffIndicator === DiffIndicator.ADDED) {
    const flatDiff = _flattenObject(diff);
    return Object.keys(flatDiff).map((name) => ({ name, value: flatDiff[name] as string }));
  }
  return _getModifiedDiffRows(diff);
}

const DiffInfoTableContainer = styled(TableContainer)`
  flex-grow: 1;
  max-width: 100%;
  width: 100%;
`;

interface IDiffInfoTableProps {
  diffIndicator: DiffIndicator;
  diff: Diff<IPipelineStage>;
}

export const DiffInfoTable = ({ diffIndicator, diff }: IDiffInfoTableProps) => {
  const diffRows = getDiffRows(diffIndicator, diff);
  return (
    <DiffInfoTableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>{T.translate(`${I18N_PREFIX}.table.name`)}</TableCell>
            {diffIndicator === DiffIndicator.MODIFIED ? (
              <>
                <TableCell align="right">{T.translate(`${I18N_PREFIX}.table.old`)}</TableCell>
                <TableCell align="right">{T.translate(`${I18N_PREFIX}.table.new`)}</TableCell>
              </>
            ) : (
              <TableCell align="right">{T.translate(`${I18N_PREFIX}.table.value`)}</TableCell>
            )}
          </TableRow>
        </TableHead>
        {diffRows.map((row) => {
          if (diffIndicator === DiffIndicator.MODIFIED) {
            return (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.oldValue}</TableCell>
                <TableCell align="right">{row.newValue}</TableCell>
              </TableRow>
            );
          }
          return (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ overflowWrap: 'anywhere' }} align="right">
                {row.value}
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </DiffInfoTableContainer>
  );
};
