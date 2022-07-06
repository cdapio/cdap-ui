import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  createTheme,
  ThemeProvider,
  styled,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { blue } from '@material-ui/core/colors';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Box from '@material-ui/core/Box';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: blue[500],
    },
  },
});

const HeaderBox = styled(Box)({
  marginLeft: 'auto',
});

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: '2px',
    },
    title: {
      marginRight: '30px',
    },
    headerLogo: {
      width: '40px',
    },
    tabStyle: {
      minWidth: '80px',
    },
    button: {
      marginLeft: 'auto',
    },
  })
);

export default function ButtonAppBar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <img
                className={classes.headerLogo}
                src="https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg"
                alt="logo"
              />
            </IconButton>
            <Typography variant="h3" className={classes.title}>
              Wrangler
            </Typography>
            <Tabs
              value={value}
              textColor="secondary"
              indicatorColor="secondary"
              onChange={handleChange}
            >
              <Tab label="Home" className={classes.tabStyle} />
              <Tab label="Connections" className={classes.tabStyle} />
              <Tab label="Recipe" className={classes.tabStyle} />
            </Tabs>
            <HeaderBox>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <ViewComfyIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                className={classes.button}
                startIcon={<PermIdentityIcon />}
                endIcon={<ArrowDropDownIcon />}
              >
                Siva R
              </Button>
            </HeaderBox>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
}
