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

import React, { useState } from 'react';
import { updateRunTimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';
import RuntimeArgsPairs from 'components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsKeyValuePairWrapper/RuntimeArgsPairsMaterial';
import { connect } from 'react-redux';
import { getDefaultKeyValuePair } from 'components/shared/KeyValuePairs/KeyValueStore';
import { preventPropagation } from 'services/helpers';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import T from 'i18n-react';
import styled from 'styled-components';
import { CLOUD } from 'services/global-constants';

require('./RuntimeArgsKeyValuePairWrapper.scss');

const PREFIX =
  'features.PipelineDetails.PipelineRuntimeArgsDropdownBtn.RuntimeArgsTabContent.RuntimeArgsModeless';

interface IRuntimeArgsKeyValuePairWrapperProps {
  isHistoricalRun: boolean;
  runtimeArgs: any;
  onRuntimeArgsChange: (val: any) => void;
  dataCy?: string;
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
}: IRuntimeArgsKeyValuePairWrapperProps) => {
  const [showGeneratedArgs, setShowGeneratedArgs] = useState(false);
  const toggleGeneratedArgs = () => {
    setShowGeneratedArgs(!showGeneratedArgs);
  };
  const numOfGeneratedRuntimeArgs = runtimeArgs.pairs
    .map((pair) => pair.key)
    .filter(
      (key) => Object.values(CLOUD).includes(key) || key.startsWith(CLOUD.CUSTOM_SPARK_KEY_PREFIX)
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
      if (Object.values(CLOUD).includes(a.key) || a.key.startsWith(CLOUD.CUSTOM_SPARK_KEY_PREFIX)) {
        return -1;
      }
      return 1;
    });
  };

  const argsPairs = runtimeArgs ? reorderArgsPairs(runtimeArgs.pairs) : [];
  return (
    <>
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
