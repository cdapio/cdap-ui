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

import { parseType, checkComplexType } from 'components/Metadata/ComplexSchema/helper';
jest.disableAutomock();

describe('ComplexSchema helper', () => {
  const decimalType = {
    getTypeName: () => 'decimal',
  };
  const unionType = {
    getTypeName: () => 'union',
  };
  const unionWrappedSchemaType = {
    getTypeName: () => 'union:wrapped',
    getTypes: () => {
      return [unionType, { getTypeName: () => 'null' }];
    },
  };

  describe("'parseType' should", () => {
    it('parse simple schema type', () => {
      expect(parseType(decimalType)).toStrictEqual({
        displayType: 'decimal',
        type: decimalType,
        nullable: false,
        nested: false,
      });
    });
    it('parse union wrapped schema type', () => {
      expect(parseType(unionWrappedSchemaType)).toStrictEqual({
        displayType: 'union',
        type: unionType,
        nullable: true,
        nested: true,
      });
    });
  });

  describe("'checkComplexType' should", () => {
    it('return true for complex type', () => {
      expect(checkComplexType('UNION')).toBe(true);
    });
    it('return false for non complex type', () => {
      expect(checkComplexType('String')).toBe(false);
    });
  });
});
