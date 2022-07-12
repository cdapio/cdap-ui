import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import { GridHeaderCell, GridKPICell, GridTextCell } from './helpers';
import { metricsData } from './mock/gridTableData';
import mockJSON from './mock/gridTableResponse';

const GridTable = () => {

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
              <GridHeaderCell label={eachHeader.label} types={eachHeader.type} key={eachHeader.name} />
            ))}
          </TableRow>
          <TableRow>
            {metricsData.map((each) => (
              <GridKPICell metricData={each} key={each.name} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsDataList.map((eachRow, index) => {
            return (
              <TableRow key={index * Math.random()}>
                {Object.keys(eachRow).map((eachKey, indexKey) => (
                  <GridTextCell cellValue={eachRow[eachKey]} key={index * indexKey} />
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GridTable