/*
 * Copyright © 2020 Cask Data, Inc.
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

import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { ITable } from 'components/Replicator/Create/Content/Assessment/TablesAssessment';
import { getTableDisplayName } from 'components/Replicator/utilities';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import ViewMappingButton from 'components/Replicator/Create/Content/Assessment/TablesAssessment/ViewMappingButton';

const styles = (theme): StyleRules => {
  return {
    text: {
      marginBottom: '10px',
      color: theme.palette.grey[100],
    },
  };
};

interface INoIssuesTablesProps extends WithStyles<typeof styles> {
  tables: ITable[];
  setOpenTable: (table: ITable) => void;
}

const NoIssuesTablesView: React.FC<INoIssuesTablesProps> = ({ classes, tables, setOpenTable }) => {
  if (tables.length === 0) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        {tables.length} tables have been assessed with no schema issues
      </div>

      <Table columnTemplate="150px 150px 1fr">
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell textAlign="right">Number of columns</TableCell>
            <TableCell />
          </TableRow>
        </TableHeader>

        <TableBody>
          {tables.map((row: ITable) => {
            const tableDisplayName = getTableDisplayName(row);

            return (
              <TableRow key={`${row.database}-${row.table}`}>
                <TableCell>{tableDisplayName}</TableCell>
                <TableCell textAlign="right">{row.numColumns}</TableCell>
                <TableCell textAlign="right">
                  <ViewMappingButton onClick={() => setOpenTable(row)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const NoIssuesTables = withStyles(styles)(NoIssuesTablesView);
export default NoIssuesTables;
