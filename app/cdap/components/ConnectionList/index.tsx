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
import ConnectionsTabs from 'components/ConnectionList/Components/ConnectionTabs/index';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import SubHeader from 'components/ConnectionList/Components/SubHeader';
import { GCSIcon } from 'components/ConnectionList/icons';
import { useStyles } from 'components/ConnectionList/styles';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { IRecords } from 'components/GridTable/types';
import LoadingSVG from 'components/shared/LoadingSVG';
import Snackbar from 'components/Snackbar';
import useSnackbar from 'components/Snackbar/useSnackbar';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';

const SelectDatasetWrapper = styled(Box)({
  overflowX: 'scroll',
  display: 'flex',
  borderTop: '1px solid',
  borderColor: grey[300],

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
  const [snackbarState, setSnackbar] = useSnackbar();
  const toggleLoader = (value: boolean, isError?: boolean) => {
    setLoading(value);
  };
  let connectionId;
  const [dataForTabs, setDataForTabs] = useState([
    {
      data: [],
      showTabs: true,
      selectedTab: null,
      toggleSearch: false,
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
    connectorTypes = connectorTypes.map((eachConnectorType) => {
      const connections = categorizedConnections.get(eachConnectorType.name) || [];
      allConnectionsTotalLength = allConnectionsTotalLength + connections.length;
      return {
        ...eachConnectorType,
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
        toggleSearch: false,
      });
      if (res.entities) {
        tempData[index + 1][`data`] = res.entities;
      } else {
        tempData[index + 1][`data`] = res;
      }
      tempData[index + 1][`showTabs`] = true;
      tempData[index + 1][`selectedTab`] = null;
      tempData[index + 1][`toggleSearch`] = false;
      return tempData.slice(0, index + 2);
    });
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string, index: number) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections = categorizedConnections.get(selectedValue) || [];
    setDataForTabsHelper(connections, index);
    toggleLoader(false);
  };

  const fetchEntities = async (connectionName, url = pathFromUrl) => {
    const pathDesired = url ? url : pathFromUrl;
    const entitiesPromise = exploreConnection({
      connectionid: connectionName,
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
          toggleSearch: false,
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

  const setSnackbarState = (value: boolean) => {
    setSnackbar({
      open: false,
    });
  };

  let headerContent;

  return (
    <Box data-testid="data-sets-parent" className={classes.connectionsListContainer}>
      <SubHeader />
      <SelectDatasetWrapper>
        {dataForTabs?.map((eachTabItem, tabIndex) => {
          const requiredConnectionId = eachTabItem?.data?.filter(
            (eachDataItem) => eachDataItem.connectionId
          );
          if (requiredConnectionId.length) {
            connectionId = requiredConnectionId[0].connectionId;
          }
          if (tabIndex === 0) {
            headerContent = headerForLevelZero();
          } else {
            headerContent =
              refs.current[tabIndex]?.offsetWidth < refs.current[tabIndex]?.scrollWidth ? (
                <CustomTooltip title={dataForTabs[tabIndex - 1].selectedTab} arrow>
                  <Box className={classes.beforeSearchIconClickDisplay}>
                    <Typography
                      variant="body2"
                      className={classes.headerLabel}
                      ref={(element) => {
                        refs.current[tabIndex] = element;
                      }}
                    >
                      {dataForTabs[tabIndex - 1].selectedTab}
                    </Typography>
                  </Box>
                </CustomTooltip>
              ) : (
                <Box className={classes.beforeSearchIconClickDisplay}>
                  <Typography
                    variant="body2"
                    className={classes.headerLabel}
                    ref={(element) => {
                      refs.current[tabIndex] = element;
                    }}
                  >
                    {dataForTabs[tabIndex - 1].selectedTab}
                  </Typography>
                </Box>
              );
          }
          return (
            <Box
              className={classes.tabsContainerWithHeader}
              data-testid={`connection-tabs-column-${tabIndex}`}
            >
              <Box className={classes.tabHeaders}>{headerContent}</Box>
              <ConnectionsTabs
                tabsData={eachTabItem}
                handleChange={selectedTabValueHandler}
                value={eachTabItem.selectedTab}
                connectionColumnIndex={tabIndex}
                connectionId={connectionId || ''}
                toggleLoader={(value: boolean, isError?: boolean) => toggleLoader(value, isError)}
                setSnackbar={setSnackbar}
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
      {snackbarState.open && (
        <Snackbar
          handleCloseError={() =>
            setSnackbar({
              open: false,
            })
          }
          setSnackbarState={setSnackbarState}
          isOpen={snackbarState.open}
          description={snackbarState.message}
          isSuccess={snackbarState.isSuccess}
        />
      )}{' '}
    </Box>
  );
}
