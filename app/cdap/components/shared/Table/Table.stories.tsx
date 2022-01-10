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
import Table from '.';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TableBody from './TableBody';

export default {
  title: 'Listing Table',
  component: Table,
};

export const TableStory = ({ data, headers, columnTemplate, ...args }) => {
  return (
    <Table columnTemplate={columnTemplate}>
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableCell>{h}</TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow>
            {row.map((cell) => (
              <TableCell>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

TableStory.args = {
  headers: ['Name', 'Score', 'Start Date'],
  columnTemplate: '2fr 1fr 2fr',
  data: [
    ['Bob', 85, '2020-05-25'],
    ['Li-ren', 92, '2021-01-29'],
    ['Vaibhav', 89, '2018-10-15'],
  ],
};
