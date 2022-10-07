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

import { Box, IconButton, styled, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { GCSIcon } from 'components/ConnectionList/icons';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { IRecords } from 'components/GridTable/types';
import LoadingSVG from 'components/shared/LoadingSVG';
import ErrorSnackbar from 'components/SnackbarComponent';
import cloneDeep from 'lodash/cloneDeep';
import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import ConnectionsTabs from './Components/ConnectionTabs';
import SubHeader from './Components/SubHeader';
import { useStyles } from './styles';
import { IData, IdataForTabs } from './types';

const SelectDatasetWrapper = styled(Box)({
  overflowX: 'scroll',
  display: 'flex',
  borderTop: `1px solid ${grey[300]}`,

  height: '100%',
  '& > :first-child': {
    minWidth: '280px',
  },
  '& > :not(:first-child)': {
    minWidth: '300px',
  },
});

export default function ConnectionList() {
  const { connectorType } = useParams() as IRecords;

  const refs = useRef([]);
  const classes = useStyles();
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const [loading, setLoading] = useState(true);
  const [isErrorOnNoWorkspace, setIsErrorOnNoWorkSpace] = useState<boolean>(false);

  const toggleLoader = (value: boolean, isError?: boolean) => {
    setLoading(value);
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

  const [filteredData, setFilteredData] = useState(cloneDeep(dataForTabs));

  useEffect(() => {
    const newData = cloneDeep(dataForTabs);
    setFilteredData(newData);
  }, [dataForTabs]);

  const getConnectionsTabData = async () => {
    // Fetching the all available connectors list
    let connectorTypes = await fetchConnectors();
    let allConnectionsTotalLength = 0;

    // Fetching all the connections list inside a connector
    const categorizedConnections = await getCategorizedConnections();
    connectorTypes = connectorTypes.filter((conn) => {
      return [conn.name];
    });
    // Mapping connector types and corresponding connections
    connectorTypes = connectorTypes.map((connectorType) => {
      const connections = categorizedConnections.get(connectorType.name) || [];
      allConnectionsTotalLength = allConnectionsTotalLength + connections.length;
      return {
        ...connectorType,
        count: connections.length,
        icon: <GCSIcon />,
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
    setDataForTabs((prev) => {
      const tempData = [...prev];
      tempData[0].data = firstLevelData;
      return tempData;
    });
  };

  const setDataForTabsHelper = (res, index) => {
    setDataForTabs((prev) => {
      const tempData = [...prev];
      tempData.push({
        data: [],
        showTabs: false,
        selectedTab: '',
        isSearching: false,
      });
      if (res.entities) {
        tempData[index + 1][`data`] = res.entities;
      } else {
        tempData[index + 1][`data`] = res;
      }
      tempData[index + 1][`showTabs`] = true;
      tempData[index + 1][`selectedTab`] = null;
      tempData[index + 1][`isSearching`] = false;
      return tempData.slice(0, index + 2);
    });
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string, index: number) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections = categorizedConnections.get(selectedValue) || [];
    setDataForTabsHelper(connections, index);
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

  const selectedTabValueHandler = (entity: IRecords, index: number) => {
    toggleLoader(true);
    setDataForTabs((currentData) => {
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
        getCategorizedConnectionsforSelectedTab(entity.name as string, index);
      } else if (index === 1) {
        fetchEntities(entity.name).then((res) => {
          setDataForTabsHelper(res, index);
          toggleLoader(false);
        });
      } else {
        if (entity.canBrowse) {
          fetchEntities(dataForTabs[1].selectedTab, entity.path as string).then((res) => {
            setDataForTabsHelper(res, index);
            toggleLoader(false);
          });
        }
      }
      return newData;
    });
  };

  useEffect(() => {
    getConnectionsTabData();
  }, []);

  useEffect(() => {
    setDataForTabs((prev) => {
      const temp = prev;
      temp[0].selectedTab = connectorType;
      return temp;
    });
    getCategorizedConnectionsforSelectedTab(connectorType as string, 0);
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
    refs.current[index].focus();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.toLowerCase();
    const newData: IdataForTabs[] = cloneDeep(dataForTabs);
    const newDataToSearch: IData[] = [...newData[index].data];
    const tempData = newDataToSearch.filter((item: IData) => item.name.toLowerCase().includes(val));
    newData[index].data = [...tempData];
    setFilteredData(cloneDeep(newData));
  };

  const handleClearSearch = (e: MouseEvent<HTMLElement>, index: number) => {
    refs.current[index].value = '';
    const newData: IdataForTabs[] = cloneDeep(dataForTabs);
    const newDataToSearch: IData[] = [...newData[index].data];
    const tempData = newDataToSearch.filter((item: IData) => item.name.toLowerCase().includes(''));
    newData[index].data = [...tempData];
    setFilteredData(cloneDeep(newData));
  };

  const makeCursorFocused = (index: number) => {
    refs.current[index].focus();
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
                    <Typography variant="body2">{filteredData[index - 1].selectedTab}</Typography>
                    <Box
                      onClick={() => {
                        searchHandler(index);
                      }}
                    >
                      <IconButton>
                        <SearchRoundedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    className={
                      each.isSearching ? classes.afterSearchIconClick : classes.hideComponent
                    }
                    onMouseOver={() => makeCursorFocused(index)}
                  >
                    <SearchRoundedIcon />
                    <input
                      type="text"
                      className={classes.searchBar}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e, index)}
                      ref={(e) => {
                        refs.current[index] = e;
                      }}
                    />
                    <Box
                      className={classes.closeIcon}
                      onClick={(e: MouseEvent<HTMLElement>) => handleClearSearch(e, index)}
                    >
                      <CloseIcon />
                    </Box>
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

      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
      {isErrorOnNoWorkspace && (
        <ErrorSnackbar handleCloseError={() => setIsErrorOnNoWorkSpace(false)} />
      )}
    </Box>
  );
}
