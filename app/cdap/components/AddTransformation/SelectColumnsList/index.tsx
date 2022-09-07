import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  FormControl,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { COLUMNS, COLUMNS_SELECTED, DATA_QUALITY } from '../constants';
import { useStyles } from '../styles';
import SearchIcon from '@material-ui/icons/Search';
import { prepareDataQualtiy } from '../CircularProgressBar/utils';
import DataQualityProgress from '../CircularProgressBar';

const SelectColumnsList = (props) => {
  const { selectedColumnsCount, columnData, setSelectedColumns, dataQuality } = props;
  const [columns, setColumns] = useState(columnData);
  const [dataQualityValue, setDataQualityValue] = useState(dataQuality);
  const [selectedColumns, setSelectedColumn] = useState([]);
  const [focused, setFocused] = useState(false);
  const classes = useStyles();
  const ref = useRef(null);

  useEffect(() => {
    const getPreparedDataQuality = prepareDataQualtiy(dataQuality, columnData);
    setDataQualityValue(getPreparedDataQuality);
  }, []);

  const onSelect = (event, label, column) => {
    setSelectedColumns([column]);
    setSelectedColumn([column]);
  };

  const handleSearch = (event) => {
    if (event.target.value) {
      const columnValue = columnData.filter((el) =>
        el?.label.toLowerCase().includes(event.target.value.toLowerCase())
      );
      if (columnValue.length) {
        setColumns(columnValue);
      } else {
        setColumns([]);
      }
    } else {
      setColumns(columnData);
    }
  };

  const handleFocus = () => {
    ref?.current.focus();
    setFocused(true);
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
        <div className={classes.searchFormControl}>
          <input
            className={focused ? classes.isFocused : classes.isBlurred}
            onChange={handleSearch}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <SearchIcon className={classes.searchInputAdornment} onClick={handleFocus} />
        </div>
      </div>
      <TableContainer component={Box}>
        <Table aria-label="recipe steps table">
          <TableHead>
            <TableRow className={classes.recipeStepsTableRowStyles}>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}></TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {COLUMNS}
              </TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {DATA_QUALITY}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((eachColumn, index) => (
              <TableRow className={classes.recipeStepsTableBodyRowStyles} key={index}>
                <TableCell classes={{ body: classes.recipeStepsTableRowStyles }}>
                  <Radio
                    color="primary"
                    onChange={(e) => onSelect(e, eachColumn.label, eachColumn)}
                    checked={
                      selectedColumns.filter((el) => el.label == eachColumn.label).length
                        ? true
                        : false
                    }
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
                // className={[classes.recipeStepsTableRowStyles, classes.displayNone].join(' ')}
                >
                  {dataQualityValue?.length && (
                    <DataQualityProgress percentage={dataQualityValue[index]?.value} />
                  )}
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
