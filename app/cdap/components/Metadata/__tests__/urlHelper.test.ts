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
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

jest.mock('services/NamespaceStore', () => {
  return {
    getCurrentNamespace: jest.fn(() => 'default'),
  };
});

describe('Metadata url helper', () => {
  describe("'getMetadataPageUrl' should", () => {
    it('handle invalid page entries', () => {
      expect(getMetadataPageUrl('foo', {})).toBeNull();
    });
    it('return the parsed url', () => {
      expect(
        getMetadataPageUrl('lineage', { entityType: 'type', entityId: 'id', query: 'logs' })
      ).toBe('/ns/default/metadata/type/id/lineage/search/logs');
    });
  });
});
