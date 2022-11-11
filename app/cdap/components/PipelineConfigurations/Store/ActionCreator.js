/*
 * Copyright © 2018 Cask Data, Inc.
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

import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import PipelineDetailStore, {
  ACTIONS as PipelineDetailActions,
} from 'components/PipelineDetails/store';
import {
  setRunButtonLoading,
  setRunError,
  setScheduleButtonLoading,
  setScheduleError,
  fetchScheduleStatus,
} from 'components/PipelineDetails/store/ActionCreator';
import KeyValueStore, {
  getDefaultKeyValuePair,
} from 'components/shared/KeyValuePairs/KeyValueStore';
import KeyValueStoreActions, {
  convertKeyValuePairsObjToMap,
} from 'components/shared/KeyValuePairs/KeyValueStoreActions';
import { GLOBALS } from 'services/global-constants';
import { MyPipelineApi } from 'api/pipeline';
import { MyProgramApi } from 'api/program';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyPreferenceApi } from 'api/preference';
import { objectQuery } from 'services/helpers';
import uuidV4 from 'uuid/v4';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import { CLOUD, GENERATED_RUNTIMEARGS } from 'services/global-constants';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

// Filter certain preferences from being shown in the run time arguments
// They are being represented in other places (like selected compute profile).
const getFilteredRuntimeArgs = (runtimeArgs) => {
  let { resolvedMacros } = PipelineConfigurationsStore.getState();
  let modifiedRuntimeArgs = {};
  let pairs = [...runtimeArgs.pairs];
  pairs = pairs.map((pair) => {
    if (pair.key in resolvedMacros) {
      return {
        notDeletable: true,
        ...pair,
      };
    }
    return pair;
  });
  if (!pairs.length) {
    pairs.push(getDefaultKeyValuePair());
  }
  modifiedRuntimeArgs.pairs = pairs;
  return modifiedRuntimeArgs;
};

// While adding runtime argument make sure to include the excluded preferences
const updateRunTimeArgs = (rtArgs) => {
  PipelineConfigurationsStore.dispatch({
    type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
    payload: {
      runtimeArgs: rtArgs,
    },
  });
};

const updatePreviewRecords = (previewRecords) => {
  PipelineConfigurationsStore.dispatch({
    type: PipelineConfigurationsActions.SET_NUM_RECORDS_PREVIEW,
    payload: {
      numRecordsPreview: previewRecords,
    },
  });
};

const updatePreviewTimeout = (previewTimeout) => {
  PipelineConfigurationsStore.dispatch({
    type: PipelineConfigurationsActions.SET_PREVIEW_TIMEOUT,
    payload: {
      previewTimeoutInMin: previewTimeout,
    },
  });
};

/*
  FIXME: We should get rid of this function. This is not good. Scenario why this is not good:

  Component 1 uses KeyValuePairs
  Component 1 passes props to KeyValuePairs
  Component 1 receives updates when things chnage via onKeyValuesChange function
  Component 1 now has an update that it needs to pass to KeyValuePairs
  Component 1 updates props -> KeyValuePairs will receive new props -> Updates state
  -> not the store inside it.

  As a result the component doesn't reflect what Component 1 wants. So now Component 1 now
  updates the KeyValueStore as well. This is what this function is doing.

  We should make KeyValuePairs component's API be simpler and easier to use.
*/
const updateKeyValueStore = () => {
  let runtimeArgsPairs = PipelineConfigurationsStore.getState().runtimeArgs.pairs;
  KeyValueStore.dispatch({
    type: KeyValueStoreActions.onUpdate,
    payload: getFilteredRuntimeArgs({ pairs: runtimeArgsPairs }),
  });
};

const getMacrosResolvedByPrefs = (resolvedPrefs = {}, macrosMap = {}) => {
  let resolvedMacros = { ...macrosMap };
  for (let pref in resolvedPrefs) {
    if (
      Object.prototype.hasOwnProperty.call(resolvedPrefs, pref) &&
      Object.prototype.hasOwnProperty.call(resolvedMacros, pref)
    ) {
      resolvedMacros[pref] = resolvedPrefs[pref];
    }
  }
  return resolvedMacros;
};

const updatePreferences = (
  lifecycleManagementEditEnabled = false,
  overwriteEngineConfig = false
) => {
  const {
    runtimeArgs,
    properties,
    pipelineVisualConfiguration,
  } = PipelineConfigurationsStore.getState();
  let filteredRuntimeArgs = cloneDeep(runtimeArgs);
  filteredRuntimeArgs.pairs = filteredRuntimeArgs.pairs.filter(
    (runtimeArg) => !runtimeArg.provided
  );
  let appId = PipelineDetailStore.getState().name;
  let prefObj = convertKeyValuePairsObjToMap(runtimeArgs);

  if (lifecycleManagementEditEnabled) {
    const customSparkConfigKeyValuePairs = runtimeArgs.pairs.filter((pair) =>
      pair.key.startsWith(GENERATED_RUNTIMEARGS.CUSTOM_SPARK_KEY_PREFIX)
    );
    let pairs = cloneDeep(customSparkConfigKeyValuePairs);

    // engine config overwritting
    if (!overwriteEngineConfig) {
      // save from runtime args dropdown
      pairs.forEach((pair) => {
        const trimmedKey = pair.key.substring(GENERATED_RUNTIMEARGS.CUSTOM_SPARK_KEY_PREFIX.length);
        pair.key = trimmedKey;
      });
      pairs.push({
        key: '',
        value: '',
      });
      const keyValues = { pairs: pairs };
      const customConfigObj = convertKeyValuePairsObjToMap(keyValues);
      PipelineConfigurationsStore.dispatch({
        type: PipelineConfigurationsActions.SET_CUSTON_CONFIG_AND_KEY_VALUE_PAIRS,
        payload: {
          keyValues,
          customConfig: customConfigObj,
          pipelineType: pipelineVisualConfiguration.pipelineType,
        },
      });
    } else {
      // save from config tabs
      pairs.forEach((pair) => {
        delete prefObj[pair.key];
      });
      prefObj = { ...prefObj, ...properties, 'app.pipeline.overwriteConfig': 'true' };
    }
  }

  return MyPreferenceApi.setAppPreferences(
    {
      namespace: getCurrentNamespace(),
      appId,
    },
    prefObj
  );
};

const updatePipeline = () => {
  let detailStoreState = PipelineDetailStore.getState();
  let { name, description, artifact, principal } = detailStoreState;
  let { stages, connections, comments } = detailStoreState.config;

  let {
    batchInterval,
    engine,
    resources,
    driverResources,
    clientResources,
    postActions,
    properties,
    processTimingEnabled,
    stageLoggingEnabled,
    disableCheckpoints,
    checkpointDir,
    stopGracefully,
    schedule,
    maxConcurrentRuns,
    serviceAccountPath,
    pushdownEnabled,
    transformationPushdown,
  } = PipelineConfigurationsStore.getState();

  properties = Object.keys(properties).reduce(
    (obj, key) => ((obj[key] = properties[key].toString()), obj),
    {}
  );
  let commonConfig = {
    stages,
    connections,
    comments,
    resources,
    driverResources,
    postActions,
    properties,
    processTimingEnabled,
    stageLoggingEnabled,
    description,
  };

  let batchOnlyConfig = {
    engine,
    schedule,
    maxConcurrentRuns,
    pushdownEnabled,
    transformationPushdown,
  };

  let realtimeOnlyConfig = {
    batchInterval,
    clientResources,
    disableCheckpoints,
    stopGracefully,
  };

  let sqlOnlyConfig = {
    schedule,
    serviceAccountPath,
  };

  if (!disableCheckpoints) {
    realtimeOnlyConfig.checkpointDir = checkpointDir;
  }

  let config;
  if (GLOBALS.etlBatchPipelines.includes(artifact.name)) {
    config = { ...commonConfig, ...batchOnlyConfig };
  } else if (artifact.name === GLOBALS.etlDataStreams) {
    config = { ...commonConfig, ...realtimeOnlyConfig };
  } else if (artifact.name === GLOBALS.eltSqlPipeline) {
    config = { ...commonConfig, ...sqlOnlyConfig };
  }

  let publishObservable = MyPipelineApi.publish(
    {
      namespace: getCurrentNamespace(),
      appId: name,
    },
    {
      name,
      description,
      artifact,
      config,
      principal,
      /*
      Ref: CDAP-13853
      TL;DR - This is here so that when we update the pipeline we don't delete
      the existing schedules (like triggers).

      Longer version:
      The existing behavior was,
      1. User creates a pipeline
      2. Sets up a trigger
      3. Modifies the pipeline engine config

      After step 3 UI was updating the pipeline (PUT /apps/:appId)
      This used to delete any existing schedule as we have deployed/updated
      the app.

      This config will prevent CDAP from deleting existing schedules(triggers)
      when we update the pipeline
    */
      'app.deploy.update.schedules': false,
    }
  );

  // Use pipe/map and not subscribe to not break error handling on other observers
  publishObservable.pipe(
    map((returnVal) => {
      PipelineDetailStore.dispatch({
        type: PipelineDetailActions.SET_CONFIG,
        payload: { config },
      });
      return returnVal;
    })
  );

  return publishObservable;
};

/**
 *
 * @param {object} runtimeArgs - Runtime arguments that needs to be passed while starting a run
 * @param {boolean} publishEventsToStore - Boolean to determine we need to publish events to the store.
 *   This is needed in cases where start the run from runtime arguments modal and have the result (success or failure)
 * be presented inside the modal instead of globally publishing them.
 */
const runPipeline = (runtimeArgs, publishEventsToStore = true) => {
  publishEventsToStore && setRunButtonLoading(true);
  let { name, artifact } = PipelineDetailStore.getState();

  let params = {
    namespace: getCurrentNamespace(),
    appId: name,
    programType: GLOBALS.programType[artifact.name],
    programId: GLOBALS.programId[artifact.name],
    action: 'start',
  };
  let observerable$ = MyProgramApi.action(params, runtimeArgs);
  if (publishEventsToStore) {
    observerable$.subscribe(
      () => {},
      (err) => {
        setRunButtonLoading(false);
        setRunError(err.response || err);
      }
    );
  }
  return observerable$;
};

const schedulePipeline = () => {
  scheduleOrSuspendPipeline(MyPipelineApi.schedule);
};

const suspendSchedule = () => {
  scheduleOrSuspendPipeline(MyPipelineApi.suspend);
};

const scheduleOrSuspendPipeline = (scheduleApi) => {
  setScheduleButtonLoading(true);
  let { name } = PipelineDetailStore.getState();

  let params = {
    namespace: getCurrentNamespace(),
    appId: name,
    scheduleId: GLOBALS.defaultScheduleId,
  };
  scheduleApi(params).subscribe(
    () => {
      setScheduleButtonLoading(false);
      fetchScheduleStatus(params);
    },
    (err) => {
      setScheduleButtonLoading(false);
      setScheduleError(err.response || err);
    }
  );
};

const getCustomizationMap = (properties) => {
  let profileCustomizations = {};
  Object.keys(properties).forEach((prop) => {
    if (prop.indexOf(CLOUD.PROFILE_PROPERTIES_PREFERENCE) !== -1) {
      let propName = prop.replace(`${CLOUD.PROFILE_PROPERTIES_PREFERENCE}.`, '');
      profileCustomizations[propName] = properties[prop];
    }
  });
  return profileCustomizations;
};

const fetchAndUpdateRuntimeArgs = () => {
  const params = {
    namespace: getCurrentNamespace(),
    appId: PipelineDetailStore.getState().name,
  };

  let observable$ = Observable.forkJoin(
    MyPipelineApi.fetchMacros(params),
    MyPreferenceApi.getAppPreferences(params),
    // This is required to resolve macros from preferences
    // Say DEFAULT_STREAM is a namespace level preference used as a macro
    // in one of the plugins in the pipeline.
    MyPreferenceApi.getAppPreferencesResolved(params)
  );

  observable$.subscribe((res) => {
    let macrosSpec = res[0];
    let macrosMap = {};
    let macros = [];
    macrosSpec.map((ms) => {
      if (objectQuery(ms, 'spec', 'properties', 'macros', 'lookupProperties')) {
        macros = macros.concat(ms.spec.properties.macros.lookupProperties);
      }
    });
    macros.forEach((macro) => {
      macrosMap[macro] = '';
    });

    let currentAppPrefs = res[1];
    let currentAppResolvedPrefs = res[2];
    let resolvedMacros = getMacrosResolvedByPrefs(currentAppResolvedPrefs, macrosMap);
    // When a pipeline is published there won't be any profile related information
    // at app level preference. However the pipeline, when run will be run with the 'default'
    // profile that is set at the namespace level. So we populate in UI the default
    // profile for a pipeline until the user choose something else. This is populated from
    // resolved app level preference which will provide preferences from namespace.
    const isProfileProperty = (property) =>
      [CLOUD.PROFILE_NAME_PREFERENCE_PROPERTY, CLOUD.PROFILE_PROPERTIES_PREFERENCE].filter(
        (profilePrefix) => property.indexOf(profilePrefix) !== -1
      ).length;
    Object.keys(currentAppResolvedPrefs).forEach((resolvePref) => {
      if (isProfileProperty(resolvePref) !== 0) {
        currentAppPrefs[resolvePref] = currentAppResolvedPrefs[resolvePref];
      }
    });

    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_RESOLVED_MACROS,
      payload: { resolvedMacros },
    });
    const getPairs = (map) =>
      Object.entries(map)
        .filter(([key]) => key.length)
        .map(([key, value]) => ({
          key,
          value,
          uniqueId: uuidV4(),
        }));
    let runtimeArgsPairs = getPairs(currentAppPrefs);
    let resolveMacrosPairs = getPairs(resolvedMacros);
    let finalRunTimeArgsPairs = uniqBy(
      runtimeArgsPairs.concat(resolveMacrosPairs),
      (pair) => pair.key
    );
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
      payload: {
        runtimeArgs: {
          pairs: finalRunTimeArgsPairs,
        },
      },
    });
    updateKeyValueStore();
  });
  return observable$;
};

const reset = () => {
  PipelineConfigurationsStore.dispatch({
    type: PipelineConfigurationsActions.RESET,
  });
};

export {
  getFilteredRuntimeArgs,
  updateRunTimeArgs,
  updateKeyValueStore,
  getMacrosResolvedByPrefs,
  updatePipeline,
  updatePreferences,
  runPipeline,
  schedulePipeline,
  suspendSchedule,
  getCustomizationMap,
  fetchAndUpdateRuntimeArgs,
  reset,
  updatePreviewRecords,
  updatePreviewTimeout,
};
