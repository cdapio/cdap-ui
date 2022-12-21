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

import React, { useState } from 'react';
import { updateRunTimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';
import RuntimeArgsPairs from 'components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsKeyValuePairWrapper/RuntimeArgsPairsMaterial';
import { connect } from 'react-redux';
import { getDefaultKeyValuePair } from 'components/shared/KeyValuePairs/KeyValueStore';
import { arrayOfStringsMatchTargetPrefix, preventPropagation } from 'services/helpers';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import T from 'i18n-react';
import styled from 'styled-components';
import { GENERATED_RUNTIMEARGS } from 'services/global-constants';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

require('./RuntimeArgsKeyValuePairWrapper.scss');

const PREFIX =
  'features.PipelineDetails.PipelineRuntimeArgsDropdownBtn.RuntimeArgsTabContent.RuntimeArgsModeless';

interface IRuntimeArgsKeyValuePairWrapperProps {
  isHistoricalRun: boolean;
  runtimeArgs: any;
  onRuntimeArgsChange: (val: any) => void;
  dataCy?: string;
  dataTestId?: string;
}

const LabelSpan = styled.span`
  display: flex;
  flex-direction: row;
  margin-top: 10px;

  * {
    margin-left: 5px;
  }

  span {
    color: #999999;
  }
`;

const RuntimeArgsKeyValuePairWrapper = ({
  isHistoricalRun,
  runtimeArgs,
  onRuntimeArgsChange,
  dataCy = 'runtimeargs-deployed',
  dataTestId = 'runtimeargs-deployed',
}: IRuntimeArgsKeyValuePairWrapperProps) => {
  const [showGeneratedArgs, setShowGeneratedArgs] = useState(false);
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  const toggleGeneratedArgs = () => {
    setShowGeneratedArgs(!showGeneratedArgs);
  };
  const numOfGeneratedRuntimeArgs = runtimeArgs.pairs.filter((pair) =>
    arrayOfStringsMatchTargetPrefix(Object.values(GENERATED_RUNTIMEARGS), pair.key)
  ).length;

  const runtimeArgsChanged = (changedArgs) => {
    const newArgs = changedArgs.length ? changedArgs : [getDefaultKeyValuePair()];
    updateRunTimeArgs({ pairs: newArgs });
    if (typeof onRuntimeArgsChange === 'function') {
      onRuntimeArgsChange({ pairs: newArgs });
    }
  };

  const DetailViewRuntimeArgsLabel = () => {
    return (
      <LabelSpan>
        <a
          onClick={toggleGeneratedArgs}
          data-cy="generated-runtimeargs"
          data-testid="generated-runtimeargs"
        >
          <IconSVG name={showGeneratedArgs ? 'icon-caret-down' : 'icon-caret-right'} />
          {T.translate(`${PREFIX}.showReservedKeys`)}
        </a>
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
        >
          {T.translate(`${PREFIX}.tooltipLabel`)}
        </Popover>
        <span>
          <span className="float-right num-rows">
            {T.translate(`${PREFIX}.numOfGeneratedRuntimeArgs`, {
              context: numOfGeneratedRuntimeArgs,
            })}
          </span>
        </span>
      </LabelSpan>
    );
  };

  const reorderArgsPairs = (pairs) => {
    // make auto generated args at top
    return pairs.sort((a, b) => {
      if (arrayOfStringsMatchTargetPrefix(Object.values(GENERATED_RUNTIMEARGS), a.key)) {
        return -1;
      }
      return 1;
    });
  };

  const argsPairs = runtimeArgs ? reorderArgsPairs(runtimeArgs.pairs) : [];
  return (
    <>
      {lifecycleManagementEditEnabled && <DetailViewRuntimeArgsLabel />}
      <div
        id="runtime-arguments-key-value-pairs-wrapper"
        className="configuration-step-content configuration-content-container"
      >
        <div
          className="runtime-arguments-values key-value-pair-values"
          onClick={preventPropagation}
        >
          <RuntimeArgsPairs
            widgetProps={{
              'key-placeholder': 'Key',
              'value-placeholder': 'Value',
            }}
            onChange={runtimeArgsChanged}
            value={argsPairs}
            dataCy={dataCy}
            dataTestId={dataTestId}
            showGeneratedArgs={showGeneratedArgs}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    runtimeArgs: state.runtimeArgs,
    dataCy: ownProps.dataCy,
  };
};

const ConnectedRuntimeArgsKeyValuePairWrapper = connect(mapStateToProps)(
  RuntimeArgsKeyValuePairWrapper
);

export default ConnectedRuntimeArgsKeyValuePairWrapper;
