import React from 'react';
import { GetIcon } from './IconStore';
import { Box, styled, Typography } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const THEME = createTheme({
  typography: {
    allVariants: {
      fontSize: 24,
      fontFamily: 'Noto Sans',
      fontWeight: 500,
      letterSpacing: '0.15px',
      lineHeight: '36px',
    },
  },
});

const WelcomeCardContainer = styled(Box)({
  display: 'flex',
  paddingTop: '18px',
});

const CustomBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '36px',
});

const WelcomeCard = () => {
  const welcomeIcon = GetIcon('welcomeIcon');
  return (
    <ThemeProvider theme={THEME}>
      <WelcomeCardContainer>
        <Box>{welcomeIcon}</Box>
        <CustomBox>
          <Typography>Hi David</Typography>
          <Typography>Welcome to Wrangler</Typography>
        </CustomBox>
      </WelcomeCardContainer>
    </ThemeProvider>
  );
};

export default WelcomeCard;
