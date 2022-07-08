import React from 'react';
import { Box, Card, Typography, makeStyles, styled } from '@material-ui/core';
import { Icon } from '@material-ui/core';
import { prevPage } from 'components/PipelineList/DeployedPipelineView/store/ActionCreator';

interface IWranglerCardProps {
  name: string;
  image: any;
}

const WranglerCard: React.FC<IWranglerCardProps> = (props) => {
  const useStyles = makeStyles(() => ({
    cardWrapper: {
      height: '150px',
      backgroundColor: '#F3F6F9',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '0px',
      margin: '0px',
      padding: '0px',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        boxShadow: '3px 4px 15px rgba(68, 132, 245, 0.15)',
      },
    },
    connectionImage: {
      width: '200px',
    },
    connectionName: {
      fontSize: '14px',
      lineHeight: '21px',
      fontWeight: 400,
      letterSpacing: '0.15px',
      marginTop: '7px',
    },
  }));

  const CusotmBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const classes = useStyles();

  const IconRen = props.image;

  // console.log(props, "check props");

  return (
    <Box className={classes.cardWrapper}>
      <CusotmBox>
        {IconRen}
        {/* <img src={IconRen} className={classes.connectionImage} /> */}
        <Typography variant="body1" className={classes.connectionName}>
          {props.name}
        </Typography>
      </CusotmBox>
    </Box>
  );
};

export default WranglerCard;
