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

import Box from '@material-ui/core/Box';
import { blue } from '@material-ui/core/colors';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { IConnectionTabsProps, IConnectionTabType } from 'components/ConnectionList/types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RenderLabel from 'components/ConnectionList/Components/ConnectionTabs/Components/RenderLabel';

const ConnectionTabsContainer = styled(Tabs)`
  & .canBrowseHover {
    display: none;
  };  
  & .MuiTabs-indicator {
    background-color: ${blue[500]};
    color: white !important;
    width: 100%;
    z-index: 2;
  },
  & .MuiTabs-root{
      & .MuiTabs-scroller{
        &.canBrowseHover{
          display: none;
        }
        & .MuiButtonBase-root.Mui-selected{
          color: #fff;
          & .canBrowseHover {
            display: inline;
          };
          & .canBrowseNormal{
            display: none;
          },
        },
      },
    },
  }
`;

const ConnectionTab = styled(Tab)`
  width: 100%;
  padding: 15px 10px 15px 30px;
  text-transform: none;
  color: black;
  font-size: 16px;
  height: 50px;
  max-width: 300px;
  & .MuiTab-root {
    max-width: 300px;
  }
  & .MuiTab-labelIcon {
    min-height: 54px !important;
  }
  & .MuiTab-wrapper {
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    justify-content: flex-start;
    gap: 9.41px;
    flex-direction: row;
    z-index: 3;
    white-space: nowrap;
  }
  &.MuiTab-labelIcon .MuiTab-wrapper > *:first-child {
    margin-bottom: 0px;
  }
  ${(props) =>
    props.colIndex > 1 &&
    !props.connectorType.canBrowse &&
    `&:hover {
    background-color: #eff0f2;
    cursor: default;
  }`}
`;

const ConnectionTabsWrapper = styled(Box)`
  z-index: 1;
  height: 100%;
  overflow: scroll;
  height: calc(100vh - 200px);
`;

export default function ConnectionTabs({
  tabsData,
  handleChange,
  value,
  columnIndex,
  connectionId,
  setIsErrorOnNoWorkSpace,
  toggleLoader,
}: IConnectionTabsProps) {
  const [connectionIdProp, setConnectionIdProp] = useState(connectionId);

  useEffect(() => {
    setConnectionIdProp(connectionId);
  }, []);

  const handleConnectionTabClick = (connectorType: IConnectionTabType, index: number) => {
    !(index > 1 && !connectorType.canBrowse) && handleChange(connectorType, index);
  };

  // code to achieve automatic scroll into view for connection list tabs
  const refValue = useRef(null);
  const scrollToRight = () => {
    refValue.current.scrollIntoView({
      behavior: 'auto',
    });
  };
  useEffect(() => {
    if (refValue.current) {
      scrollToRight();
    }
  }, [refValue]);

  return (
    <Box data-testid="connections-tabs-parent" {...{ ref: refValue }}>
      {tabsData.showTabs && (
        <ConnectionTabsWrapper data-testid="connection-tabs">
          <ConnectionTabsContainer
            value={value}
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabsData.data.map((eachTabData: IConnectionTabType, eachTabIndex: number) => (
              <ConnectionTab
                role="button"
                data-testid={`connections-tab-column${columnIndex}-item${eachTabIndex}`}
                onClick={() => handleConnectionTabClick(eachTabData, columnIndex)}
                label={
                  <RenderLabel
                    columnIndex={columnIndex}
                    connectorType={eachTabData}
                    connectionIdProp={connectionIdProp}
                    toggleLoader={toggleLoader}
                    setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
                    dataTestID={eachTabIndex}
                  />
                }
                value={eachTabData.name}
                disableTouchRipple
                key={`${eachTabData.name}=${eachTabIndex}`}
                id={eachTabData.name}
                colIndex={columnIndex}
                connectorType={eachTabData}
              />
            ))}
          </ConnectionTabsContainer>
        </ConnectionTabsWrapper>
      )}
    </Box>
  );
}
