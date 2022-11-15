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
import T from 'i18n-react';
import React, { ChangeEvent } from 'react';
import { IParsingHeaderActionTemplateProps } from 'components/ImportSchema/types';
import styled from 'styled-components';
import { ImportSchemaIcon } from 'components/ImportSchema/IconStore/ImportSchemaIcon';
const ImportSchemaInputLabelWrapper = styled(Box)`
  display: flex !important;
`;

const ImportFileInput = styled.input`
  cursor: pointer;
  margin-bottom: 0px !important;
  display: none;
`;

const ImportSchemaIconTextWrapper = styled.label`
  cursor: pointer;
  margin-bottom: 0px !important;
  display: flex;
`;

const ImportSchemaText = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: #000000;
  margin-left: 10px;
`;

export default function({
  setSuccessUpload,
  handleSchemaUpload,
  setErrorOnTransformation,
}: IParsingHeaderActionTemplateProps) {
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
          ).toString(),
        });
      } catch (error) {
        setErrorOnTransformation({
          open: true,
          message: T.translate(
            'features.WranglerNewUI.WranglerNewParsingDrawer.importSchemaErrorMessage'
          ).toString(),
        });
      }
    };
  };
  return (
    <ImportSchemaInputLabelWrapper data-testid="import-schema-input-wrapper">
      <ImportFileInput
        data-testId="fileinput"
        id="file"
        type="file"
        accept=".json"
        onChange={handleFile}
      />
      <ImportSchemaIconTextWrapper htmlFor="file">
        {ImportSchemaIcon}
        <ImportSchemaText data-testid="import-schema-text" component="span">
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.importSchema')}
        </ImportSchemaText>
      </ImportSchemaIconTextWrapper>
    </ImportSchemaInputLabelWrapper>
  );
}
