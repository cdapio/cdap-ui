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

import { Box, InputLabel } from '@material-ui/core';
import InputCheckbox from 'components/ParsingDrawer/Components/InputCheckbox';
import InputSelect from 'components/ParsingDrawer/Components/InputSelect';
import {
  CHAR_ENCODING_OPTIONS,
  FORMAT_OPTIONS,
} from 'components/ParsingDrawer/Components/ParsingPopupBody/parsingOptions';
import { useStyles } from 'components/ParsingDrawer/styles';
import { IOptions, IParsingPopupBodyProps } from 'components/ParsingDrawer/types';
import T from 'i18n-react';
import React, { ChangeEvent, useEffect } from 'react';

export default function({ values, changeEventListener }: IParsingPopupBodyProps) {
  const classes = useStyles();

  const { format, fileEncoding, enableQuotedValues, skipHeader } = values;
  let selectedFormatValue: IOptions[] = [];
  let selectedEncodingValue: IOptions[] = [];

  useEffect(() => {
    selectedFormatValue = FORMAT_OPTIONS?.filter((eachOption) => eachOption.value === format);
  }, [format]);

  useEffect(() => {
    selectedEncodingValue = CHAR_ENCODING_OPTIONS?.filter((i) => i.value === fileEncoding);
  }, [fileEncoding]);

  return (
    <Box>
      <Box className={`${classes.formFieldWrapperStyles}${classes.marginBottomStyles}`}>
        <InputLabel className={classes.labelTextStyles}>
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.format')}
        </InputLabel>
        <InputSelect
          classes={{ icon: classes.selectIconStyles, select: classes.selectStyles }}
          className={classes.selectFieldStyles}
          optionClassName={{ root: classes.optionStyles }}
          fullWidth
          defaultValue={FORMAT_OPTIONS[0].value}
          value={selectedFormatValue[0]?.value}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            changeEventListener(event.target.value, 'format')
          }
          options={FORMAT_OPTIONS}
        />
      </Box>

      <Box className={`${classes.formFieldWrapperStyles}${classes.marginBottomStyles}`}>
        <InputLabel className={classes.labelTextStyles}>
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.encoding')}
        </InputLabel>
        <InputSelect
          classes={{ icon: classes.selectIconStyles, select: classes.selectStyles }}
          className={classes.selectFieldStyles}
          optionClassName={{ root: classes.optionStyles }}
          defaultValue={CHAR_ENCODING_OPTIONS[0].value}
          fullWidth
          value={selectedEncodingValue[0]?.value}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            changeEventListener(event.target.value, 'fileEncoding')
          }
          options={CHAR_ENCODING_OPTIONS}
        />
      </Box>

      <InputCheckbox
        label={T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.enableQuotedValues')}
        value={enableQuotedValues}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          changeEventListener(event.target.checked, 'enableQuotedValues')
        }
        className={classes.checkboxStyles}
      />

      <InputCheckbox
        label={T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.useFirstRowAsHeader')}
        value={skipHeader}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          changeEventListener(event.target.checked, 'skipHeader')
        }
        className={classes.checkboxStyles}
      />
    </Box>
  );
}
