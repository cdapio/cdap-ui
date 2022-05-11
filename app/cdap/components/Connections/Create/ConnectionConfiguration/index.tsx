/*
 * Copyright © 2021 Cask Data, Inc.
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

import * as React from 'react';

import { IConnectorDetails } from 'components/Connections/Create/reducer';
import ConfigurableTab, { ITabConfigObj, TabLayoutEnum } from 'components/shared/ConfigurableTab';
import makeStyle from '@material-ui/core/styles/makeStyles';
import Markdown from 'components/shared/Markdown';
import { ConnectionConfigForm } from 'components/Connections/Create/ConnectionConfiguration/ConnectionConfigForm';
import { ConnectionConfigurationMode } from 'components/Connections/types';

const useStyle = makeStyle(() => {
  return {
    activeTabPane: {
      width: '100%',
      padding: '10px',
      overflowY: 'auto',
    },
    docActivePane: {
      paddingTop: '0',
    },
  };
});

interface IConnectionConfigurationProps extends IConnectorDetails {
  onConnectionCreate: (values: Record<string, string>) => void;
  onConnectionTest: (values: Record<string, string>) => void;
  initValues?: {
    initName?: string;
    initDescription?: string;
    initProperties?: Record<string, string>;
  };
  testResults: {
    succeeded: boolean;
    inProgress: boolean;
    messages?: any;
    configurationErrors?: any;
  };
  mode: ConnectionConfigurationMode;
}

export function ConnectionConfiguration({
  connectorProperties,
  connectorWidgetJSON,
  connectorDoc,
  onConnectionCreate,
  onConnectionTest,
  initValues = {},
  mode,
  testResults,
}: IConnectionConfigurationProps) {
  if (!connectorProperties) {
    return null;
  }

  const classes = useStyle();

  const tabConfig: ITabConfigObj = {
    defaultTab: '0',
    tabs: [
      {
        id: '0',
        name: 'Configuration',
        content: (
          <ConnectionConfigForm
            connectorProperties={connectorProperties}
            connectorWidgetJSON={connectorWidgetJSON}
            onConnectionCreate={onConnectionCreate}
            onConnectionTest={onConnectionTest}
            initName={initValues.initName}
            initDescription={initValues.initDescription}
            initProperties={initValues.initProperties}
            mode={mode}
            testResults={testResults}
          />
        ),
        paneClassName: classes.activeTabPane,
      },
      {
        id: '1',
        name: 'Documentation',
        content: <Markdown markdown={connectorDoc} />,
        paneClassName: `${classes.activeTabPane} ${classes.docActivePane}`,
      },
    ],
    layout: TabLayoutEnum.HORIZONTAL,
  };
  return <ConfigurableTab tabConfig={tabConfig} renderAllTabs={true} />;
}
