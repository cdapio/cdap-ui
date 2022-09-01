/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { Box, Input, styled, Typography } from '@material-ui/core';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { GCSIcon, SearchIcon } from 'components/ConnectionList/iconStore';
import * as React from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import SubHeader from './Components/SubHeader';
import ConnectionsTabs from './Components/ConnectionTabs';
import { useStyles } from './styles';
import If from 'components/shared/If';
import LoadingSVG from 'components/shared/LoadingSVG';
import ErrorSnackbar from 'components/SnackbarComponent';
import _ from 'lodash';

const SelectDatasetWrapper = styled(Box)({
  overflowX: 'scroll',
  display: 'flex',
  borderTop: '1px solid #E0E0E0;',

  height: '100%',
  '& > :first-child': {
    minWidth: '280px',
  },
  '& > :not(:first-child)': {
    minWidth: '300px',
  },
});

const DatasetWrapper = () => {
  const { connectorType } = useParams() as any;

  const classes = useStyles();
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [loading, setLoading] = useState(true);
  const [isErrorOnNoWorkspace, setIsErrorOnNoWorkSpace] = useState<boolean>(false);

  const toggleLoader = (value: boolean, isError?: boolean) => {
    setLoading(value);
    if (isError) {
      setIsErrorOnNoWorkSpace(isError);
    }
  };
  let connectionId;
  const [dataForTabs, setDataForTabs] = useState([
    {
      data: [],
      showTabs: true,
      selectedTab: null,
      isSearching: false,
    },
  ]);

  const [filteredData, setFilteredData] = useState(_.cloneDeep(dataForTabs));

  React.useEffect(() => {
    const newData = _.cloneDeep(dataForTabs);
    setFilteredData(newData);
  }, [dataForTabs]);

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
    setLoading(false);
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
    toggleLoader(false);
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
    toggleLoader(true);
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
          toggleLoader(false);
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
            toggleLoader(false);
          });
        }
      }
      return newData;
    });
  };

  React.useEffect(() => {
    getConnectionsTabData();
  }, []);

  React.useEffect(() => {
    setDataForTabs((prev) => {
      const temp = [...prev];
      temp[0].selectedTab = connectorType;
      return temp;
    });
    getCategorizedConnectionsforSelectedTab(connectorType, 0);
  }, [connectorType]);

  const headerForLevelZero = () => {
    return (
      <Box className={classes.styleForLevelZero}>
        <Typography variant="body2">Data Connections</Typography>
      </Box>
    );
  };

  let headerContent;

  const searchHandler = (index: number) => {
    setDataForTabs((prev) => {
      const tempData = [...prev];
      tempData[index].isSearching = true;
      return tempData;
    });
  };

  const handleChange = (e: any, index: number) => {
    const val = e.target.value.toLowerCase();
    const newData = _.cloneDeep(dataForTabs);
    const newDataToSearch = [...newData[index].data];
    const tempData = newDataToSearch.filter((item: any) => item.name.toLowerCase().includes(val));
    newData[index].data = [...tempData];
    setFilteredData(_.cloneDeep(newData));
  };

  return (
    <Box data-testid="data-sets-parent" className={classes.connectionsListContainer}>
      <SubHeader />
      <SelectDatasetWrapper>
        {filteredData &&
          Array.isArray(filteredData) &&
          filteredData.map((each, index) => {
            if (each.data.filter((el) => el.connectionId).length) {
              connectionId = each.data.filter((el) => el.connectionId)[0].connectionId;
            }
            if (index === 0) {
              headerContent = headerForLevelZero();
            } else {
              headerContent = (
                <>
                  <Box
                    className={
                      each.isSearching
                        ? classes.hideComponent
                        : classes.beforeSearchIconClickDisplay
                    }
                  >
                    <Typography variant="body2">{dataForTabs[index - 1].selectedTab}</Typography>
                    <Box
                      onClick={() => {
                        searchHandler(index);
                      }}
                    >
                      <SearchIcon />
                    </Box>
                  </Box>
                  <Box
                    className={
                      each.isSearching ? classes.afterSearchIconClick : classes.hideComponent
                    }
                  >
                    <SearchIcon />
                    <Input
                      disableUnderline={true}
                      className={classes.searchBar}
                      onChange={(e: any) => handleChange(e, index)}
                      autoFocus={true}
                    />
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
                  connectionId={connectionId || ''}
                  toggleLoader={(value: boolean, isError?: boolean) => toggleLoader(value, isError)}
                  setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
                />
              </Box>
            );
          })}
      </SelectDatasetWrapper>
      <If condition={loading}>
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      </If>
      {isErrorOnNoWorkspace && (
        <ErrorSnackbar handleCloseError={() => setIsErrorOnNoWorkSpace(false)} />
      )}
    </Box>
  );
};

export default DatasetWrapper;
