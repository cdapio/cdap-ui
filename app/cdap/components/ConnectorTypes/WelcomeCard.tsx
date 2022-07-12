import React from 'react';
import { GetIcon } from './IconStore';
import { Box, styled, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  welcomeText: {
    fontSize: '24px',
    fontWeight: 500,
    height: '36px',
  },
}));

const WelcomeCardContainer = styled(Box)({
  display: 'flex',
  paddingTop: '18px',
});

const CustomBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  marginLeft: '36px',
});

const WelcomeCard = () => {
  const classes = useStyles();
  const welcomeIcon = GetIcon('welcomeIcon');
  return (
    <WelcomeCardContainer>
      <Box>{welcomeIcon}</Box>
      <CustomBox>
        <Typography className={classes.welcomeText}>Hi David</Typography>
        <Typography className={classes.welcomeText}>Welcome to Wrangler</Typography>
      </CustomBox>
    </WelcomeCardContainer>
  );
};

export default WelcomeCard;
