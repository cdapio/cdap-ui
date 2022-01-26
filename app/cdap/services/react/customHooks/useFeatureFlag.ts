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

import { useContext } from 'react';
import { FeatureFlagsContext, IFeatureFlags } from '../providers/featureFlagProvider';

/**
 * Returns true if feature if enabled, false if the flag
 * does not exist or disabled
 * Must wrap parent component with services/react/providers/featureFlagProvider
 * @param name feature flag name
 * @returns boolean
 */

export function useFeatureFlag(name: keyof IFeatureFlags | string): boolean {
  const features = useContext(FeatureFlagsContext);
  if (features === null) {
    throw new Error('Components must be wrapped in services/react/providers/featureFlagProvider');
  }
  // if name is not in features explicitly return false
  if (features[name] === undefined) {
    return false;
  }

  return features[name] === 'true';
}
