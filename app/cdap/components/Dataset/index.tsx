import * as React from 'react';
import ConnectionTabsCaller from './ConnectionTabsCaller';
import { getCategorizedConnections } from '../Connections/Browser/SidePanel/apiHelpers';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';

import { fetchConnectors } from 'components/Connections/Create/reducer';

const DatasetsListComponent = () => {
  const [selectedConnectorData, setSelectedConnectorData] = useState([]);

  const loc = useLocation();
  const [initialConnectionId] = useState('');
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [currentConnection, setCurrentConnection] = useState(initialConnectionId);

  const [selectedDataset, setSelectedDataset] = useState([]);

  const selectedTabValueHandler = (selectedValue) => {
    console.log(selectedValue);
    setCurrentConnection(selectedValue);
  };
  const [path, setPath] = useState(pathFromUrl);
  const fetchEntities = async (connectionid = 'qa') => {
    setLoading(true);
    try {
      Promise.all([await exploreConnection({ connectionid, path })]).then((values) => {
        const dataArray = [];
        values.map((each) => each.entities.forEach((eachentity) => dataArray.push(eachentity)));
        setData(dataArray);
      });
    } catch (e) {
      setError(`Failed to explore connection. Error: "${e.response}"`);
    }
  };
  useEffect(() => {
    initState();
  }, []);
  useEffect(() => {
    console.log(data, 'data');
  }, [data]);

  useEffect(() => {
    console.log(currentConnection);
  }, [currentConnection]);
  const initState = async () => {
    const connectorTypes = await fetchConnectors();
    const categorizedConnections = await getCategorizedConnections();
    console.log('Categorized connections', categorizedConnections);

    connectorTypes.forEach((connectorType, index) => {
      const connections = categorizedConnections.get(connectorType.name) || [];

      connections.forEach((connection) => {
        if (connection?.connectionId !== undefined) {
          const newElement = {
            connectionType: connection.connectionType,
            datasetName: connection.connectionId,
          };
          console.log(newElement);
          // console.log(connection?.connectionId);
          // setSelectedDataset(...selectedDataset,{connectorType:connection,})
        }
      });
    });
  };
  return (
    <>
      <div>
        <ConnectionTabsCaller selectedTabValueHandler={selectedTabValueHandler} />
      </div>
      <div>{/* Dataset Table Component to Come here */}</div>
    </>
  );
};

export default DatasetsListComponent;
