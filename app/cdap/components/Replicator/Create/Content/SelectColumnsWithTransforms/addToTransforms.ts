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

import { IAddColumnsToTransforms, ITransformInformation } from 'components/Replicator/types';

export interface IAddToTransforms {
  transformInfo: ITransformInformation;
  addColumnsToTransforms: (opts: IAddColumnsToTransforms) => void;
}

// this will eventually be generic
export const addTinkToTransforms = (transform: IAddToTransforms): void => {
  const { tableName, columnName, directive } = transform.transformInfo;
  const actualDirective = `TINK ${columnName} ${directive}`;
  const columnTransformation = {
    directive: actualDirective,
    columnName,
  };
  transform.addColumnsToTransforms({ tableName, columnTransformation });
};

export const addRenameToTransforms = (transform: IAddToTransforms): void => {
  const { tableName, columnName, directive } = transform.transformInfo;
  const actualDirective = `rename ${columnName} ${directive}`;
  const columnTransformation = {
    directive: actualDirective,
    columnName,
  };
  transform.addColumnsToTransforms({ tableName, columnTransformation });
};
