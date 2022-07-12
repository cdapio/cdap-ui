import React from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: '216px',
    width: 'fit-content',
    backgroundColor: '#fff',
    padding: '10px 10px 0px 30px',
    borderRadius: '0px',
    border: 'none',
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

interface Props {
  metricData: {
    name: string;
    values: Array<{ label: string; count: number }>;
  };
}

const GridKPICell: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { values } = props.metricData;
  const metricOne = values[0].label;
  const metricTwo = values[1].label;
  const metricOneValue = values[0].count;
  const metricTwoValue = values[0].count;

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
