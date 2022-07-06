import React from 'react';
import { Box, Card, Typography, makeStyles, styled } from '@material-ui/core';

interface IWranglerCardProps {
  name: string;
  imageUrl: string;
}

const WranglerCard: React.FC<IWranglerCardProps> = (props) => {
  // console.log('props', props);
  const useStyles = makeStyles(() => ({
    cardWrapper: {
      marginTop: '10px',
      marginRight: '10px',
      width: '30%',
      height: '100px',
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
    connectionImage: {
      width: '40px',
    },
  }));

  const CusotmBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.cardWrapper}>
      <CusotmBox>
        <img src={props.imageUrl} alt="card" className={classes.connectionImage} />
        <Typography variant="body1">{props.name}</Typography>
      </CusotmBox>
    </Card>
  );
};

export default WranglerCard;
