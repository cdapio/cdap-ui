/*
 * Copyright © 2023 Cask Data, Inc.
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

import { getConnectionDiffKey, getStageDiffKey } from "../diff"

export const exampleStage1 = {
  id: 'stage1-id',
  name: 'stage1-name',
  plugin: {
    label: 'stage1-plugin-label',
    name: 'stage1-plugin-name',
    properties: {
      property: "propertyValue",
    },
    type: 'stage1-plugin-type',
    artifact: {
      name: 'stage1-artifact-name',
      version: 'stage1-artifact-version',
      scope: 'stage1-artifact-scope',
    },
  },
}

export const exampleStage1ModifiedProperty = {
  id: 'stage1-id',
  name: 'stage1-name',
  plugin: {
    label: 'stage1-plugin-label',
    name: 'stage1-plugin-name',
    properties: {
      property: "propertyValue-modified",
    },
    type: 'stage1-plugin-type',
    artifact: {
      name: 'stage1-artifact-name',
      version: 'stage1-artifact-version',
      scope: 'stage1-artifact-scope',
    },
  },
}

export const exampleStage2 = {
  id: 'stage2-id',
  name: 'stage2-name',
  plugin: {
    label: 'stage2-plugin-label',
    name: 'stage2-plugin-name',
    properties: {
      property: "propertyValue",
    },
    type: 'stage2-plugin-type',
    artifact: {
      name: 'stage2-artifact-name',
      version: 'stage2-artifact-version',
      scope: 'stage2-artifact-scope',
    },
  },
}

export const exampleStage3 = {
  id: 'stage3-id',
  name: 'stage3-name',
  plugin: {
    label: 'stage3-plugin-label',
    name: 'stage3-plugin-name',
    properties: {
      property: "propertyValue",
    },
    type: 'stage3-plugin-type',
    artifact: {
      name: 'stage3-artifact-name',
      version: 'stage3-artifact-version',
      scope: 'stage3-artifact-scope',
    },
  },
}

export const exampleStage1DiffKey = getStageDiffKey(exampleStage1);
export const exampleStage2DiffKey = getStageDiffKey(exampleStage2);
export const exampleStage3DiffKey = getStageDiffKey(exampleStage3);

export const fromExample1ToExample2 = {
  from: exampleStage1.name,
  to: exampleStage2.name,
}

export const fromExample1ToExample3 = {
  from: exampleStage1.name,
  to: exampleStage3.name,
}

const getStageDiffKeyFromStageName = (name) => {
  return {
    [exampleStage1.name]:exampleStage1DiffKey,
    [exampleStage2.name]:exampleStage2DiffKey,
    [exampleStage3.name]:exampleStage3DiffKey
  }[name]
} 

export const fromExample1ToExample2DiffKey = getConnectionDiffKey(fromExample1ToExample2, getStageDiffKeyFromStageName);
export const fromExample1ToExample3DiffKey = getConnectionDiffKey(fromExample1ToExample3, getStageDiffKeyFromStageName);
