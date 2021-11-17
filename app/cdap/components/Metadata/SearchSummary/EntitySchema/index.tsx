/*
 * Copyright © 2021 Cask Data, Inc.
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
import styled from 'styled-components';
import ComplexSchema from 'components/Metadata/ComplexSchema';
import { IPropertiesResponse } from 'components/Metadata/SearchSummary/helper';

const I18N_PREFIX = 'features.MetadataSummary';

const SchemaTitle = styled.div`
  border-bottom: 1px solid var(--grey05);
  padding: 16px 16px 15px 10px;
`;

const Headers = styled.h4`
  color: var(--grey01);
  font-size: 1.08rem !important;
  margin: 0;
`;

const SchemaContainer = styled.div`
  min-height: calc(100vh - 260px);
  overflow-y: auto;
`;

interface IEntitySchemaProps {
  properties: IPropertiesResponse;
}

const EntitySchema: React.FC<IEntitySchemaProps> = ({ properties }) => {
  return (
    <>
      <SchemaTitle>
        <Headers>{T.translate(`${I18N_PREFIX}.schema`)}</Headers>
      </SchemaTitle>
      <SchemaContainer>
        {properties.properties.system.schema && (
          <ComplexSchema
            schema={JSON.parse(properties.properties.system.schema as string)}
            inputProps={{
              recordName: null,
              isRecordSchema: false,
              typeIndex: null,
              /* tslint:disable:no-empty */
              parentFormatOutput: () => {},
              isDisabled: true,
              schemaPrefix: null,
              derivedDatasetId: null,
              isInputSchema: false,
              isInStudio: false,
              errors: {},
            }}
          />
        )}
        {properties.properties.system.schema &&
          properties.properties.system.schema.length === 0 && (
            <Headers>{T.translate(`${I18N_PREFIX}.noSchema`)}</Headers>
          )}
      </SchemaContainer>
    </>
  );
};

export default EntitySchema;
