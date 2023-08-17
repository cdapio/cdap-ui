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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconSVG from 'components/shared/IconSVG';
import KeyValuePairs from 'components/shared/KeyValuePairs';
import Popover from 'components/shared/Popover';
import PipelineConfigurationsStore, {
  getEngineDisplayLabel,
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import {
  convertKeyValuePairsToMap,
  convertMapToKeyValuePairs,
} from 'services/helpers';
import { convertKeyValuePairsObjToMap } from 'components/shared/KeyValuePairs/KeyValueStoreActions';
import T from 'i18n-react';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

const PREFIX = 'features.PipelineConfigurations.EngineConfig';

const CUSTOM_SPARK_KEY_PREFIX = 'system.spark.';

const getCustomConfigValue = (customConfigKeyValuePairs, runtimeArgs) => {
  // we want to try getting the custom config from runtimeargs
  // only when the state of custom config store is {key: '', value: ''}
  if (
    customConfigKeyValuePairs.pairs.length > 1 ||
    customConfigKeyValuePairs.pairs[0].key !== ''
  ) {
    return customConfigKeyValuePairs;
  }
  const customSparkConfigKeyValuePairs = runtimeArgs.pairs.filter((pair) =>
    pair.key.startsWith(CUSTOM_SPARK_KEY_PREFIX)
  );
  const customSparkConfigPairs = cloneDeep(customSparkConfigKeyValuePairs);
  customSparkConfigPairs.forEach((pair) => {
    const trimmedKey = pair.key.substring(CUSTOM_SPARK_KEY_PREFIX.length);
    pair.key = trimmedKey;
  });
  customSparkConfigPairs.push({
    key: '',
    value: '',
  });
  const keyValues = { pairs: customSparkConfigPairs };
  return keyValues;
};

const mapStateToCustomConfigKeyValuesProps = (state) => {
  return {
    keyValues: getCustomConfigValue(
      state.customConfigKeyValuePairs,
      state.runtimeArgs
    ),
  };
};

const mapDispatchToCustomConfigKeyValuesProps = (dispatch, ownProps) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  return {
    onKeyValueChange: (keyValues) => {
      dispatch({
        type: PipelineConfigurationsActions.SET_CUSTOM_CONFIG_KEY_VALUE_PAIRS,
        payload: { keyValues },
      });
      const customConfigObj = convertKeyValuePairsObjToMap(keyValues);
      dispatch({
        type: PipelineConfigurationsActions.SET_CUSTOM_CONFIG,
        payload: {
          customConfig: customConfigObj,
          pipelineType: ownProps.pipelineType,
        },
      });
      if (lifecycleManagementEditEnabled) {
        const { runtimeArgs } = PipelineConfigurationsStore.getState();
        const pairs = [...runtimeArgs.pairs];
        const runtimeObj = convertKeyValuePairsToMap(pairs, true);
        // delete previous tranformation pushdown key valur pairs from runtimeargs
        // so that we are not keeping outdated configs in the runtimeargs
        const previousCustomConfigKeyValuePair = runtimeArgs.pairs.filter((pair) =>
          pair.key.startsWith(CUSTOM_SPARK_KEY_PREFIX)
        );
        previousCustomConfigKeyValuePair.forEach((pair) => {
          delete runtimeObj[pair.key];
        });
        keyValues.pairs.forEach((pair) => {
          runtimeObj[CUSTOM_SPARK_KEY_PREFIX + pair.key] = String(pair.value);
        });
        const newRunTimePairs = convertMapToKeyValuePairs(runtimeObj);
        dispatch({
          type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
          payload: { runtimeArgs: { pairs: newRunTimePairs } },
        });
      }
    },
  };
};

const ConnectedCustomConfigKeyValuePairs = connect(
  mapStateToCustomConfigKeyValuesProps,
  mapDispatchToCustomConfigKeyValuesProps
)(KeyValuePairs);

const mapStateToCustomConfigProps = (state, ownProps) => {
  return {
    isDetailView: ownProps.isDetailView,
    pipelineType: ownProps.pipelineType,
    showCustomConfig: ownProps.showCustomConfig,
    toggleCustomConfig: ownProps.toggleCustomConfig,
    engine: state.engine,
    customConfigKeyValuePairs: state.customConfigKeyValuePairs,
  };
};

const CustomConfig = ({
  isDetailView,
  pipelineType,
  showCustomConfig,
  toggleCustomConfig,
  engine,
  customConfigKeyValuePairs,
}) => {
  const { runtimeArgs } = PipelineConfigurationsStore.getState();
  const engineDisplayLabel = getEngineDisplayLabel(engine, pipelineType);
  const numberOfCustomConfigFilled = getCustomConfigValue(
    customConfigKeyValuePairs,
    runtimeArgs
  ).pairs.filter((pair) => !isEmpty(pair.key) && !isEmpty(pair.value)).length;

  const StudioViewCustomConfigLabel = () => {
    return (
      <span className="add-custom-config-headers">
        <a
          className="add-custom-config-label"
          onClick={toggleCustomConfig}
          data-cy="engine-config-tab-custom"
        >
          <IconSVG
            name={showCustomConfig ? 'icon-caret-down' : 'icon-caret-right'}
          />
          {T.translate(`${PREFIX}.showCustomConfig`)}
        </a>
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
        >
          {T.translate(`${PREFIX}.customConfigTooltip`, { engineDisplayLabel })}
        </Popover>
        {showCustomConfig ? (
          <span>
            <span className="float-right num-rows">
              {T.translate(`${PREFIX}.customConfigCount`, {
                context: numberOfCustomConfigFilled,
              })}
            </span>
            <hr />
          </span>
        ) : null}
      </span>
    );
  };

  const DetailViewCustomConfigLabel = () => {
    return (
      <div>
        <hr />
        <div className="add-custom-config-headers">
          <label>{T.translate(`${PREFIX}.customConfig`)}</label>
          <Popover
            target={() => <IconSVG name="icon-info-circle" />}
            showOn="Hover"
            placement="right"
          >
            {T.translate(`${PREFIX}.customConfigTooltip`, {
              engineDisplayLabel,
            })}
          </Popover>
          <span className="float-right num-rows">
            {T.translate(`${PREFIX}.customConfigCount`, {
              context: numberOfCustomConfigFilled,
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="add-custom-config">
      {isDetailView ? (
        <DetailViewCustomConfigLabel />
      ) : (
        <StudioViewCustomConfigLabel />
      )}
      {isDetailView || showCustomConfig ? (
        <div>
          <div className="custom-config-labels key-value-pair-labels">
            <span className="key-label">
              {T.translate('commons.nameLabel')}
            </span>
            <span className="value-label">
              {T.translate('commons.keyValPairs.valueLabel')}
            </span>
          </div>
          <div className="custom-config-values key-value-pair-values">
            <ConnectedCustomConfigKeyValuePairs pipelineType={pipelineType} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

CustomConfig.propTypes = {
  isDetailView: PropTypes.bool,
  pipelineType: PropTypes.string,
  showCustomConfig: PropTypes.bool,
  toggleCustomConfig: PropTypes.func,
  engine: PropTypes.string,
  customConfigKeyValuePairs: PropTypes.object,
};

const ConnectedCustomConfig = connect(mapStateToCustomConfigProps)(
  CustomConfig
);

export default ConnectedCustomConfig;
