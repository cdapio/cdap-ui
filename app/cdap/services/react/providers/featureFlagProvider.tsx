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

import React, { createContext } from 'react';

// unfortunately our booleans come back as strings in this instance
type IStringBoolean = 'true' | 'false';

export interface IFeatureFlags {
  'replication.transformations.enabled'?: IStringBoolean;
  'pipeline.composite.triggers.enabled'?: IStringBoolean;
  'lifecycle.management.edit.enabled'?: IStringBoolean;
}

export const FeatureFlagsContext = createContext(null);

/**
 * Feature flag provider - checks CDAP_CONFIG on the window for
 * the features
 * server/express.js contains where the feature flags are added to the window
 * server.js contains where feature flags are extracted from the config
 *
 */
export function FeatureProvider({ children }: { children: React.ReactElement }) {
  // Unfortunately all config pieces are passed onto the window like this - needs to change in the future
  return (
    <FeatureFlagsContext.Provider value={window.CDAP_CONFIG.featureFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
