import { Box, styled, Typography } from '@material-ui/core';
import React from 'react';
import { GetIcon } from '../iconStore';
import { useWelcomeCardComponentStyles } from './styles';

const WelcomeCardContainer = styled(Box)({
  display: 'flex',
  paddingTop: '18px',
});

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  marginLeft: '36px',
});

const WelcomeCardComponent: React.FC = () => {
  const classes = useWelcomeCardComponentStyles();
  const welcomeIcon = GetIcon('welcomeIcon');
  return (
    <WelcomeCardContainer>
      <Box>{welcomeIcon}</Box>
      <StyledBox>
        <Typography className={classes.welcomeText}>Hi David</Typography>
        <Typography className={classes.welcomeText}>Welcome to Wrangler</Typography>
      </StyledBox>
    </WelcomeCardContainer>
  );
};

export default WelcomeCardComponent;
