import React from 'react';
import { COLUMNS_SELECTED } from '../constants';
import { useStyles } from '../styles';

const SelectedColumnCountWidget = (props) => {
  const { selectedColumnsCount } = props;
  const classes = useStyles();

  return (
    <div className={classes.columnsCountTextStyles}>
      {selectedColumnsCount
        ? selectedColumnsCount > 10
          ? selectedColumnsCount
          : `0${selectedColumnsCount}`
        : 'No '}{' '}
      &nbsp;{COLUMNS_SELECTED}
    </div>
  );
};

export default SelectedColumnCountWidget;
