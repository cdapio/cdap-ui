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

import NumberWidget from 'components/AbstractWidget/FormInputs/Number';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import { updatePreviewTimeout } from 'components/PipelineConfigurations/Store/ActionCreator';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import React, { useState } from 'react';
import T from 'i18n-react';
import { BorderedDiv } from './styles';

const PREFIX = 'features.PipelineConfigurations.PipelineConfig';

export const RealtimePipelinePreviewConfig = () => {
  const { previewTimeoutInMin } = PipelineConfigurationsStore.getState();
  const [previewTimeout, setPreviewTimeout] = useState(previewTimeoutInMin);

  const onPreviewTimeoutChange = (changedPreviewTimeout) => {
    updatePreviewTimeout(changedPreviewTimeout);
    setPreviewTimeout(changedPreviewTimeout);
  };

  return (
    <div
      className="configuration-step-content configuration-content-container realtime-content"
      id="preview-config-tab-content"
    >
      <div className="step-content-heading">Set how long you want to run your preview</div>
      <div className="label-with-toggle timeout-in-minutes row">
        <span className="toggle-label col-xs-5">Time to run preview</span>
        <div className="col-xs-7 num-preview-input-col">
          <div className="toggle-container">
            <BorderedDiv>
              <NumberWidget value={previewTimeout} onChange={onPreviewTimeoutChange} />
            </BorderedDiv>
            <span className="control-label min">min</span>
            <Popover
              target={() => <IconSVG name="icon-info-circle" />}
              showOn="Hover"
              placement="right"
            >
              {T.translate(`${PREFIX}.previewTimeoutTooltip`)}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
