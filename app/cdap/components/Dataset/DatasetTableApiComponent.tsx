import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { isNilOrEmptyString } from 'services/helpers';
import { promised } from 'q';
const DatasetTableApiComponent = () => {
  const loc = useLocation();
  const [initialConnectionId] = useState('');
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [currentConnection, setCurrentConnection] = useState(initialConnectionId);

  useEffect(() => {
    console.log(data, 'data');
  }, [data]);
  const [path, setPath] = useState(pathFromUrl);
  const fetchEntities = async () => {
    setLoading(true);
    try {
      // const res = await exploreConnection({
      //   connectionid: currentConnection,
      //   path,
      // });

      Promise.all([
        await exploreConnection({ connectionid: 'qa', path }),
        await exploreConnection({ connectionid: 'q', path }),
      ]).then((values) => {
        const dataArray = [];
        values.map((each) => each.entities.forEach((eachentity) => dataArray.push(eachentity)));
        setData(dataArray);
      });
      // console.log(`The response ${currentConnection}:`,res);
    } catch (e) {
      setError(`Failed to explore connection. Error: "${e.response}"`);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);
  return <div>HY</div>;
};

export default DatasetTableApiComponent;
