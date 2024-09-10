/*
 * Copyright © 2024 Cask Data, Inc.
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
import { useSelector } from 'react-redux';
import { LeftPanel } from 'components/hydrator/components/LeftPanel/LeftPanel';
import { fetchSystemArtifacts, setSelectedArtifact } from '../store/common/actions';
import { useLeftPanelController } from './useLeftPanel';

// @ts-ignore
function noop() {}

export default function LeftPanelV2() {
  const {
    artifacts,
    selectedArtifact,
    pluginsMap,

    onArtifactChange,
  } = useLeftPanelController();

  // console.log(artifacts || 'hello');

  console.log({ pluginsMap });
  return (
    <LeftPanel
      onArtifactChange={onArtifactChange}
      pluginsMap={pluginsMap}
      selectedArtifact={selectedArtifact}
      artifacts={artifacts}
      itemGenericName="plugins"
      groups={pluginsMap}
      groupGenericName="artifacts"
      onPanelItemClick={noop}
      isEdit={false}
      createPluginTemplate={noop}
      isV2={true}
    />
  );
}
