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

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';

import { IPipelineConfig } from 'components/StudioV2/types';
import StudioV2Store from '..';
import { IConfigState, configInitialState } from './reducer';
import { setArtifact_mutating, setBatchInterval_mutating, setCheckpointDir_mutating, setCheckpointing_mutating, setClientResources_mutating, setComments_mutating, setDriverResources_mutating, setEngine_mutating, setGracefulStop_mutating, setInstrumentation_mutating, setMaxConcurrentRuns_mutating, setNodes_mutating, setNumRecordsPreview_mutating, setProperties_mutating, setRangeRecordsPreview_mutating, setResources_mutating, setServiceAccountPath_mutating, setStageLogging_mutating } from './mutations';
import { GLOBALS } from 'services/global-constants';

const PREFIX = 'CONFIG_ACTIONS';

export const ConfigActions = {
  SET_STATE: `${PREFIX}/SET_STATE`,
};

export function setConfigState(payload: IConfigState) {
  StudioV2Store.dispatch({
    type: ConfigActions.SET_STATE,
    payload,
  });
}

export function initCofigStore(config?: any) {
  let stateCopy = _cloneDeep(configInitialState);
  if (config) {
    stateCopy = _assign(stateCopy, config);

    setComments_mutating(stateCopy, stateCopy.config.comments);
    setArtifact_mutating(stateCopy, stateCopy.artifact);
    setProperties_mutating(stateCopy, stateCopy.config.properties);
    setDriverResources_mutating(stateCopy, stateCopy.config.driverResources);
    setResources_mutating(stateCopy, stateCopy.config.resources);
    setInstrumentation_mutating(stateCopy, stateCopy.config.processTimingEnabled);
    setStageLogging_mutating(stateCopy, stateCopy.config.stageLoggingEnabled);
    setNodes_mutating(stateCopy, stateCopy.config.stages || []);

    if (stateCopy.artifact.name === GLOBALS.etlDataStreams) {
      setClientResources_mutating(stateCopy, stateCopy.config.clientResources);
      setCheckpointing_mutating(stateCopy, stateCopy.config.disableCheckpoints);
      setCheckpointDir_mutating(stateCopy, stateCopy.config.checkpointDir 
        || window.CDAP_CONFIG.hydrator.defaultCheckpointDir);
      setGracefulStop_mutating(stateCopy, stateCopy.config.stopGracefully);
      setBatchInterval_mutating(stateCopy, stateCopy.config.batchInterval);
    } else if (stateCopy.artifact.name === GLOBALS.eltSqlPipeline) {
      setServiceAccountPath_mutating(stateCopy, stateCopy.config.serviceAccountPath);
    } else {
      setEngine_mutating(stateCopy, stateCopy.config.engine);
      setRangeRecordsPreview_mutating(stateCopy, stateCopy.artifact.config || {});
      setNumRecordsPreview_mutating(stateCopy, stateCopy.config.numOfRecordsPreview);
      setMaxConcurrentRuns_mutating(stateCopy, stateCopy.config.maxConcurrentRuns);
    }
  }

  stateCopy.__defaultState = _cloneDeep(stateCopy);
  setConfigState(stateCopy);
}

export function onEngineChange() {

}