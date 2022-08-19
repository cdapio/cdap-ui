import { Card, TableCell, Typography } from '@material-ui/core';
import React from 'react';
import { useGridTextCellStyles } from './styles';
import { IGridTextCellProps } from './types';

export const GridTextCell: React.FC<IGridTextCellProps> = ({ cellValue }) => {
  const classes = useGridTextCellStyles();

  return (
    <TableCell className={classes.tableRowCell}>
      <Card className={classes.root} variant="outlined">
        <Typography className={classes.pos}>{cellValue}</Typography>
      </Card>
    </TableCell>
  );
};
