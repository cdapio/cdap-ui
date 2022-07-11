import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import * as React from 'react';
import { useLocation } from 'react-router';
import ConnectionTabsCaller from './ConnectionTabsCaller';

const DatasetWrapper = () => {
  const loc = useLocation();

  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';

  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    console.log(data, 'this is data');
  }, [data]);

  const selectedTabValueHandler = (selectedValue: string) => {
    setData([]);
    selectedValue !== 'All Connections' && getCategorizedConnectionsFromAPI(selectedValue);
  };

  const getCategorizedConnectionsFromAPI = async (selectedValue: string) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections = categorizedConnections.get(selectedValue) || [];

    fetchEntities(connections);
  };

  const fetchEntities = async (connections) => {
    const connectionsUpdated = connections.map((eachConnection) =>
      exploreConnection({ connectionid: eachConnection.connectionId, path: pathFromUrl })
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

  return (
    <div>
      <ConnectionTabsCaller selectedTabValueHandler={selectedTabValueHandler} />
    </div>
  );
};

export default DatasetWrapper;
