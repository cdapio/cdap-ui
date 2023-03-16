/*
 * Copyright © 2017-2023 Cask Data, Inc.
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

import React, { useReducer } from 'react';
import T from 'i18n-react';
import uuidV4 from 'uuid/v4';
import styled from 'styled-components';
import PlusButtonStore from 'services/PlusButtonStore';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { validateImportJSON, adjustConfigNode } from 'services/PipelineErrorFactory';
import { objectQuery } from 'services/helpers';
import IconSVG from 'components/shared/IconSVG';
import PrimaryOutlinedButton from 'components/shared/Buttons/PrimaryOutlinedButton';
import { defaultState, PullPipelineWizard, reducer } from './PullPipelineWizard';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { validateSourceControlManagement } from 'components/NamespaceAdmin/store/ActionCreator';
import ButtonLoadingHoc from 'components/shared/Buttons/ButtonLoadingHoc';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';

require('./ResourceCenterPipelineEntity.scss');

const PREFIX = 'features.Resource-Center.HydratorPipeline';

const PrimaryOutlinedLoadingButton = ButtonLoadingHoc(PrimaryOutlinedButton);

const StyledButton = styled(PrimaryOutlinedLoadingButton)`
  margin-left: 10px;
`;

interface IResourceCenterPipelineEntityProps {
  onError: (label: any, message: any) => void;
}

export default function ResourceCenterPipelineEntity({
  onError,
}: IResourceCenterPipelineEntityProps) {
  const sourceControlManagementEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.git.enabled'
  );
  const namespace = getCurrentNamespace();
  const resourceCenterId = uuidV4();
  const hydratorLinkStateParams = {
    namespace,
    artifactType: 'cdap-data-pipeline',
  };

  const hydratorCreateLink = getHydratorUrl({
    stateName: 'hydrator.create',
    stateParams: hydratorLinkStateParams,
  });
  const hydratorImportLink = getHydratorUrl({
    stateName: 'hydrator.create',
    stateParams: {
      ...hydratorLinkStateParams,
      resourceCenterId,
    },
  });

  const createBtnHandler = () => {
    PlusButtonStore.dispatch({
      type: 'TOGGLE_PLUSBUTTON_MODAL',
      payload: {
        modalState: false,
      },
    });
  };

  const importBtnHandler = (event) => {
    if (!objectQuery(event, 'target', 'files', 0)) {
      return;
    }

    const uploadedFile = event.target.files[0];

    if (uploadedFile.type !== 'application/json') {
      onError(T.translate(`${PREFIX}.errorLabel`), T.translate(`${PREFIX}.nonJSONError`));
      return;
    }

    const reader = new FileReader();
    reader.readAsText(uploadedFile, 'UTF-8');

    reader.onload = (evt) => {
      let fileDataString = evt.target.result;
      const error = validateImportJSON(fileDataString);
      if (error) {
        onError(T.translate(`${PREFIX}.errorLabel`), error);
        return;
      }
      fileDataString = adjustConfigNode(fileDataString);

      onError(null, null);
      window.localStorage.setItem(resourceCenterId, String(fileDataString));
      window.location.href = hydratorImportLink;
    };
  };

  const [pullPipelineModalState, dispatch] = useReducer(reducer, defaultState);

  const pullPipelineBtnHandler = () => {
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    validateSourceControlManagement(namespace).subscribe(
      () => {
        dispatch({ type: 'TOGGLE_MODAL' });
      },
      (err) => {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            error: T.translate('features.SourceControlManagement.invalidConfig', {
              error: err.message,
            }).toLocaleString(),
          },
        });
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      },
      () => {
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    );
  };

  return (
    <>
      <div className="resourcecenter-entity-card resourcecenter-entity-card-pipeline">
        <div className="image-content-container">
          <div className="image-container">
            <div className="entity-image">
              <IconSVG name="icon-pipelines" />
            </div>
          </div>
          <div className="content-container">
            <div className="content-text">
              <h4>{T.translate(`${PREFIX}.label`)}</h4>
              <p>{T.translate(`${PREFIX}.description`)}</p>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <PrimaryContainedButton
            href={hydratorCreateLink}
            id="create-pipeline-link"
            className="btn btn-primary"
            onClick={createBtnHandler}
          >
            {T.translate(`${PREFIX}.actionbtn0`)}
          </PrimaryContainedButton>
          <input
            type="file"
            accept=".json"
            id="resource-center-import-pipeline"
            onChange={importBtnHandler}
          />
          <label htmlFor="resource-center-import-pipeline">
            <StyledButton
              id={(
                T.translate(`${PREFIX}.actionbtn1`) +
                '-' +
                T.translate(`${PREFIX}.label`)
              ).toLowerCase()}
              component="span"
            >
              {T.translate(`${PREFIX}.actionbtn1`)}
            </StyledButton>
          </label>
          {sourceControlManagementEnabled && (
            <StyledButton
              onClick={pullPipelineBtnHandler}
              loading={pullPipelineModalState.loading}
              data-testid="pull-pipeline-button"
            >
              {T.translate(`${PREFIX}.actionbtn2`)}
            </StyledButton>
          )}
        </div>
      </div>
      <PullPipelineWizard
        isOpen={pullPipelineModalState.isOpen}
        error={pullPipelineModalState.error}
        dispatch={dispatch}
      />
    </>
  );
}
