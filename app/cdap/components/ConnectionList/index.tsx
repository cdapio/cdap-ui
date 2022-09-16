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

import { Box, styled, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { GCSIcon } from 'components/ConnectionList/icons';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { IRecords } from 'components/GridTable/types';
import LoadingSVG from 'components/shared/LoadingSVG';
import ErrorSnackbar from 'components/SnackbarComponent';
import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import ConnectionsTabs from './Components/ConnectionTabs';
import CustomTooltip from './Components/CustomTooltip';
import SubHeader from './Components/SubHeader';
import { useStyles } from './styles';

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
        getCategorizedConnectionsforSelectedTab(entity.name, index);
      } else if (index === 1) {
        fetchEntities(entity.name).then((res) => {
          setDataForTabsHelper(res, index);
          toggleLoader(false);
        });
      } else {
        if (entity.canBrowse) {
          fetchEntities(dataForTabs[1].selectedTab, entity.path).then((res) => {
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

  return (
    <Box data-testid="data-sets-parent" className={classes.connectionsListContainer}>
      <SubHeader />
      <SelectDatasetWrapper>
        {dataForTabs.map((each, index) => {
          const connectionIdRequired = each.data.filter((el) => el.connectionId);
          if (connectionIdRequired.length) {
            connectionId = connectionIdRequired[0].connectionId;
          }
          if (index === 0) {
            headerContent = headerForLevelZero();
          } else {
            headerContent =
              refs.current[index]?.offsetWidth < refs.current[index]?.scrollWidth ? (
                <CustomTooltip title={dataForTabs[index - 1].selectedTab} arrow>
                  <Box className={classes.beforeSearchIconClickDisplay}>
                    <Typography
                      variant="body2"
                      className={classes.headerLabel}
                      ref={(element) => {
                        refs.current[index] = element;
                      }}
                    >
                      {dataForTabs[index - 1].selectedTab}
                    </Typography>
                  </Box>
                </CustomTooltip>
              ) : (
                <Box className={classes.beforeSearchIconClickDisplay}>
                  <Typography
                    variant="body2"
                    className={classes.headerLabel}
                    ref={(element) => {
                      refs.current[index] = element;
                    }}
                  >
                    {dataForTabs[index - 1].selectedTab}
                  </Typography>
                </Box>
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
