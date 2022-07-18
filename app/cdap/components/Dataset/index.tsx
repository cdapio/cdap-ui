import { Box, styled } from '@material-ui/core';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import * as React from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import ConnectionsTabs from './ConnectionTabs';

import DataTable from '../DatasetListTable/DataTable';
import { IConnectionTabSidePanel } from './interfaces/interface';
import AllConnectionsIcon from './SVGs/AllConnectionsIcon';
import GCSIcon from './SVGs/GCSIcon';

const SelectDatasetWrapper = styled(Box)({
  display: 'flex',
  marginTop: '48px',
  borderTop: '1px solid #E0E0E0;',
});

const DatasetWrapper: React.FC = () => {
  const { dataset } = useParams() as any;

  const [state, setState] = useState<IConnectionTabSidePanel>({
    connectorTypes: [],
  });
  const loc = useLocation();
  const [data, setData] = React.useState<any>([]);
  const [value, setValue] = useState('All Connections');
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';

  React.useEffect(() => {
    getConnectionsTabData();
  }, []);
  const getConnectionsTabData = async () => {
    let connectorTypes = await fetchConnectors();
    let allConnectionsTotalLength = 0;

    const categorizedConnections = await getCategorizedConnections();
    connectorTypes = connectorTypes.filter((conn) => {
      return [conn.name];
    });
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
    });
  };

  const selectedTabValueHandler = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setData([]);
    newValue !== 'All Connections' && getCategorizedConnectionsforSelectedTab(newValue);
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string) => {
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
        values.map((value) => {
          value.map((each) =>
            each.then((response) => {
              setData((prev: any) => ([...prev, response.entities] as any).flat());
            })
          );
        });
      });
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {}, [data]);

  return (
    <SelectDatasetWrapper>
      <ConnectionsTabs
        connectorTypes={state.connectorTypes}
        handleChange={selectedTabValueHandler}
        value={value}
      />
      <DataTable datasetList={data} selectedTab={value} />
    </SelectDatasetWrapper>
  );
};

export default DatasetWrapper;
