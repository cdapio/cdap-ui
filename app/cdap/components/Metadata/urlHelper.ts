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

import { buildUrl } from 'services/resource-helper';
import { getCurrentNamespace } from 'services/NamespaceStore';

/**
 * Method to get metadata page urls based on given params.
 *
 * @param pageName - page name
 * @param params - url params to be parsed.
 * @returns Parsed metadata page urls.
 */
export function getMetadataPageUrl(pageName: string, params: { [key: string]: string } = {}) {
  const urls = {
    home: `/ns/:namespace/metadata`,
    search: `/ns/:namespace/metadata/search/:query/result`,
    summary: `/ns/:namespace/metadata/:entityType/:entityId/summary/search/:query`,
    lineage: `/ns/:namespace/metadata/:entityType/:entityId/lineage/search/:query`,
  };
  if (!urls[pageName]) {
    return null;
  }
  return buildUrl(urls[pageName], { ...params, namespace: getCurrentNamespace() });
}
