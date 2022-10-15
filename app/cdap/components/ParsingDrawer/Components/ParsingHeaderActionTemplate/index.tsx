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
import { Box } from '@material-ui/core';
import { useStyles } from 'components/ParsingDrawer/styles';
import React from 'react';
import { parseImportedSchemas } from 'components/AbstractWidget/SchemaEditor/SchemaHelpers';
import T from 'i18n-react';

export default function(props) {
  const classes = useStyles();
  const handleFile = (event) => {
    const schemaFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(schemaFile, 'UTF-8');
    reader.onload = (evt) => {
      try {
        const fileContents = JSON.parse(evt.target.result.toString());
        const importedSchemas = parseImportedSchemas(fileContents);
        const schema = importedSchemas[0] && importedSchemas[0].schema;
        props.handleSchemaUpload(schema);
      } catch (e) {
        props.setErrorOnTransformation({
          open: true,
          message: 'Imported schema is not a valid Avro schema',
        });
        // setParsingErrorMessage('Imported schema is not a valid Avro schema');
      }
    };
  };
  return (
    <Box className={classes.pointerStyles}>
      <input
        data-testId="fileinput"
        id="file"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <label htmlFor="file">
        <img
          className={classes.importIconStyles}
          src="/cdap_assets/img/import.svg"
          alt="import schema icon"
        />
      </label>
      <span className={classes.importSchemaTextStyles}>
        {T.translate('features.WranglerNewParsingDrawer.importSchema')}
      </span>
    </Box>
  );
}
