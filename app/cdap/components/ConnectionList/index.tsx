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

import { Box } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import ConnectionTabs from 'components/ConnectionList/Components/ConnectionTabs';
import { IConnectionTabType } from 'components/ConnectionList/Components/ConnectionTabs/Components/RenderLabel';
import Header from 'components/ConnectionList/Components/Header';
import SubHeader from 'components/ConnectionList/Components/SubHeader';
import { InfoGraph } from 'components/ConnectionList/IconStore/InfoGraph';
import { IFilteredData, ITabData, ITabsDataResponse } from 'components/ConnectionList/types';
import {
  getDataForTabsHelper,
  getDisplayNamesForConnectorTypes,
  getUpdatedTabsData,
} from 'components/ConnectionList/utils';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import DataPrepStore from 'components/DataPrep/store';
import { IRecords } from 'components/GridTable/types';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import ErrorSnackbar from 'components/SnackbarComponent';
import { getWidgetData } from 'components/WidgetSVG/utils';
import T from 'i18n-react';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import styled from 'styled-components';

const PREFIX = 'features.WranglerNewUI';

const ConnectionsListContainer = styled(Box)`
  width: 100vw;
  overflow: scroll;
  & * {
    letterspacing: 0.15px;
  }
`;

const ContainerForLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 0.5;
  background: white;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2000;
`;

const FlexContainer = styled(Box)`
  display: flex;
`;

const InfographicContainer = styled(FlexContainer)`
  flex-grow: 1;
  justify-content: flex-end;
  align-items: flex-end;
  padding-right: 80px;
  padding-bottom: 80px;
`;

const SelectDatasetWrapper = styled(FlexContainer)({
  overflowX: 'scroll',
  borderTop: `1px solid ${grey[300]}`,

  height: '100%',
  '& > :first-child': {
    minWidth: '280px',
  },
  '& > :not(:first-child)': {
    minWidth: '300px',
  },
});

const TabsContainerWithHeader = styled(FlexContainer)`
  flex-direction: column;
  border-right: 1px solid ${grey[300]};
`;

const TabHeaderContainer = styled(Box)`
  background-color: ${blue[50]};
  & .MuiTypography-root{
    font-size: 16px;
    color: #000000;
    },    
`;

export default function() {
  const { connectorType } = useParams() as IRecords;
  const loc = useLocation();
  const queryParams = new URLSearchParams(loc.search);
  const pathFromUrl = queryParams.get('path') || '/';
  const refs = useRef([]);
  const headersRefs = useRef([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isErrorOnNoWorkspace, setIsErrorOnNoWorkSpace] = useState<boolean>(false);
  const [tabsLength, setTabsLength] = useState<number>(0);
  const [tabsData, setTabsData] = useState<IFilteredData[]>([
    {
      data: [],
      showTabs: true,
      selectedTab: null,
      toggleSearch: false,
    },
  ]);
  const [filteredData, setFilteredData] = useState<IFilteredData>(cloneDeep(tabsData));
  const toggleLoader = (value: boolean, isError?: boolean) => {
    setLoading(value);
  };
  const [fetchedConnectorsData, setFetchedConnectorsData] = useState([]);
  let connectionId;

  useEffect(() => {
    getWidgetData();
  }, []);

  /**
   * Here we are fetching connectors with icons from store
   */
  DataPrepStore.subscribe(() => {
    const newState = DataPrepStore.getState();
    setFetchedConnectorsData(newState.dataprep.connectorsWithIcons);
  });

  const getConnectionsTabData = async () => {
    let connectorTypes: ITabData[] = [];
    connectorTypes = fetchedConnectorsData;
    let allConnectionsTotalLength = 0;
    // Fetching all the connections list inside each connector type
    const categorizedConnections = await getCategorizedConnections();
    const connectorTypeWithConnections = [];
    categorizedConnections?.forEach((itemEach, key) => {
      connectorTypeWithConnections.push(key);
    });

    // filtering all the connections which got connections inside them
    connectorTypes = connectorTypes.filter((obj) =>
      connectorTypeWithConnections.find((item) => item == obj.name)
    );
    connectorTypes = [...new Map(connectorTypes.map((item) => [item.name, item])).values()];
    connectorTypes = connectorTypes.filter((eachConnectionType: ITabData) => {
      return [eachConnectionType.name];
    });
    // Mapping connector types and corresponding connections
    connectorTypes = connectorTypes?.map((eachConnectorType: ITabData) => {
      const connections = categorizedConnections.get(eachConnectorType.name) || [];
      allConnectionsTotalLength = allConnectionsTotalLength + connections.length;
      return {
        ...eachConnectorType,
        count: connections.length,
        icon: eachConnectorType.SVG,
      };
    });

    // getting connector's display names
    connectorTypes = await getDisplayNamesForConnectorTypes(connectorTypes);

    // Connector types which has connections inside it
    const firstLevelData: ITabData[] = connectorTypes.filter(
      (eachConnectorType: ITabData) => eachConnectorType.count > 0
    );

    setLoading(false);
    setTabsData((prev: IFilteredData[]) => {
      const tempData = [...prev];
      tempData[0].data = firstLevelData;
      return tempData;
    });
  };

  const getCategorizedConnectionsforSelectedTab = async (selectedValue: string, index: number) => {
    const categorizedConnections = await getCategorizedConnections();
    const connections: ITabsDataResponse | ITabData[] =
      categorizedConnections.get(selectedValue) || [];
    setTabsData(getDataForTabsHelper(connections, index, tabsData));
    toggleLoader(false);
  };

  const fetchEntities = async (connectionName: string, url: string = pathFromUrl) => {
    const pathDesired: string = url ? url : pathFromUrl;
    const entitiesPromise = await exploreConnection({
      connectionid: connectionName,
      path: pathDesired,
    });
    return entitiesPromise;
  };

  const makeCursorFocused = (index: number) => {
    refs.current[index].focus();
  };

  const handleSelectedTab = (entity: IConnectionTabType, index: number) => {
    toggleLoader(true);
    setTabsData((currentData) => {
      let newData: IFilteredData[] = [...currentData];
      newData[index].selectedTab = entity.name;
      newData = newData.map((eachNewData) => {
        return {
          data: eachNewData.data,
          showTabs: eachNewData.showTabs,
          selectedTab: eachNewData.selectedTab,
          toggleSearch: false,
        };
      });
      if (index === 0) {
        getCategorizedConnectionsforSelectedTab(entity.name as string, index);
      } else if (index === 1) {
        fetchEntitiesData(entity?.name, index);
      } else {
        if (entity.canBrowse) {
          fetchEntitiesData(tabsData[1]?.selectedTab, index, entity.path);
        }
      }
      return newData;
    });
  };

  const fetchEntitiesData = async (entityName: string, index: number, path?: string) => {
    try {
      const response = await fetchEntities(entityName, path ? path : undefined);
      if (response) {
        setTabsData(getDataForTabsHelper(response, index, tabsData));
        toggleLoader(false);
      }
    } catch (error) {
      toggleLoader(false);
      setIsErrorOnNoWorkSpace(true);
    }
  };

  const searchHandler = (index: number) => {
    setTabsData(getUpdatedTabsData(index, tabsData));
    refs.current[index].focus();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val: string = e.target.value.toLowerCase();
    const newData: IFilteredData[] = cloneDeep(tabsData);
    const newDataToSearch: ITabData[] = [...newData[index].data];
    const tempData: ITabData[] = newDataToSearch.filter((item: ITabData) =>
      item.name.toLowerCase().includes(val)
    );
    newData[index].data = [...tempData];
    setFilteredData(cloneDeep(newData));
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLInputElement>, index: number) => {
    if (refs.current[index].value === '') {
      setTabsData((prev) => {
        const tempData: IFilteredData[] = [...prev];
        tempData[index].toggleSearch = false;
        return tempData;
      });
    } else {
      refs.current[index].value = '';
      const newData: IFilteredData[] = cloneDeep(tabsData);
      const newDataToSearch: ITabData[] = [...newData[index].data];
      const tempData: ITabData[] = newDataToSearch.filter((item: ITabData) =>
        item.name.toLowerCase().includes('')
      );
      newData[index].data = [...tempData];
      setFilteredData(cloneDeep(newData));
    }
  };

  const getConnectionId = (connections) => {
    if (connections.data.filter((eachFilterItem: ITabData) => eachFilterItem.connectionId).length) {
      connectionId = connections.data.filter(
        (eachFilterItem: ITabData) => eachFilterItem.connectionId
      )[0].connectionId;
    }
  };

  useEffect(() => {
    getConnectionsTabData();
  }, [fetchedConnectorsData]);

  useEffect(() => {
    setFilteredData(cloneDeep(tabsData));
  }, [tabsData]);

  useEffect(() => {
    setTabsData((prev) => {
      const temp: IFilteredData[] = prev;
      temp[0].selectedTab = connectorType as string;
      return temp;
    });
    getCategorizedConnectionsforSelectedTab(connectorType as string, 0);
  }, [connectorType]);

  useEffect(() => {
    setTabsLength(tabsData?.length);
  }, [tabsData?.length]);

  return (
    <ConnectionsListContainer data-testid="data-sets-parent">
      <SubHeader selectedConnection={tabsData[0]?.selectedTab} />
      {tabsData && Array.isArray(tabsData) && tabsData.length && tabsData[0]?.data?.length > 0 ? (
        <FlexContainer>
          <SelectDatasetWrapper>
            {filteredData &&
              Array.isArray(filteredData) &&
              filteredData?.map((eachFilteredData: IFilteredData, index: number) => {
                getConnectionId(eachFilteredData);
                return (
                  <TabsContainerWithHeader>
                    <TabHeaderContainer>
                      <Header
                        levelIndex={index}
                        eachFilteredData={eachFilteredData}
                        headersRefs={headersRefs}
                        columnIndex={index}
                        tabsData={tabsData}
                        filteredData={filteredData}
                        searchHandler={searchHandler}
                        makeCursorFocused={makeCursorFocused}
                        handleSearch={handleSearch}
                        refs={refs}
                        handleClearSearch={handleClearSearch}
                        data-testid={`header-for-level-${index}`}
                      />
                    </TabHeaderContainer>
                    <ConnectionTabs
                      tabsData={eachFilteredData}
                      handleChange={handleSelectedTab}
                      value={eachFilteredData.selectedTab}
                      columnIndex={index}
                      connectionId={connectionId || ' '}
                      toggleLoader={(value: boolean, isError?: boolean) =>
                        toggleLoader(value, isError)
                      }
                      setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
                    />
                  </TabsContainerWithHeader>
                );
              })}
          </SelectDatasetWrapper>
          {tabsLength < 4 && (
            <InfographicContainer>
              <InfoGraph />
            </InfographicContainer>
          )}
        </FlexContainer>
      ) : (
        loading && (
          <NoRecordScreen
            title={T.translate(`${PREFIX}.NoRecordScreen.connectionsList.title`)}
            subtitle={T.translate(`${PREFIX}.NoRecordScreen.connectionsList.subtitle`)}
          />
        )
      )}

      {loading && (
        <ContainerForLoader>
          <LoadingSVG />
        </ContainerForLoader>
      )}

      {isErrorOnNoWorkspace && (
        <ErrorSnackbar handleCloseError={() => setIsErrorOnNoWorkSpace(false)} />
      )}
    </ConnectionsListContainer>
  );
}
