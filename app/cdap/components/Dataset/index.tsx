import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import {
  fetchAllConnectorPluginProperties,
  fetchConnectors,
  getMapOfConnectorToPluginProperties,
} from 'components/Connections/Create/reducer';
import * as React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import ConnectionsTabs from './ConnectionTabs';
import AllConnectionsIcon from './SVGs/AllConnectionsIcon';
import GCSIcon from './SVGs/GCSIcon';
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

const DatasetWrapper = () => {
  const loc = useLocation();
  const [data, setData] = React.useState<any>([]);
  const [value, setValue] = React.useState('All Connections');
  const [state, setState] = useState<ConnectionTabSidePanel>({
    connectorTypes: [],
    mapOfConnectorPluginProperties: null,
  });
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';

  React.useEffect(() => {
    console.log(data, 'this is data');
  }, [data]);

  const selectedTabValueHandler = (event: React.SyntheticEvent, newValue: any) => {
    console.log(newValue);
    setData([]);
    newValue !== 'All Connections' && getCategorizedConnectionsFromAPI(newValue);
  };

  const getCategorizedConnectionsFromAPI = async (selectedValue: string) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections = categorizedConnections.get(selectedValue) || [];

    fetchEntities(connections);
  };

  const fetchEntities = async (connections) => {
    const connectionsUpdated = connections.map((eachConnection) =>
      exploreConnection({
        connectionid: eachConnection.connectionId,
        path: pathFromUrl,
      })
    );

    try {
      await Promise.all([await connectionsUpdated]).then((values) => {
        values.map((each) => {
          each.map((each2) =>
            each2.then((response) => {
              setData((prev: any) => ([...prev, response.entities] as any).flat());
            })
          );
        });
      });
    } catch (e) {
      console.log('error', e);
    }
  };
  const getConnectionTabData = async () => {
    let connectorTypes = await fetchConnectors();
    let allConnectionsTotalLength = 0;

    const categorizedConnections = await getCategorizedConnections();
    connectorTypes = connectorTypes.filter((conn) => {
      return [conn.name];
    });
    const allConnectorsPluginProperties = await fetchAllConnectorPluginProperties(connectorTypes);
    const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
      allConnectorsPluginProperties
    );
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
  React.useEffect(() => {
    getConnectionTabData();
  }, []);

  return (
    <div>
      <ConnectionsTabs
        connectorTypes={state.connectorTypes}
        handleChange={selectedTabValueHandler}
        value={value}
      />
    </div>
  );
};

export default DatasetWrapper;
