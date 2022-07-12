import React from 'react';
import { Table } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableContainer } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, styled } from '@material-ui/core';
import { headerData } from './GridTableData';
import GridHeaderCell from '../Grid/GridHeaderCell';
import { metricsData } from './GridTableData';
import GridKPICell from 'components/Grid/GridKPICell';
import { rowData } from './GridTableData';
import GridTextCell from 'components/Grid/GridTextCell';

const useStyles = makeStyles((theme) => ({
  tableHeaderCell: {
    padding: '0px',
    width: 'auto',
    fontSize: '14px',
    border: '1px solid #E0E0E0',
  },
  tableRowCell: {
    minWidth: '150.6px',
    border: '1px solid #E0E0E0',
    fontSize: '14px',
    width: 'auto',
    lineHeight: '21px',
    padding: '0px',
    borderBottom: '1px solid #E0E0E0',
    color: '#5F6368',
    boxSizing: 'content-box',
  },
}));

export default function GridTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Box}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {headerData.map((eachHeader) => (
              <TableCell className={classes.tableHeaderCell} key={eachHeader.label}>
                <GridHeaderCell label={eachHeader.label} types={eachHeader.types} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {metricsData.map((each) => (
              <TableCell className={classes.tableHeaderCell} key={each.name}>
                <GridKPICell metricData={each} />
              </TableCell>
            ))}
          </TableRow>
          {rowData.map((eachRow, index) => {
            return (
              <TableRow key={index * Math.random()}>
                {Object.keys(eachRow).map((eachKey, indexKey) => (
                  <TableCell className={classes.tableRowCell} key={index * indexKey}>
                    <GridTextCell cellValue={eachRow[eachKey]} />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
