import React, { useEffect } from 'react';
import { Table } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableContainer } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import GridHeaderCell from '../Grid/GridHeaderCell';
import { metricsData } from './GridTableData';
import GridKPICell from 'components/Grid/GridKPICell';
import GridTextCell from 'components/Grid/GridTextCell';
import mockJSON from './gridTableResponse';

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
  const [headersNamesList, setHeadersNamesList] = React.useState([]);
  const [rowsDataList, setRowsDataList] = React.useState([]);

  const createHeadersData = (columnNamesList, columnLabelsList, columnTypesList) => {
    return columnNamesList
      .map((eachColumnName) => {
        return {
          name: eachColumnName,
          label: columnLabelsList[eachColumnName],
          type: [columnTypesList[eachColumnName]],
        };
      })
      .slice(1);
  };

  const getMetricsData = () => {
    return headersNamesList.map((eachHeader) => {
      return;
    });
  };

  const getGridTableData = async () => {
    const fetchedResponse = await mockJSON;
    const rawData = fetchedResponse.response;

    const headersData = createHeadersData(rawData.headers, rawData.values[0], rawData.types);
    setHeadersNamesList(headersData);

    const metricsData = getMetricsData();

    const rowData = rawData.values.slice(1).map((eachRow) => {
      const { body, ...rest } = eachRow;
      return rest;
    });

    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
  }, []);

  return (
    <TableContainer component={Box}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {headersNamesList.map((eachHeader) => (
              <TableCell className={classes.tableHeaderCell} key={eachHeader.name}>
                <GridHeaderCell label={eachHeader.label} types={eachHeader.type} />
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
          {rowsDataList.map((eachRow, index) => {
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
