import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: '216px',
    backgroundColor: '#fff',
    padding: '5px 5px 5px 30px',
    borderRadius: '0px',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  pos: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#5F6368',
  },
});

interface Props {
  cellValue: string;
}

const GridTextCell: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Typography className={classes.pos}>{props.cellValue}</Typography>
    </Card>
  );
};

export default GridTextCell;
