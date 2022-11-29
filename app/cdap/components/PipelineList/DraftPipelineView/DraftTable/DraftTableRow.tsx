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

import * as React from 'react';
import T from 'i18n-react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { humanReadableDate } from 'services/helpers';
import DraftActions from 'components/PipelineList/DraftPipelineView/DraftActions';
import { IDraft } from 'components/PipelineList/DraftPipelineView/types';
import { useEffect, useState } from 'react';
import { MyPipelineApi } from 'api/pipeline';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

interface IProps {
  draft: IDraft;
}

const PREFIX = 'features.PipelineList';

export const DraftTableRow = ({ draft }: IProps) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  const [editStageMessage, setEditStageMessage] = useState('--');

  const namespace = getCurrentNamespace();
  const lastSaved = humanReadableDate(
    draft.needsUpgrade ? draft.__ui__.lastSaved : draft.updatedTimeMillis,
    true
  );

  const stateParams = {
    namespace,
    draftId: draft.needsUpgrade ? draft.__ui__.draftId : draft.id,
  };

  if (draft.parentVersion) {
    Object.assign(stateParams, { isEdit: true });
  }

  const link = window.getHydratorUrl({
    stateName: 'hydrator.create',
    stateParams,
  });

  useEffect(() => {
    if (draft.parentVersion) {
      // check the status of the draft
      const params = {
        namespace: getCurrentNamespace(),
        appId: draft.name,
      };
      MyPipelineApi.get(params).subscribe(
        (res) => {
          if (res.appVersion === draft.parentVersion) {
            // draft parentVersion is the same as the latest appVersion
            setEditStageMessage('In-Progress');
          } else {
            setEditStageMessage('Obsolete');
          }
        },
        (err) => {
          // Draft's corresponding pipeline is deleted/missing
          setEditStageMessage('Orphaned');
        }
      );
    }
  }, []);

  return (
    <a href={link} className="grid-row" data-cy={`draft-${draft.name}`}>
      <div title={draft.name}>{draft.name}</div>
      {lifecycleManagementEditEnabled ? <div>{editStageMessage}</div> : <div></div>}
      <div>{T.translate(`${PREFIX}.${draft.artifact.name}`)}</div>
      <div>{lastSaved}</div>

      <DraftActions draft={draft} />
    </a>
  );
};
