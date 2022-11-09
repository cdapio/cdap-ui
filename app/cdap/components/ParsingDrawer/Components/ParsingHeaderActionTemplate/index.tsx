/*
 * Copyright © 2019 Cask Data, Inc.
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

import { Box, Typography } from '@material-ui/core';
import { parseImportedSchemas } from 'components/AbstractWidget/SchemaEditor/SchemaHelpers';
import { useStyles } from 'components/ParsingDrawer/styles';
import T from 'i18n-react';
import React, { ChangeEvent } from 'react';
import { importIcon } from 'components/ParsingDrawer/Components/ParsingHeaderActionTemplate/importicon';
import { IParsingHeaderActionTemplateProps } from 'components/ParsingDrawer/Components/ParsingHeaderActionTemplate/types';

export default function({
  setSuccessUpload,
  handleSchemaUpload,
  setErrorOnTransformation,
}: IParsingHeaderActionTemplateProps) {
  const classes = useStyles();
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const schemaFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(schemaFile, 'UTF-8');
    reader.onload = (evt) => {
      try {
        const fileContents = JSON.parse(evt.target.result.toString());
        const importedSchemas = parseImportedSchemas(fileContents);
        const schema = importedSchemas[0] && importedSchemas[0].schema;
        handleSchemaUpload(schema);
        setSuccessUpload({
          open: true,
          message: T.translate(
            'features.WranglerNewUI.WranglerNewParsingDrawer.importSchemaSuccessMessage'
          ),
        });
      } catch (e) {
        setErrorOnTransformation({
          open: true,
          message: T.translate(
            'features.WranglerNewUI.WranglerNewParsingDrawer.importSchemaErrorMessage'
          ),
        });
      }
    };
  };
  return (
    <Box className={classes.importSchemaIconText}>
      <input
        data-testId="fileinput"
        id="file"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFile}
        className={classes.pointerStyles}
      />
      <label htmlFor="file" className={classes.importSchemaLabel}>
        {importIcon}
        <Typography className={classes.importSchemaTextStyles}>
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.importSchema')}
        </Typography>
      </label>
    </Box>
  );
}
