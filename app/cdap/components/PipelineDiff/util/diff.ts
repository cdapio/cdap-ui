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

import { diff } from 'json-diff';
import { ChangedProperty, Diff, DiffIndicator, IPipelineDiffMap } from '../types';
import {
  IPipelineConfig,
  IStageMap,
  IConnectionMap,
  IPipelineStage,
  IPipelineConnection,
} from '../types';
import { ADDED_REGEX, DELETED_REGEX } from '../constants';

/**
 * Given a stage, returns a key that is unique to that stage. Unicode characters
 * are used as separators and as a suffix to ensure uniqueness. In addition, it
 * allows for additional characters at the end of the key to represent additional
 * properties of the key (e.g. json-diff adds __added and __deleted to the name of
 * a property that has been added or deleted.)
 * @param stage stage
 * @returns the key of the stage in the diff map
 */
export function getStageDiffKey(stage: IPipelineStage) {
  return `${stage.plugin.name}\u0001${stage.name}\u0002`;
}

/**
 * Given a stage diff key, return the name of the stage.
 * @param stageKey the key of the stage in the diff map
 * @returns name of the stage
 */
export function getStageNameFromStageDiffKey(stageKey: string) {
  return stageKey.split('\u0002')[0].split('\u0001')[1];
}

/**
 * Given a stage diff key, return the plugin name of the stage.
 * @param stageKey the key of the stage in the diff map
 * @returns name of stage's plugin
 */
export function getPluginNameFromStageDiffKey(stageKey: string) {
  return stageKey.split('\u0001')[0];
}

/**
 * Given a connection, returns a key that is unique to that connection. Unicode characters
 * are used as separators and as a suffix to ensure uniqueness. In addition, it
 * allows for additional characters at the end of the key to represent additional
 * properties of the key (e.g. json-diff adds __added and __deleted to the name of
 * a property that has been added or deleted.)
 * @param connection connection
 * @param getStageDiffKeyFromStageName function that returns stage diff key from stage name
 * @returns the key of the stage in the diff map
 */
export function getConnectionDiffKey(
  connection: IPipelineConnection,
  getStageDiffKeyFromStageName: (name: string) => string
) {
  const fromName = getStageDiffKeyFromStageName(connection.from);
  const toName = getStageDiffKeyFromStageName(connection.to);
  return `${fromName}\u0003${toName}\u0004`;
}

/**
 * Returns the diff key of the connection's two stages
 * @param connectionKey key of the connection in the diff map
 * @returns [fromStageDiffKey, toStageDiffKey]
 */
export function getStageDiffKeysFromConnectionDiffKey(connectionKey: string) {
  return connectionKey.split('\u0004')[0].split('\u0003');
}

/**
 * This function converts a given pipeline into a stage map and a connection map that can be
 * passed into json-diff
 * @param pipeline pipeline
 * @returns a stageMap and connectionMap that are comparable to other stage and connectino maps
 */
function preprocessPipeline(pipeline: IPipelineConfig) {
  const stageMap: IStageMap = {};
  const connectionMap: IConnectionMap = {};
  const stageNameToStage = {};

  function parseSchema(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (key.toLowerCase().includes('schema') && typeof obj[key] === 'string') {
        obj[key] = JSON.parse(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item) => parseSchema(item));
      } else if (typeof obj[key] === 'object') {
        parseSchema(obj[key]);
      }
    });
  }

  // Arrays are compared in json-diff in an ordered fashion. To overcome this issue, convert
  // stages and connections array into objects with each object/connection having their unique key

  for (const stage of pipeline.stages) {
    parseSchema(stage);
    stageMap[getStageDiffKey(stage)] = stage;
    stageNameToStage[stage.name] = stage;
  }

  // since stage names are not enough to generate a unique key, and connections only use the stage
  // name. using this function that allows for generation of unique connection keys.
  const getStageDiffKeyFromStageName = (name: string) => getStageDiffKey(stageNameToStage[name]);

  for (const connection of pipeline.connections) {
    const connectionMapKey = getConnectionDiffKey(connection, getStageDiffKeyFromStageName);
    connectionMap[connectionMapKey] = connection;
  }
  return { stageMap, connectionMap };
}

/**
 * Types the diff function from json-diff for our use-case.
 * @param obj1 obj1
 * @param obj2 obj2
 * @returns difference between obj1 and obj2
 */
function jsonObjectDiff<T>(obj1: T, obj2: T) {
  return diff(obj1, obj2) as Diff<T> | undefined;
}

/**
 * Given two pipelines, return a difference object that represents actions applied to
 * pipeline1 to get pipeline2.
 * @param pipeline1 first pipeline
 * @param pipeline2 second pipeline
 * @returns edit actions applied to pipeline1 to get pipeline2
 */
export function computePipelineDiff(pipeline1: IPipelineConfig, pipeline2: IPipelineConfig) {
  const { stageMap: stageMap1, connectionMap: connectionMap1 } = preprocessPipeline(pipeline1);
  const { stageMap: stageMap2, connectionMap: connectionMap2 } = preprocessPipeline(pipeline2);

  // json-diff appends _added or _deleted if an object property has been added or deleted
  // if a property is modified, no name changes happen
  // no property appears in the diff object if the property has not changed
  const stagesDiffMap = jsonObjectDiff(stageMap1, stageMap2) ?? {};
  const connectionsDiffMap = jsonObjectDiff(connectionMap1, connectionMap2) ?? {};

  const diffMap: IPipelineDiffMap = {
    stages: {},
    connections: {},
  };

  Object.keys(stagesDiffMap).forEach((stage) => {
    let stageName = stage;
    let diffIndicator = DiffIndicator.MODIFIED;

    if (stage.match(ADDED_REGEX)) {
      stageName = stage.replace(ADDED_REGEX, '');
      diffIndicator = DiffIndicator.ADDED;
    } else if (stage.match(DELETED_REGEX)) {
      stageName = stage.replace(DELETED_REGEX, '');
      diffIndicator = DiffIndicator.DELETED;
    }
    // addition of a stage indicates that such plugin does not exist in pipeline1
    // but exists in pipeline2, meaning stage1 is undefined. Similar idea is true
    // for the deletion of a stage. This means that at least one of stage1 and stage2
    // is defined in any case.
    diffMap.stages[stageName] = {
      diffIndicator,
      stage1: stageMap1[stageName],
      stage2: stageMap2[stageName],
      diff: stagesDiffMap[stage],
    };
  });

  Object.keys(connectionsDiffMap).forEach((connection) => {
    let connectionName = connection;
    let diffIndicator = DiffIndicator.MODIFIED;
    if (connection.match(ADDED_REGEX)) {
      connectionName = connection.replace(ADDED_REGEX, '');
      diffIndicator = DiffIndicator.ADDED;
    } else if (connection.match(DELETED_REGEX)) {
      connectionName = connection.replace(DELETED_REGEX, '');
      diffIndicator = DiffIndicator.DELETED;
    }

    const [fromStageDiffKey, toStageDiffKey] = getStageDiffKeysFromConnectionDiffKey(
      connectionName
    );

    // if a connection has been deleted, the stages it connects must exist in the first pipeline
    // otherwise, the stages it connects are guarenteed to exist in the second pipeline
    diffMap.connections[connectionName] = {
      diffIndicator,
      diff: connectionsDiffMap[connection],
      from:
        diffIndicator === DiffIndicator.DELETED
          ? stageMap1[fromStageDiffKey]
          : stageMap2[fromStageDiffKey],
      to:
        diffIndicator === DiffIndicator.DELETED
          ? stageMap1[toStageDiffKey]
          : stageMap2[toStageDiffKey],
    };
  });
  return { diffMap };
}
