import { Box, Card, styled, TableCell, Typography } from '@material-ui/core';
import React from 'react';
import { TypographyComponent } from '../Typography';
import { useGridHeaderCellStyles } from './styles';
import { IGridHeaderCellProps } from './types';

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
