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
  const [state, setState] = useState<any>({
    connectorTypes: [],
  });
  const loc = useLocation();
  const [data, setData] = React.useState<any>([]);
  const [value, setValue] = useState('All Connections');
  const [datasetsWithConnectionName, setDatasetsWithConnectionName] = useState([]);
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';

  React.useEffect(() => {
    if (['Imported Datasets', 'New Exploration'].includes(dataset)) {
      setValue('All Connections');
      getCategorizedConnectionsforSelectedTab('All Connections');
    } else {
      setValue(dataset);
      getCategorizedConnectionsforSelectedTab(dataset);
    }
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

    if (newValue === 'All Connections') {
      getCategorizedConnectionsforSelectedTab(newValue);
    }
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string) => {
    const categorizedConnections = await getCategorizedConnections();

    if (selectedValue !== 'All Connections') {
      const connections = categorizedConnections.get(selectedValue) || [];
      fetchEntities(connections);
      console.log('connections', connections);
    } else {
      const categorizedConnections = await getCategorizedConnections();
      let connections = [];
      const allConnections = [];
      console.log('categorizedConnections', categorizedConnections);
      for (const [key] of categorizedConnections) {
        if (key !== 'Spanner' || key !== 'PostgreSQL') {
          connections = categorizedConnections.get(key);
          connections.forEach((item) => {
            allConnections.push(item);
          });
        }
      }

      fetchEntities(allConnections);
    }
  };

  const fetchEntities = async (connections) => {
    const ids = [];
    const connectionsUpdated = connections.map((eachConnection) => {
      ids.push(eachConnection.connectionId);
      return exploreConnection({
        connectionid: eachConnection.connectionId,
        path: pathFromUrl,
      });
    });

    console.log(ids, 'list of Ids');
    let count = 0;
    try {
      await Promise.all([await connectionsUpdated]).then((values) => {
        values.map((eachValue, valueIndex) => {
          eachValue.map((each) =>
            each.then((response) => {
              console.log(ids[count], 'count value', count, 'ids[valueIndex]');
              response.entities.map((eachEntity) => {
                eachEntity[`connectionsName`] = ids[count];
              });
              setData((prev: any) => ([...prev, response.entities] as any).flat());
              console.log(response.entities, 'response.entities');
              count = count + 1;
            })
          );
        });
      });
    } catch (e) {
      // do nothing
    }
  };

  React.useEffect(() => {
    // nothing goes here;
  }, [datasetsWithConnectionName]);

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
