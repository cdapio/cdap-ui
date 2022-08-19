import { Box, styled, Typography } from '@material-ui/core';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { GCSIcon } from 'components/Datasets/iconStore';
import * as React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import BreadCumb from './Components/Breadcrumb';
import ConnectionsTabs from './Components/ConnectionTabs';
import { useStyles } from './styles';

const SelectDatasetWrapper = styled(Box)({
  display: 'flex',
  borderTop: '1px solid #E0E0E0;',
  overflow: 'auto',
  height: '100%',
  borderRight: '1px dashed #DADCE0',
});

const DatasetWrapper = () => {
  const classes = useStyles();
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';

  const [dataForTabs, setDataForTabs] = useState([
    {
      data: [],
      showTabs: true,
      selectedTab: null,
      isSearching: false,
    },
  ]);

  const getConnectionsTabData = async () => {
    let connectorTypes = await fetchConnectors();
    let allConnectionsTotalLength = 0;

    const categorizedConnections = await getCategorizedConnections();
    connectorTypes = connectorTypes.filter((conn): any => {
      return [conn.name];
    });

    connectorTypes = connectorTypes.map((connectorType): any => {
      const connections = categorizedConnections.get(connectorType.name) || [];
      allConnectionsTotalLength = allConnectionsTotalLength + connections.length;

      return {
        ...connectorType,
        count: connections.length,
        SVG: <GCSIcon />,
      };
    });
    const firstLevelData = connectorTypes.filter((each) => {
      if (each.count > 0) {
        return {
          name: each.name,
          count: each.count,
        };
      }
    });
    setDataForTabs((prev): any => {
      const tempData = [...prev];
      tempData[0].data = firstLevelData;
      return tempData;
    });
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string, index: number) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections = categorizedConnections.get(selectedValue) || [];

    setDataForTabs((prev): any => {
      const tempData = [...prev];
      tempData.push({
        data: [],
        showTabs: false,
        selectedTab: '',
        isSearching: false,
      });
      tempData[index + 1][`data`] = connections;
      tempData[index + 1][`showTabs`] = true;
      tempData[index + 1][`selectedTab`] = null;
      return tempData.slice(0, index + 2);
    });
  };

  const fetchEntities = async (connectionId, url = pathFromUrl) => {
    const pathDesired = url ? url : pathFromUrl;
    const entitiesPromise = exploreConnection({
      connectionid: connectionId,
      path: pathDesired,
    });
    return entitiesPromise.then((values) => {
      return values;
    });
  };

  const selectedTabValueHandler = (entity: any, index: number) => {
    setDataForTabs((currentData): any => {
      let newData = [...currentData];
      newData[index].selectedTab = entity.name;
      newData = newData.map((each) => {
        return {
          data: each.data,
          showTabs: each.showTabs,
          selectedTab: each.selectedTab,
          isSearching: false,
        };
      });
      if (index === 0) {
        getCategorizedConnectionsforSelectedTab(entity.name, index);
      } else if (index === 1) {
        fetchEntities(entity.name).then((res) => {
          setDataForTabs((prev): any => {
            const tempData = [...prev];
            tempData.push({
              data: [],
              showTabs: false,
              selectedTab: '',
              isSearching: false,
            });
            tempData[index + 1][`data`] = res.entities;
            tempData[index + 1][`showTabs`] = true;
            tempData[index + 1][`selectedTab`] = null;
            tempData[index + 1][`isSearching`] = false;
            return tempData.slice(0, index + 2);
          });
        });
      } else {
        if (entity.canBrowse) {
          fetchEntities(dataForTabs[1].selectedTab, entity.path).then((res) => {
            setDataForTabs((prev): any => {
              const tempData = [...prev];
              tempData.push({
                data: [],
                showTabs: false,
                selectedTab: '',
                isSearching: false,
              });
              tempData[index + 1][`data`] = res.entities;
              tempData[index + 1][`showTabs`] = true;
              tempData[index + 1][`selectedTab`] = null;
              tempData[index + 1][`isSearching`] = false;
              return tempData.slice(0, index + 2);
            });
          });
        }
      }
      return newData;
    });
  };

  React.useEffect(() => {
    getConnectionsTabData();
  }, []);

  const headerForLevelZero = () => {
    return (
      <Box className={classes.StyleForLevelZero}>
        <Typography variant="h6">Data Connections</Typography>
      </Box>
    );
  };

  let headerContent;

  return (
    <Box data-testid='data-sets-parent'>
      <BreadCumb />
      <SelectDatasetWrapper>
        {dataForTabs &&
          Array.isArray(dataForTabs) &&
          dataForTabs.map((each, index) => {
            if (index === 0) {
              headerContent = headerForLevelZero();
            } else {
              headerContent = (
                <>
                  <Box className={classes.beforeSearchIconClickDisplay}>
                    <Typography variant="h6">{dataForTabs[index - 1].selectedTab}</Typography>
                  </Box>
                </>
              );
            }
            return (
              <Box className={classes.tabsContainerWithHeader}>
                <Box className={classes.tabHeaders}>{headerContent}</Box>
                <ConnectionsTabs
                  tabsData={each}
                  handleChange={selectedTabValueHandler}
                  value={each.selectedTab}
                  index={index}
                />
              </Box>
            );
          })}
      </SelectDatasetWrapper>
    </Box>
  );
};

export default DatasetWrapper;
