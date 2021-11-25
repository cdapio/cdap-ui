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

import { getCurrentNamespace } from 'services/NamespaceStore';

/**
 * Method to construct URL path by given connection name & path.
 *
 * @param name - Connection name
 * @param path - Connection navigation path
 * @returns Connection router path
 */
export function getConnectionPath(name: string, path: string = '/') {
  if (!name || name.trim() === '') {
    return null;
  }
  return `/ns/${getCurrentNamespace()}/connections/${name}?path=${path}`;
}
