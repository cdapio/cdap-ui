/*
 * Copyright © 2023 Cask Data, Inc.
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

import T from 'i18n-react';
import fileDownload from 'js-file-download';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import NoRecordScreen from 'components/NoRecordScreen';
import { ISnackbar } from 'components/Snackbar';
import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import RecipeStepsTable, {
  RecipeStepsTableContainer,
} from 'components/WranglerV2/RecipeStepsTable';

export const PREFIX = 'features.WranglerNewUI.RecipeStepsPanel';

interface IRecipeStepsPanelProps {
  onDrawerCloseIconClick: () => void;
  setSnackbar: (value: ISnackbar) => void;
}

const RecipeStepsPanelTableContainer = styled(RecipeStepsTableContainer)`
  &&& {
    max-height: calc(100vh - 361px);
  }
`;

export default function RecipeStepsPanel({
  onDrawerCloseIconClick,
  setSnackbar,
}: IRecipeStepsPanelProps) {
  const dataprep = useSelector((state) => state.dataprep);

  const directives = dataprep.directives;

  const onSaveButtonClick = () => {
    // TODO: integrate save recipe form when save option is selected in Actions
  };

  const onApplyButtonClick = () => {
    // TODO: integrate apply/import recipe feature when apply option is selected in Actions
  };

  const onDownloadButtonClick = () => {
    const workspaceId = dataprep.workspaceId;

    const data = directives.join('\n');
    const filename = `${workspaceId}-directives.txt`;

    fileDownload(data, filename);

    setSnackbar({
      open: true,
      message: T.translate(`${PREFIX}.recipeStepsDowloadMessage`).toString(),
      isSuccess: true,
    });
  };

  const actionsOptions: IMenuItem[] = [
    {
      label: T.translate(`${PREFIX}.saveOption`).toString(),
      value: 'save',
      clickHandler: onSaveButtonClick,
    },
    {
      label: T.translate(`${PREFIX}.applyOption`).toString(),
      value: 'apply',
      clickHandler: onApplyButtonClick,
    },
    {
      label: T.translate(`${PREFIX}.downloadOption`).toString(),
      value: 'download',
      clickHandler: onDownloadButtonClick,
    },
  ];

  return (
    <InlayDrawerWidget
      actionsOptions={actionsOptions}
      headingText={T.translate(`${PREFIX}.drawerHeader`).toString()}
      onClose={onDrawerCloseIconClick}
      position="right"
      showDivider={true}
    >
      {Boolean(directives.length) && (
        <RecipeStepsTable
          Container={RecipeStepsPanelTableContainer}
          recipeSteps={directives}
          setSnackbar={setSnackbar}
        />
      )}
      {!Boolean(directives.length) && (
        <NoRecordScreen
          subtitle={T.translate(`${PREFIX}.noRecordsSubtitle`)}
          title={T.translate(`${PREFIX}.noRecordsTitle`)}
        />
      )}
    </InlayDrawerWidget>
  );
}
