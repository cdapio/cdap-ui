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

import { Box, InputLabel, Typography } from '@material-ui/core';
import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import InputSelect from 'components/ParsingDrawer/Components/InputSelect';
import {
  CHAR_ENCODING_OPTIONS,
  FORMAT_OPTIONS,
} from 'components/ParsingDrawer/Components/ParsingPopupBody/parsingOptions';
import { IOptions, IParsingPopupBodyProps } from 'components/ParsingDrawer/types';
import T from 'i18n-react';
import React, { ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';

const CheckBox = styled(InputCheckbox)`
  display: flex;
  width: 100%;
  margin-bottom: 0px;
`;

const FormFieldWrapper = styled(Box)`
  width: calc(100% - 60px);
  margin-right: 60px;
  margin-bottom: 15px;
`;

const Label = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: #5f6368;
`;

export default function({ values, changeEventListener }: IParsingPopupBodyProps) {
  const { format, fileEncoding, enableQuotedValues, skipHeader } = values;
  let selectedFormatValue: IOptions[] = [];
  let selectedEncodingValue: IOptions[] = [];

  useEffect(() => {
    selectedFormatValue = FORMAT_OPTIONS?.filter((i) => i.value === format);
  }, [format]);

  useEffect(() => {
    selectedEncodingValue = CHAR_ENCODING_OPTIONS?.filter((i) => i.value === fileEncoding);
  }, [fileEncoding]);

  return (
    <Box>
      <FormFieldWrapper>
        <Label data-testid="popup-body-label-text-format">
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.format')}
        </Label>
        <InputSelect
          fullWidth
          defaultValue={FORMAT_OPTIONS[0].value}
          value={selectedFormatValue[0]?.value}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            changeEventListener(event.target.value, 'format')
          }
          options={FORMAT_OPTIONS}
          dataTestId="parsing-drawer-format"
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label data-testid="popup-body-label-text-encoding">
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.encoding')}
        </Label>
        <InputSelect
          defaultValue={CHAR_ENCODING_OPTIONS[0].value}
          fullWidth
          value={selectedEncodingValue[0]?.value}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            changeEventListener(event.target.value, 'fileEncoding')
          }
          options={CHAR_ENCODING_OPTIONS}
          dataTestId="parsing-drawer-encoding"
        />
      </FormFieldWrapper>
      <CheckBox
        label={T.translate(
          'features.WranglerNewUI.WranglerNewParsingDrawer.enableQuotedValues'
        ).toString()}
        value={enableQuotedValues}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          changeEventListener(event.target.checked, 'enableQuotedValues')
        }
      />
      <CheckBox
        label={T.translate(
          'features.WranglerNewUI.WranglerNewParsingDrawer.useFirstRowAsHeader'
        ).toString()}
        value={skipHeader}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          changeEventListener(event.target.checked, 'skipHeader')
        }
      />
    </Box>
  );
}
