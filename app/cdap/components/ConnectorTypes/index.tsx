import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import WranglerCard from './ConnectorTypeCard';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { GetConnectionIcon } from './IconStore';
import WelcomeCard from './WelcomeCard';
import { defaultConnectorTypes } from 'components/WrangleHome/constants/defaultConnectorTypes';

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

const ConnectorTypesComponent = () => {
  const classes = useStyles();

  const [connectorTypesList, setConnectorTypesList] = useState([]);

  const fetchConnectorTypeDetails = async () => {
    // fetching the list of connector types
    const fetchedConnectorTypes = await fetchConnectors();
    const connectorTypes = [...defaultConnectorTypes, ...fetchedConnectorTypes];

    // creating list of connector's name & corresponding icon
    const connectorTypesWithImage = connectorTypes.map((connector) => ({
      name: connector.name,
      image: GetConnectionIcon(connector.name),
    }));
    setConnectorTypesList((prev) => [...prev, ...connectorTypesWithImage]);
  };

  useEffect(() => {
    fetchConnectorTypeDetails();
  }, []);

  return (
    <>
      <Paper variant="outlined" elevation={9} className={classes.dashBoard}>
        <WelcomeCard />
        <Paper elevation={0} className={classes.flexContainer}>
          {connectorTypesList.map((eachConnectorType) => (
            <WranglerCard
              key={eachConnectorType.name}
              name={eachConnectorType.name}
              image={eachConnectorType.image}
            />
          ))}
        </Paper>
      </Paper>
    </>
  );
};

export default ConnectorTypesComponent;
