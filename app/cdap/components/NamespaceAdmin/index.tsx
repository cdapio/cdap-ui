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

import React, { useEffect } from 'react';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { EntityTopPanel } from 'components/EntityTopPanel';
import { getCurrentNamespace } from 'services/NamespaceStore';
import {
  getNamespaceDetail,
  reset,
  getPreferences,
  getDrivers,
  getConnections,
} from 'components/NamespaceAdmin/store/ActionCreator';
import { Provider } from 'react-redux';
import Store from 'components/NamespaceAdmin/store';
import Description from 'components/NamespaceAdmin/Description';
import Metrics from 'components/NamespaceAdmin/Metrics';
import Tabs from 'components/NamespaceAdmin/Tabs';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
import { getProfiles, resetProfiles } from 'components/Cloud/Profiles/Store/ActionCreator';

const eventEmitter = ee(ee);

const useStyle = makeStyle(() => {
  return {
    content: {
      padding: '0 50px',
    },
  };
});

const NamespaceAdmin: React.FC = () => {
  const namespace = getCurrentNamespace();
  const classes = useStyle();

  useEffect(() => {
    getNamespaceDetail(namespace);
    getPreferences(namespace);
    getDrivers(namespace);
    getConnections(namespace);
    getProfiles(namespace);

    eventEmitter.on(globalEvents.NSPREFERENCESSAVED, getPreferences);
    eventEmitter.on(globalEvents.ARTIFACTUPLOAD, getDrivers);

    return () => {
      eventEmitter.off(globalEvents.NSPREFERENCESSAVED, getPreferences);
      eventEmitter.off(globalEvents.ARTIFACTUPLOAD, getDrivers);
      reset();
      resetProfiles();
    };
  }, []);

  return (
    <Provider store={Store}>
      <div>
        <EntityTopPanel title={`Namespace '${namespace}'`} />
        <div className={classes.content}>
          <Description />
          <Metrics />
          <Tabs />
        </div>
      </div>
    </Provider>
  );
};

export default NamespaceAdmin;
