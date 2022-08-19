import { Box, Card, TableCell, Typography } from '@material-ui/core';
import React from 'react';
import { useGridKPICellStyles } from './styles';
import { IGridKPICellProps } from './types';

export const GridKPICell: React.FC<IGridKPICellProps> = ({ metricData }) => {
  const classes = useGridKPICellStyles();

  const { values } = metricData;

  return (
    <TableCell className={classes.tableHeaderCell}>
      <Card className={classes.root} variant="outlined">
        {values &&
          Array.isArray(values) &&
          values.length &&
          values.map((eachValue: { label: string; count: number }) => (
            <Box className={classes.KPICell} key={eachValue.label}>
              <Typography className={classes.posLeft}>{eachValue.label}</Typography>
              <Typography className={classes.posRight}>{eachValue.count}</Typography>
            </Box>
          ))}
      </Card>
    </TableCell>
  );
};
