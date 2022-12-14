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
import T from 'i18n-react';
import SwitchInputComponent from 'components/common/Switch';
import { NormalFont } from 'components/common/TypographyText';
import { DividerBoxToggler, FlexJustifyAlignCenter } from 'components/common/BoxContainer';
import { Divider } from 'components/WranglerGrid/TransformationToolbar/iconStore';

const PREFIX = 'features.WranglerNewUI.GridPage';

interface IFunctionNameToggleProps {
  setShowName: React.Dispatch<React.SetStateAction<boolean>>;
  showName: boolean;
}

export default function({ setShowName, showName }: IFunctionNameToggleProps) {
  return (
    <FlexJustifyAlignCenter data-testid="transformations-toolbar-icons-function-name-toggler">
      <NormalFont component="div" data-testid="name-toggle-child-label">
        {T.translate(`${PREFIX}.toolbarIcons.labels.toggleDescription`)}
      </NormalFont>
      <SwitchInputComponent
        setShow={setShowName}
        show={showName}
        inputProps={{
          'aria-label': T.translate(`${PREFIX}.gridHeader.ariaLabels.functionsName`).toString(),
          'data-testid': 'transformations-toolbar-icons-function-name-toggler',
        }}
      />
      <DividerBoxToggler> {Divider}</DividerBoxToggler>
    </FlexJustifyAlignCenter>
  );
}
