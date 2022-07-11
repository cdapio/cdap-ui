import React from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: '216px',
    // maxWidth: '202px',
    width: 'fit-content',
    backgroundColor: '#fff',
    padding: '10px 10px 10px 30px',
    borderRadius: '0px',
    display: 'flex',
    flexDirection: 'column',
  },
  KPICell: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '5px',
  },
  posRight: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: 'red',
  },
  posLeft: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
});

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

const GridKPICell = () => {
  const classes = useStyles();
  const metricOne = 'KPI Name';
  const metricTwo = 'KPI Name';
  const metricOneValue = 794;
  const metricTwoValue = 142;

  return (
    <Card className={classes.root} variant="outlined">
      <Box className={classes.KPICell}>
        <Typography className={classes.posLeft}>{metricOne}</Typography>
        <Typography className={classes.posRight}>{metricOneValue}</Typography>
      </Box>
      <Box className={classes.KPICell}>
        <Typography className={classes.posLeft}>{metricTwo}</Typography>
        <Typography className={classes.posRight}>{metricTwoValue}</Typography>
      </Box>
    </Card>
  );
};

export default GridKPICell;
