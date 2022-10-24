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

import React from 'react';
import PipelineTriggers from 'components/PipelineTriggers';
import TriggeredPipelines from 'components/TriggeredPipelines';
import { FeatureProvider } from 'services/react/providers/featureFlagProvider';
import { Theme } from 'services/ThemeHelper';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

interface IPipelineTriggersSidebarsProps {
  pipelineName: string;
  namespace: string;
  pipelineType: string;
}

export default function PipelineTriggersSidebars(props) {
  return (
    <FeatureProvider>
      <PipelineTriggersWithFeatures {...props} />
    </FeatureProvider>
  );
}

function PipelineTriggersWithFeatures({
  pipelineName,
  namespace,
  pipelineType,
}: IPipelineTriggersSidebarsProps) {
  if (Theme.showTriggers === false) {
    return null;
  }

  const pipelineCompositeTriggersEnabled = useFeatureFlagDefaultFalse(
    'pipeline.composite.triggers.enabled'
  );

  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );

  return (
    <div className="pipeline-triggers-sidebar-container">
      <PipelineTriggers
        {...{
          pipelineCompositeTriggersEnabled,
          lifecycleManagementEditEnabled,
          pipelineName,
          namespace,
          pipelineType,
        }}
      />
      <TriggeredPipelines
        pipelineName={pipelineName}
        pipelineCompositeTriggersEnabled={pipelineCompositeTriggersEnabled}
      />
    </div>
  );
}
