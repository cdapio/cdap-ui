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

import React, { useEffect, useState } from 'react';
import NextRun from 'components/PipelineList/DeployedPipelineView/NextRun';
import PipelineTags from 'components/PipelineList/DeployedPipelineView/PipelineTags';
import { getCurrentNamespace } from 'services/NamespaceStore';
import T from 'i18n-react';
import Status from 'components/PipelineList/DeployedPipelineView/Status';
import LastStart from 'components/PipelineList/DeployedPipelineView/LastStart';
import RunsCount from 'components/PipelineList/DeployedPipelineView/RunsCount';
import DeployedActions from 'components/PipelineList/DeployedPipelineView/DeployedActions';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import { useSelector } from 'react-redux';

interface IProps {
  pipeline: IPipeline;
  refetch: () => void;
  lifecycleManagementEditEnabled?: boolean;
}

const PREFIX = 'features.PipelineList';

export const PipelineTableRow = ({ pipeline, refetch, lifecycleManagementEditEnabled }: IProps) => {
  const [draftId, setDraftId] = useState(null);
  const { drafts } = useSelector(({ deployed }) => deployed);
  const namespace = getCurrentNamespace();

  const pipelineLink = window.getHydratorUrl({
    stateName: 'hydrator.detail',
    stateParams: {
      namespace,
      pipelineId: pipeline.name,
    },
  });

  const saveDraftIdToLocalStorage = () => {
    if (draftId) {
      window.localStorage.setItem('editDraftId', draftId);
    }
  };

  useEffect(() => {
    const filteredDraft = drafts.filter(
      (draft) =>
        draft.name === pipeline.name &&
        draft.artifact.name === pipeline.artifact.name &&
        draft.parentVersion
    );
    if (filteredDraft.length === 0) {
      // currently there's no edit draft saved for this pipeline
      return;
    }
    setDraftId(filteredDraft[0].id);
  }, []);

  return (
    <a href={pipelineLink} onClick={saveDraftIdToLocalStorage} className="grid-row">
      <div className="name" title={pipeline.name}>
        {pipeline.name}
      </div>
      <div className="type">{T.translate(`${PREFIX}.${pipeline.artifact.name}`)}</div>
      <Status pipeline={pipeline} />
      <LastStart pipeline={pipeline} />
      <NextRun pipeline={pipeline} />
      <RunsCount pipeline={pipeline} />
      <PipelineTags pipeline={pipeline} />
      <DeployedActions
        pipeline={pipeline}
        refetch={refetch}
        lifecycleManagementEditEnabled={lifecycleManagementEditEnabled}
        draftId={draftId}
      />
    </a>
  );
};
