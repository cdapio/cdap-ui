/*
 * Copyright © 2018-2022 Cask Data, Inc.
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

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';

import PushdownConfig from 'components/PushdownConfig';
import { GENERATED_RUNTIMEARGS } from 'services/global-constants';
import {
  convertKeyValuePairsToMap,
  convertMapToKeyValuePairs,
  flattenObj,
  unflatternStringToObj,
} from 'services/helpers';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

const getPushdownEnabledValue = (state) => {
  const pushdownEnabledKeyValuePair = state.runtimeArgs.pairs.find(
    (pair) => pair.key === GENERATED_RUNTIMEARGS.PIPELINE_PUSHDOWN_ENABLED
  );
  return pushdownEnabledKeyValuePair
    ? pushdownEnabledKeyValuePair.value === 'true'
    : state.pushdownEnabled;
};

const getTransformationPushdownValue = (state) => {
  if (state.transformationPushdown) {
    return state.transformationPushdown;
  }
  const transformationPushdownKeyValuePair = state.runtimeArgs.pairs.filter((pair) =>
    pair.key.startsWith(GENERATED_RUNTIMEARGS.PIPELINE_TRANSFORMATION_PUSHDOWN_PREFIX)
  );
  const pushdownObject = {};
  transformationPushdownKeyValuePair.forEach((pair) => {
    // unflattern the runtimeargs key and put it in pushdown object
    const trimmedKey = pair.key.substring(
      GENERATED_RUNTIMEARGS.PIPELINE_TRANSFORMATION_PUSHDOWN_PREFIX.length
    );
    unflatternStringToObj(pushdownObject, trimmedKey, pair.value);
  });
  return pushdownObject;
};

export default function PushdownTabContent({}) {
  const value = useSelector(
    (state) => ({
      pushdownEnabled: getPushdownEnabledValue(state),
      transformationPushdown: getTransformationPushdownValue(state),
    }),
    shallowEqual
  );
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  const stages = useSelector((state) => state.stages);
  const cloudArtifact = useMemo(
    () => stages.map((x) => x.plugin.artifact).find((artifact) => artifact.name === 'google-cloud'),
    [stages]
  );
  const dispatch = useDispatch();
  const onChange = useCallback(
    ({ pushdownEnabled, transformationPushdown }) => {
      dispatch({
        type: PipelineConfigurationsActions.SET_PUSHDOWN_CONFIG,
        payload: { pushdownEnabled, transformationPushdown },
      });
      if (lifecycleManagementEditEnabled) {
        const { runtimeArgs } = PipelineConfigurationsStore.getState();
        const pairs = [...runtimeArgs.pairs];
        const runtimeObj = convertKeyValuePairsToMap(pairs, true);
        // delete previous tranformation pushdown key valur pairs from runtimeargs
        // so that we are not keeping outdated configs in the runtimeargs
        const previousTransformationPushdownKeyValuePair = runtimeArgs.pairs.filter((pair) =>
          pair.key.startsWith(GENERATED_RUNTIMEARGS.PIPELINE_TRANSFORMATION_PUSHDOWN_PREFIX)
        );
        previousTransformationPushdownKeyValuePair.forEach((pair) => {
          delete runtimeObj[pair.key];
        });
        runtimeObj[GENERATED_RUNTIMEARGS.PIPELINE_PUSHDOWN_ENABLED] = pushdownEnabled.toString();
        // if pushdown is not enabled, do not add any pushdown configs to runtimeargs
        if (pushdownEnabled) {
          const flattenedTransformationPushdown = flattenObj(transformationPushdown);
          for (const key of Object.keys(flattenedTransformationPushdown)) {
            if (flattenedTransformationPushdown[key] != null) {
              runtimeObj[
                GENERATED_RUNTIMEARGS.PIPELINE_TRANSFORMATION_PUSHDOWN_PREFIX + key
              ] = String(flattenedTransformationPushdown[key]);
            }
          }
        }
        const newRunTimePairs = convertMapToKeyValuePairs(runtimeObj);
        dispatch({
          type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
          payload: { runtimeArgs: { pairs: newRunTimePairs } },
        });
      }
    },
    [dispatch]
  );
  return (
    <div className="configuration-step-content configuration-content-container">
      <PushdownConfig value={value} onValueChange={onChange} cloudArtifact={cloudArtifact} />
    </div>
  );
}
