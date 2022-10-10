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
import React, { useState } from 'react';
import { updatePreviewRecords } from 'components/PipelineConfigurations/Store/ActionCreator';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import Popover from 'components/shared/Popover';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
import { BorderedDiv } from './styles';

const PREFIX = 'features.PipelineConfigurations.PipelineConfig';

export const BatchPipelinePreviewConfig = () => {
  const { numOfRecordsPreview } = PipelineConfigurationsStore.getState();
  const [numForDisplay, setNumForDisplay] = useState(numOfRecordsPreview);

  const onPreviewRecordsChange = (changedPreviewRecords) => {
    updatePreviewRecords(changedPreviewRecords);
    setNumForDisplay(changedPreviewRecords);
  };

  return (
    <div
      className="configuration-step-content configuration-content-container batch-content"
      id="preview-config-tab-content"
    >
      <div className="step-content-heading">Set the number of records to preview</div>
      <div className="label-with-toggle num-records-preview row">
        <span className="toggle-label col-xs-5">Number of records to preview</span>
        <div className="col-xs-7 num-preview-input-col">
          <div className="toggle-container">
            <BorderedDiv>
              <NumberWidget value={numForDisplay} onChange={onPreviewRecordsChange} />
            </BorderedDiv>
            <Popover
              target={() => <IconSVG name="icon-info-circle" />}
              showOn="Hover"
              placement="right"
            >
              {T.translate(`${PREFIX}.previewRecordsTooltip`)}
            </Popover>
          </div>
          <span className="num-preview-info">Max up to 5000 records</span>
        </div>
      </div>
    </div>
  );
};
