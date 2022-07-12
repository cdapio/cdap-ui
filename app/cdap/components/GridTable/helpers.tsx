import { Box, Card, styled, TableCell, Typography } from '@material-ui/core';
import React from 'react';
import { useGridHeaderCellStyles, useGridKPICellStyles, useGridTextCellStyles } from './styles';
import { IGridHeaderCellProps, IGridKPICellProps, IGridTextCellProps } from './types';

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

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

export const GridHeaderCell: React.FC<IGridHeaderCellProps> = ({ label, types }) => {
  const classes = useGridHeaderCellStyles();

  const [data, setData] = React.useState<Record<string, string>>({
    datatype1: types.length > 0 ? types[0] : null,
    datatype2: types.length > 1 ? types[1] : null,
  });

  return (
    <TableCell className={classes.tableHeaderCell}>
      <Card className={classes.root} variant="outlined">
        <Typography className={classes.pos}>{label}</Typography>
        <StringIndicatorBox>
          <TypographyComponent className={classes.posLeft} label={data?.datatype1} />
          {data.datatype2 && (
            <StringIndicatorBox>
              <TypographyComponent className={classes.posRight} label={'|'} />
              <TypographyComponent className={classes.posRight} label={data?.datatype2} />
            </StringIndicatorBox>
          )}
        </StringIndicatorBox>
      </Card>
    </TableCell>
  );
};

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

export const TypographyComponent = ({ className, label }) => (
  <Typography className={className} color="textSecondary">
    {label}
  </Typography>
);
