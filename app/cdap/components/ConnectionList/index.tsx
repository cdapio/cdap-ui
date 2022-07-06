import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { data } from './connectionsData.js';
import WranglerCard from './WranglerCard';
import SearchConnection from './SearchConnection';
import ButtonAppBar from './Header';
import { ApiTest } from './Test.js';

const ConnectionContainer = () => {
  const useStyles = makeStyles(() => ({
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '0 20px',
      backgroundColor: '#F0EBE3',
      width: '35%',
      height: '100%',
      // justifyContent: 'center',
    },
  }));

  const classes = useStyles();

  const imageUrl = 'https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg';
  const fetchConnectionsData = (rawData) => {
    const listOfConnection = rawData.map((eachConnection) => {
      return {
        name: eachConnection.name,
        imageUrl,
      };
    });
    return listOfConnection;
  };

  const ConnectionsList = fetchConnectionsData(data.response);

  return (
    <div>
      <ApiTest />
      <ButtonAppBar />
      <SearchConnection />
      <Paper variant="outlined" elevation={9} className={classes.flexContainer}>
        {ConnectionsList.map((connection) => (
          <WranglerCard
            key={connection.name}
            name={connection.name}
            imageUrl={connection.imageUrl}
          />
        ))}
      </Paper>
    </div>
  );
};

export default ConnectionContainer;
