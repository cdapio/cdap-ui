import React from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: '216px',
    width: 'fit-content',
    // maxWidth: '202px',
    padding: '10px 0px 10px 30px',
    borderRadius: '0px',
    backgroundImage:
      'linear-gradient(0deg, rgba(70, 129, 244, 0) -49.23%, rgba(70, 129, 244, 0.1) 100%)',
  },
  posRight: {
    marginLeft: '2px',
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
  posLeft: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#5F6368',
  },
  pos: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: '#000000',
    marginBottom: '5px',
  },
});

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

const GridHeaderCell = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Typography className={classes.pos}>{'Customer Name'}</Typography>
      <StringIndicatorBox>
        <Typography className={classes.posLeft} color="textSecondary">
          {'ABC'}
        </Typography>
        <StringIndicatorBox>
          <Typography className={classes.posRight} color="textSecondary">
            {'|'}
          </Typography>
          <Typography className={classes.posRight} color="textSecondary">
            {'Credit Card'}
          </Typography>
        </StringIndicatorBox>
      </StringIndicatorBox>
    </Card>
  );
};
export default GridHeaderCell;
