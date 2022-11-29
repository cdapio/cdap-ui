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
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import T from 'i18n-react';
import { ErrorFont } from 'components/common/TypographyText';
import { NewColumnWrapper } from 'components/common/BoxContainer';
import { FormGroupFullWidthComponent } from 'components/common/FormComponents';

interface INewColumnProps {
  column: string;
  setColumnName: React.Dispatch<React.SetStateAction<string>>;
  isError: boolean;
}

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.common';

export default function({ column, setColumnName, isError }: INewColumnProps) {
  return (
    <NewColumnWrapper data-testid="new-column-wrapper-parent">
      <FormGroupFullWidthComponent>
        <LabelComponent labelText={`${T.translate(`${PREFIX}.nameNewColumn`)}`} />
        <FormInputFieldComponent
          formInputValue={column}
          inputProps={{
            type: 'text',
            value: column,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColumnName(e.target.value),
            color: 'primary',
            placeholder: `${T.translate(`${PREFIX}.destinationColumn`)}`,
            inputProps: {
              'data-testid': `new-column-name-input`,
            },
          }}
        />
        {isError && (
          <ErrorFont component="p" data-testid="error-text">
            {T.translate(`${PREFIX}.columnExist`)}
          </ErrorFont>
        )}
      </FormGroupFullWidthComponent>
    </NewColumnWrapper>
  );
}
