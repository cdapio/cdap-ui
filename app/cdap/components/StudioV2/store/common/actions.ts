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

import { MyArtifactApi } from 'api/artifact';
import { IArtifactSummary, ILabeledArtifactSummary } from 'components/StudioV2/types';
import { getArtifactDisaplayName } from 'components/StudioV2/utils/artifactUtils';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Theme } from 'services/ThemeHelper';
import VersionStore from 'services/VersionStore';
import { GLOBALS } from 'services/global-constants';
import StudioV2Store from '..';
import { CommonActions } from './reducer';

export const fetchSystemArtifacts = () => {
  const cdapVersion = VersionStore.getState().version;
  const namespace = getCurrentNamespace();

  const uiSupportedArtifacts = [GLOBALS.etlDataPipeline];
  if (Theme.showRealtimePipeline !== false) {
    uiSupportedArtifacts.push(GLOBALS.etlDataStreams);
  }
  if (Theme.showSqlPipeline !== false) {
    uiSupportedArtifacts.push(GLOBALS.eltSqlPipeline);
  }

  MyArtifactApi.listScopedArtifacts({
    namespace,
    scope: 'SYSTEM',
  }).subscribe((res: IArtifactSummary[]) => {
    if (!res.length) {
      return;
    }

    const filteredArtifacts = res.filter(
      (artifact) => artifact.version === cdapVersion && uiSupportedArtifacts.includes(artifact.name)
    );

    const labeledArtifacts = filteredArtifacts.map((artifact) => ({
      ...artifact,
      label: getArtifactDisaplayName(artifact.name),
    }));

    StudioV2Store.dispatch({
      type: CommonActions.SET_ARTIFACTS,
      payload: labeledArtifacts,
    });
  });
};

export const setSelectedArtifact = (artifact: ILabeledArtifactSummary) => {
  StudioV2Store.dispatch({
    type: CommonActions.SET_SELECTED_ARTIFACT,
    payload: artifact,
  });
};
