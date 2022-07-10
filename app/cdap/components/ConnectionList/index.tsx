import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import WranglerCard from './WranglerCard';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { GetConnectionIcon, GetIcon } from './IconStore';
import WelcomeCard from './WelcomeCard';

const useStyles = makeStyles(() => ({
  flexContainer: {
    paddingTop: '18px',
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#F3F6F9',
    width: '100%',
    height: '100%',
    '& > :nth-child(3n+1)': {
      borderRight: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      width: '160px',
    },
    '& > :nth-child(3n+2)': {
      borderBottom: '1px solid #E3E3E3',
      width: '180px',
    },
    '& > :nth-child(3n)': {
      borderLeft: '1px solid #E3E3E3',
      borderBottom: '1px solid #E3E3E3',
      width: '160px',
    },
    '& > :nth-last-child(1)': {
      borderBottom: '0px',
    },
    '& > :nth-last-child(2)': {
      borderBottom: '0px',
    },
    '& > :nth-last-child(3)': {
      borderBottom: '0px',
    },
  },
  dashBoard: {
    padding: '18px 59px 18px 60px',
    backgroundColor: '#F3F6F9',
    maxWidth: '620px',
    border: '0px',
    borderRight: '1px dashed #DADCE0',
  },
}));

const ConnectionContainer = () => {
  const classes = useStyles();

  const [connectionsList, setConnectionsList] = useState([]);

  const getConnectorDetails = async () => {
    // Define Default Card types which are not coming from API
    let connectorsData = [{ name: 'New Exploration' }, { name: 'Imported Datasets' }];
    let connectorsDetails = [];
    // fetching the list of connections
    const connectorsDataFected = await fetchConnectors();
    connectorsData = [...connectorsData, ...connectorsDataFected];
    // creating list of connector's name & corresponding icon
    connectorsDetails = connectorsData.map((connector) => {
      const eachConnector = {
        name: connector.name,
        image: GetConnectionIcon(connector.name),
      };
      return eachConnector;
    });
    setConnectionsList((prev) => [...prev, ...connectorsDetails]);
  };

  useEffect(() => {
    getConnectorDetails();
  }, []);

  return (
    <>
      <Paper variant="outlined" elevation={9} className={classes.dashBoard}>
        <WelcomeCard />
        <Paper elevation={0} className={classes.flexContainer}>
          {connectionsList.map((connection) => (
            <WranglerCard key={connection.name} name={connection.name} image={connection.image} />
          ))}
        </Paper>
      </Paper>
    </>
  );
};

export default ConnectionContainer;
