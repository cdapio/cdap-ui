import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { default as React, useEffect } from 'react';
import { useParams } from 'react-router';
import BreadCumb from './components/Breadcrumb';
import { GridHeaderCell } from './components/GridHeaderCell';
import { GridKPICell } from './components/GridKPICell';
import { GridTextCell } from './components/GridTextCell';
import mockJSON from './mock/apiMock';
import metricsJSON from './mock/metrics';

const GridTable = () => {
  const { datasetName } = useParams() as any;

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

  const getGridTableData = async () => {
    const fetchedResponse = await mockJSON;
    const rawData = fetchedResponse.response;

    const headersData = createHeadersData(rawData.headers, rawData.values[0], rawData.types);
    setHeadersNamesList(headersData);

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
    <>
      <BreadCumb datasetName={datasetName} />
      <TableContainer component={Box}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {headersNamesList.map((eachHeader) => (
                <GridHeaderCell
                  label={eachHeader.label}
                  types={eachHeader.type}
                  key={eachHeader.name}
                />
              ))}
            </TableRow>
            <TableRow>
              {metricsJSON.map((each) => (
                <GridKPICell metricData={each} key={each.name} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsDataList.map((eachRow, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {Object.keys(eachRow).map((eachKey, keyIndex) => (
                  <GridTextCell cellValue={eachRow[eachKey]} key={`${eachKey}-${keyIndex}`} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GridTable;
