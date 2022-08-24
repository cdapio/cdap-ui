/*
 * Copyright © 2017-2018 Cask Data, Inc.
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
import * as React from 'react';
import TabLabelCanBrowse from '../TabLabelCanBrowse';
import TabLabelCanSample from '../TabLabelCanSample';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import { Redirect } from 'react-router';

const ConnectionTab = styled(Tab)({
  width: '100%',
  padding: '15px 10px 15px 30px',
  textTransform: 'none',
  color: 'black',
  fontSize: '16px',
  minHeight: '53px !important',
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

const ConnectionsTabs = ({ tabsData, handleChange, value, index, connectionId, ...props }) => {
  const classes = useStyles();

  const [connectionIdV, setConnectionId] = React.useState(connectionId);
  React.useEffect(() => {
    setConnectionId(connectionId);
  }, []);

  return (
    <Box data-testid="connections-tabs-parent">
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
                onClick={() => {
                  if (index > 1) {
                    connectorType.canBrowse ? handleChange(connectorType, index) : null;
                  } else {
                    handleChange(connectorType, index);
                  }
                }}
                label={
                  index > 1 ? (
                    connectorType.canBrowse ? (
                      <TabLabelCanBrowse
                        label={connectorType.name}
                        count={index === 0 ? connectorType.count : undefined}
                        index={index}
                      />
                    ) : (
                      <TabLabelCanSample
                        label={connectorType.name}
                        entity={connectorType}
                        initialConnectionId={connectionIdV}
                        toggleLoader={props.toggleLoader}
                      />
                    )
                  ) : (
                    <TabLabelCanBrowse
                      label={connectorType.name}
                      count={index === 0 ? connectorType.count : undefined}
                      index={index}
                      SVG={connectorType.SVG}
                    />
                  )
                }
                value={connectorType.name}
                disableTouchRipple
                key={`${connectorType.name}=${connectorTypeIndex}`}
                id={connectorType.name}
                className={connectorType.canSample ? classes.wrangleTab : 'eachConnectionStyle'}
              />
            ))}
          </Tabs>
        </div>
      )}
    </Box>
  );
};

export default ConnectionsTabs;
