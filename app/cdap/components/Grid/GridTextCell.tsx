import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: '100px',
    maxWidth: '250px',
    backgroundColor: '#fff',
    padding: '5px 5px 5px 30px',
    borderRadius: '0px',
    display: 'flex',
    flexDirection: 'column',
  },
  pos: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#5F6368',
  },
});

const GridTextCell = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Typography className={classes.pos}>{'Kathy Albertson'}</Typography>
    </Card>
  );
};

export default GridTextCell;
