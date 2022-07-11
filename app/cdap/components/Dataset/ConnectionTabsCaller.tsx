import React, { useState, useEffect } from 'react';
import ConnectionsTabs from './ConnectionTabs';
import GCSIcon from './SVGs/GCSIcon';
import AllConnectionsIcon from './SVGs/AllConnectionsIcon';
import {
  fetchAllConnectorPluginProperties,
  fetchConnectors,
  getMapOfConnectorToPluginProperties,
} from 'components/Connections/Create/reducer';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';

interface IConnectorTypes {
  name: string;
  type: string;
  category: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}

interface ConnectionTabSidePanel {
  connectorTypes: IConnectorTypes[];
  mapOfConnectorPluginProperties: { [key: string]: any };
}

const ConnectionTabsCaller = ({ selectedTabValueHandler }) => {
  const [value, setValue] = React.useState('All Connections');
  const [state, setState] = useState<ConnectionTabSidePanel>({
    connectorTypes: [],
    mapOfConnectorPluginProperties: null,
  });
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
    selectedTabValueHandler(newValue);
  };
  const getConnectionTabData = async () => {
    let connectorTypes = await fetchConnectors();
    const categorizedConnections = await getCategorizedConnections();

    connectorTypes = connectorTypes.filter((conn) => {
      return [conn.name];
    });

    const allConnectorsPluginProperties = await fetchAllConnectorPluginProperties(connectorTypes);
    const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
      allConnectorsPluginProperties
    );

    let allConnectionsTotalLength = 0;

    connectorTypes = connectorTypes.map((connectorType) => {
      const connections = categorizedConnections.get(connectorType.name) || [];
      allConnectionsTotalLength = allConnectionsTotalLength + connections.length;

      return {
        ...connectorType,
        count: connections.length,
        SVG: <GCSIcon />,
      };
    });

    connectorTypes.unshift({
      name: 'All Connections',
      type: 'default',
      category: 'default',
      description: 'All Connections from the List',
      artifact: {
        name: 'allConnections',
        version: 'local',
        scope: 'local',
      },
      count: allConnectionsTotalLength,
      SVG: <AllConnectionsIcon />,
    });

    setState({
      connectorTypes,
      mapOfConnectorPluginProperties,
    });
  };

  useEffect(() => {
    getConnectionTabData();
  }, []);

  return (
    <ConnectionsTabs
      connectorTypes={state.connectorTypes}
      handleChange={handleChange}
      value={value}
    />
    // <DatasetTableApiComponentCaller/>
  );
};

export default ConnectionTabsCaller;
