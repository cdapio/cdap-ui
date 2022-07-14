import React, { useEffect, useState } from 'react';
import { Table } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableContainer } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Box, styled } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import CachedIcon from '@material-ui/icons/Cached';

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: 1054,
    marginLeft: '30px',
    marginRight: '30px',
  },
  tableHeaderCell: {
    padding: '15px 0px 15px 10px',
    borderBottom: '1px solid #5F6368',
    marginRight: '50px !important',
    width: 'auto',
    fontSize: '14px',
    minWidth: '150.6px',
  },
  tableRowCell: {
    fontSize: '14px',
    width: 'auto',
    lineHeight: '21px',
    padding: '15px 0px 15px 10px',
    paddingLeft: '10px',
    borderBottom: '1px solid #E0E0E0',
    color: '#5F6368',
    '& > :nth-last-child(1)': {
      minWidth: '80px',
    },
    boxSizing: 'content-box',
  },
  tableRow: {
    paddingLeft: '10px',
    '&:hover': {
      backgroundColor: '#EFF0F2',
    },
  },
  link: {
    marginRight: '10px',
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
  },
  wrangleBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '30px',
  },
  onlineIndicator: {
    height: '8px',
    width: '8px',
    minWidth: '8px !important',
    maxWidth: '8px !important',
    backgroundColor: 'green',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '10px',
  },
  offlineIndicator: {
    height: '8px',
    width: '8px',
    minWidth: '8px !important',
    maxWidth: '8px !important',
    backgroundColor: '#fff',
    border: '1px solid #000000',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '10px',
  },
}));

function createData(
  name,
  fileFormat = 'CSV',
  schema = 4,
  lastUpdated = 20,
  connectionName = 'BigQ-Sales-connection',
  connectionStatus = 'online',
  lastAvailable = 10,
  showWrangle = false
) {
  return {
    name,
    fileFormat,
    schema,
    lastUpdated,
    connectionName,
    connectionStatus,
    lastAvailable,
    showWrangle,
  };
}

const OnlineIndicator = ({ classes }) => <span className={classes.onlineIndicator}></span>;
const OfflineIndicator = ({ classes }) => <span className={classes.offlineIndicator}></span>;

const RefreshIcon = styled(CachedIcon)({
  display: 'inline',
  marginLeft: '20px',
  cursor: 'pointer',
  '& :hover': {
    fontSize: 'large',
    color: 'blueviolet',
  },
});

const DataTable = (props) => {
  console.log('DataTable props: ', props);

  const [rows, setSelectedRow] = useState([]);

  useEffect(() => {
    if (props.datasetList) {
      setSelectedRow(
        props.datasetList.map((dataset) => {
          return createData(dataset.name);
        })
      );
    }
  }, [props.datasetList]);

  const classes = useStyles();
  const handleMouseLeave = (event, name) => {
    const selectedRowIndex = rows.findIndex((row) => row.name === name);
    const newRows = [...rows];
    newRows[selectedRowIndex].showWrangle = false;
    setSelectedRow(newRows);
  };
  const handleMouseEnter = (event, name) => {
    const selectedRowIndex = rows.findIndex((row) => row.name === name);
    const newRows = [...rows];
    newRows[selectedRowIndex].showWrangle = true;
    setSelectedRow(newRows);
  };

  const headersList = [
    'Dataset name',
    'File format',
    'Schema',
    'Last updated',
    'Connection name',
    'Connection Status',
    '',
  ];

  return (
    <TableContainer component={Box}>
      <Table aria-label="simple table" className={classes.table}>
        <TableHead>
          <TableRow>
            {headersList.map((header) => (
              <TableCell className={classes.tableHeaderCell}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              className={classes.tableRow}
              onMouseEnter={(event) => handleMouseEnter(event, row.name)}
              onMouseLeave={(event) => handleMouseLeave(event, row.name)}
            >
              <TableCell className={classes.tableRowCell}>{row.name}</TableCell>
              <TableCell className={classes.tableRowCell}>{row.fileFormat}</TableCell>
              <TableCell className={classes.tableRowCell}>
                {row.schema}
                {' Columns'}
              </TableCell>
              <TableCell className={classes.tableRowCell}>
                {row.lastUpdated}
                {' days ago'}
              </TableCell>
              <TableCell className={classes.tableRowCell}>{row.connectionName}</TableCell>
              <TableCell className={classes.tableRowCell}>
                <Box>
                  {row.connectionStatus === 'online' ? (
                    <OnlineIndicator classes={classes} />
                  ) : (
                    <OfflineIndicator classes={classes} />
                  )}
                  {row.lastAvailable}
                  {' days ago'}
                  {row.showWrangle && <RefreshIcon />}
                </Box>
              </TableCell>
              <TableCell className={classes.tableRowCell}>
                <Box className={classes.wrangleBox}>
                  {row.showWrangle && (
                    <Link className={classes.link} component="button" variant="body2">
                      Wrangle
                    </Link>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DataTable;
