import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@material-ui/core';
import React, { useState } from 'react';
import { COLUMNS, COLUMNS_SELECTED, DATA_QUALITY } from '../constants';
import { useStyles } from '../styles';

// const columnsData = [
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
//   {
//     label: 'Customer name',
//     domainType: 'ABC',
//     dataType: 'String',
//     dataQuality: '65',
//     isSelected: false,
//   },
// ];

const SelectColumnsList = (props) => {
  const { selectedColumnsCount, columnData, setSelectedColumns } = props;
  const [columns, setColumns] = useState(columnData);
  const [selectedColumns, setSelectedColumn] = useState([]);
  const classes = useStyles();

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedColumns(columns);
      setSelectedColumn(columns);
      return;
    }
    setSelectedColumns([]);
    setSelectedColumn([]);
  };

  const onSelect = (event, label, column) => {
    const selectColumnArray = [...selectedColumns];
    const findIndexOfCurrent = selectedColumns.findIndex((el) => el?.label == label);
    if (findIndexOfCurrent > -1) {
      selectColumnArray.splice(findIndexOfCurrent, 1);
      setSelectedColumns(selectColumnArray);
      setSelectedColumn(selectColumnArray);
    } else {
      selectColumnArray.push(column);
      setSelectedColumns(selectColumnArray);
      setSelectedColumn(selectColumnArray);
    }
  };

  return (
    <section className={classes.columnsCountTextStyles}>
      <div className={classes.selectColumnsHeaderStyles}>
        <div>
          {selectedColumnsCount
            ? selectedColumnsCount > 10
              ? selectedColumnsCount
              : `0${selectedColumnsCount}`
            : 'No '}{' '}
          &nbsp;{COLUMNS_SELECTED}
        </div>
        <img src="/cdap_assets/img/search.svg" alt="search" />
      </div>
      <TableContainer component={Box}>
        <Table aria-label="recipe steps table">
          <TableHead>
            <TableRow className={classes.recipeStepsTableRowStyles}>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedColumns.length > 0 && selectedColumns.length < columns.length
                  }
                  checked={columns.length > 0 && selectedColumns.length === columns.length}
                  onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all columns',
                  }}
                />
              </TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {COLUMNS}
              </TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {DATA_QUALITY}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((eachColumn, index) => (
              <TableRow className={classes.recipeStepsTableBodyRowStyles} key={index}>
                <TableCell classes={{ body: classes.recipeStepsTableRowStyles }}>
                  <Checkbox
                    color="primary"
                    onChange={(e) => onSelect(e, eachColumn.label, eachColumn)}
                  />
                </TableCell>
                <TableCell
                  classes={{ body: classes.recipeStepsTableRowStyles }}
                  // component="th"
                  // scope="row"
                >
                  <span className={classes.recipeStepsActionTypeStyles}>{eachColumn.label}</span>
                  &nbsp;
                  <br />
                  {eachColumn.type}
                </TableCell>
                <TableCell
                  className={[classes.recipeStepsTableRowStyles, classes.displayNone].join(' ')}
                >
                  <img
                    className={classes.recipeStepsDeleteStyles}
                    src="/cdap_assets/img/delete.svg"
                    alt="delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default SelectColumnsList;
