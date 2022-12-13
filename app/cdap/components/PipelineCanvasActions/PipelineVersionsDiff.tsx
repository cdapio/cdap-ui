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

import { MyPipelineApi } from 'api/pipeline';
import PipelineDetailStore from 'components/PipelineDetails/store';
import JsonDiff from 'components/shared/JsonDiff';
import React, { useEffect, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { CanvasButtonTooltip, ActionButton } from './ActionButtons/styles';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

export const PipelineVersionsDiffButton = () => {
  const { name, version, config } = PipelineDetailStore.getState();
  const [latestVersion, setLatestVersion] = useState(null);
  const [diffOpen, setDiffOpen] = useState(false);
  const [viewDiffError, setViewDiffError] = useState(null);
  const [latestConfig, setLatestConfig] = useState(null);
  const closeDiffView = () => {
    setDiffOpen(false);
  };

  useEffect(() => {
    if (!name) {
      // in studio
      return;
    }
    setViewDiffError(null);
    MyPipelineApi.get({
      namespace: getCurrentNamespace(),
      appId: name,
    }).subscribe(
      (res: any) => {
        setLatestConfig(JSON.parse(res.configuration));
        setLatestVersion(res.appVersion);
      },
      (err) => {
        setViewDiffError(err);
      }
    );
  }, []);

  const fetchConfigAndDisplayDiff = () => {
    setDiffOpen(true);
  };

  return (
    <>
      {name && (
        <>
          <CanvasButtonTooltip title="View diff against latest version">
            <ActionButton
              onClick={() => fetchConfigAndDisplayDiff()}
              disabled={latestVersion === version}
            >
              <CompareArrowsIcon />
            </ActionButton>
          </CanvasButtonTooltip>
          <JsonDiff
            isOpen={diffOpen}
            onClose={closeDiffView}
            error={viewDiffError}
            latestConfig={latestConfig}
            selectedConfig={config}
          />
        </>
      )}
    </>
  );
};
