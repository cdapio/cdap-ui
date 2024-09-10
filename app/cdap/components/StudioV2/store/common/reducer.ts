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

import { ILabeledArtifactSummary } from 'components/StudioV2/types';
import { getArtifactDisaplayName } from 'components/StudioV2/utils/artifactUtils';
import { GLOBALS } from 'services/global-constants';

interface ICommonState {
  artifacts: ILabeledArtifactSummary[];
  selectedArtifact: ILabeledArtifactSummary;
}

export const defaultSelectedArtifact: ILabeledArtifactSummary = {
  name: GLOBALS.etlDataPipeline,
  version: '',
  scope: 'SYSTEM',
  label: getArtifactDisaplayName(GLOBALS.etlDataPipeline),
};

export const commonDefaultInitialState: ICommonState = {
  artifacts: [],
  selectedArtifact: defaultSelectedArtifact,
};

export const CommonActions = {
  SET_ARTIFACTS: 'STUDIO_V2_SET_ARTIFACTS',
  SET_SELECTED_ARTIFACT: 'STUDIO_V2_SET_SELECTED_ARTIFACT',
};

export const common = (state: ICommonState = commonDefaultInitialState, action?): ICommonState => {
  switch (action.type) {
    case CommonActions.SET_ARTIFACTS:
      return { ...state, artifacts: action.payload };
    case CommonActions.SET_SELECTED_ARTIFACT:
      return { ...state, selectedArtifact: action.payload };
    default:
      return state;
  }
};
