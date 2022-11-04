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

import { styled } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useStyles } from 'components/ConnectionList/Components/ConnectionTabs/styles';
import {
  IConnectionTabsProps,
  IRecords,
} from 'components/ConnectionList/Components/ConnectionTabs/types';
import TabLabelCanBrowse from 'components/ConnectionList/Components/TabLabelCanBrowse';
import TabLabelCanSample from 'components/ConnectionList/Components/TabLabelCanSample';
import React, { useEffect, useState } from 'react';

const ConnectionTab = styled(Tab)({
  width: '100%',
  padding: '15px 10px 15px 30px',
  textTransform: 'none',
  color: 'black',
  fontSize: '16px',
  height: '50px',
  maxWidth: '300px',
  '& .MuiTab-root': {
    maxWidth: '300px',
  },
  '& .MuiTab-labelIcon': { minHeight: '54px !important' },
  '& .MuiTab-wrapper': {
    width: '100%',
    fontSize: '16px',
    fontWeight: '400',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '9.41px',
    flexDirection: 'row',
    zIndex: 3,
    whiteSpace: 'nowrap',
  },
  '&.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
    marginBottom: '0px',
  },
});

export default function ConnectionsTabs({
  tabsData,
  handleChange,
  value,
  connectionColumnIndex,
  connectionId,
  setToaster,
  toggleLoader,
}: IConnectionTabsProps) {
  const classes = useStyles();

  const [connectionIdProp, setConnectionId] = useState(connectionId);

  useEffect(() => {
    setConnectionId(connectionId);
  }, []);

  return (
    <Box data-testid="connections-tabs-parent" className={classes.connectionsTabsParent}>
      {tabsData.showTabs && (
        <div className={classes.boxStyles}>
          <Tabs
            value={value}
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            TabIndicatorProps={{
              className: classes.tabIndicatorStyles,
            }}
            classes={{
              indicator: classes.indicator,
              root: classes.tabsContainer,
            }}
          >
            {tabsData.data.map((connectorType, connectorTypeIndex) => (
              <ConnectionTab
                role="button"
                data-testid={`connectionstabs-eachtab-${connectionColumnIndex}-${connectorTypeIndex}`}
                onClick={() => {
                  if (connectionColumnIndex > 1) {
                    if (connectorType.canBrowse) {
                      handleChange(connectorType, connectionColumnIndex);
                    }
                  } else {
                    handleChange(connectorType, connectionColumnIndex);
                  }
                }}
                label={
                  connectionColumnIndex > 1 ? (
                    connectorType.canBrowse ? (
                      <TabLabelCanBrowse
                        label={connectorType.name as string}
                        count={
                          connectionColumnIndex === 0 ? (connectorType.count as number) : undefined
                        }
                        index={connectionColumnIndex}
                      />
                    ) : (
                      <TabLabelCanSample
                        label={connectorType.name as string}
                        entity={connectorType as IRecords}
                        initialConnectionId={connectionIdProp}
                        toggleLoader={toggleLoader}
                        setToaster={setToaster}
                      />
                    )
                  ) : (
                    <TabLabelCanBrowse
                      label={connectorType.name as string}
                      count={
                        connectionColumnIndex === 0 ? (connectorType.count as number) : undefined
                      }
                      index={connectionColumnIndex}
                      icon={(connectorType.icon as unknown) as JSX.Element}
                    />
                  )
                }
                value={connectorType.name}
                disableTouchRipple
                key={`${connectorType.name}=${connectorTypeIndex}`}
                id={connectorType.name as string}
                className={
                  connectionColumnIndex > 1 && !connectorType.canBrowse ? classes.wrangleTab : null
                }
              />
            ))}
          </Tabs>
        </div>
      )}
    </Box>
  );
}
