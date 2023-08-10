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

import { DiffIndicator } from 'components/PipelineDiff/types';
import {
  computePipelineDiff,
  getPluginNameFromStageDiffKey,
  getStageDiffKeysFromConnectionDiffKey,
  getStageNameFromStageDiffKey,
} from '../diff';
import {
  exampleStage1,
  exampleStage1DiffKey,
  exampleStage1ModifiedProperty,
  exampleStage2,
  exampleStage2DiffKey,
  exampleStage3,
  exampleStage3DiffKey,
  fromExample1ToExample2,
  fromExample1ToExample2DiffKey,
  fromExample1ToExample3,
  fromExample1ToExample3DiffKey,
} from './pipelines';

describe('Pipeline Difference', () => {
  describe('difference key', () => {
    it('should get stage name from stage difference key', () => {
      expect(getStageNameFromStageDiffKey(exampleStage1DiffKey)).toEqual(exampleStage1.name);
    });

    it('should get plugin name from stage difference key', () => {
      expect(getPluginNameFromStageDiffKey(exampleStage1DiffKey)).toEqual(
        exampleStage1.plugin.name
      );
    });

    it('should get from and to stage difference keys from connection difference key', () => {
      const [fromStageDiffKey, toStageDiffKey] = getStageDiffKeysFromConnectionDiffKey(
        fromExample1ToExample2DiffKey
      );
      expect(fromStageDiffKey).toEqual(exampleStage1DiffKey);
      expect(toStageDiffKey).toEqual(exampleStage2DiffKey);
    });

    it('should get plugin name from stage difference key', () => {
      expect(getPluginNameFromStageDiffKey(exampleStage1DiffKey)).toEqual(
        exampleStage1.plugin.name
      );
    });
  });

  describe('difference algorithm (getting pipeline2 from pipeline1)', () => {
    it('should indicate no difference when pipelines are identical', () => {
      const examplePipeline = {
        stages: [exampleStage1, exampleStage2],
        connections: [fromExample1ToExample2],
      };
      expect(computePipelineDiff(examplePipeline, examplePipeline).diffMap).toEqual({
        connections: {},
        stages: {},
      });
    });

    it('should indicate no difference if pipelines are identical with different order of stages', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline2 = {
        stages: [exampleStage2, exampleStage1],
        connections: [fromExample1ToExample2],
      };
      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {},
        stages: {},
      });
    });

    it('should indicate no difference if pipelines are identical with different order of connections', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2, fromExample1ToExample3],
      };
      const examplePipeline2 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample3, fromExample1ToExample2],
      };
      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {},
        stages: {},
      });
    });

    it('should indicate addition of a stage when a stage is added to pipeline1 to get pipeline2', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline2 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline3 = {
        stages: [exampleStage1, exampleStage3, exampleStage2],
        connections: [fromExample1ToExample2],
      };

      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage3DiffKey]: {
            diff: exampleStage3,
            stage1: undefined,
            stage2: exampleStage3,
            diffIndicator: DiffIndicator.ADDED,
          },
        },
      });
      expect(computePipelineDiff(examplePipeline1, examplePipeline3).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage3DiffKey]: {
            diff: exampleStage3,
            stage1: undefined,
            stage2: exampleStage3,
            diffIndicator: DiffIndicator.ADDED,
          },
        },
      });
    });

    it('should indicate deletion of a stage when a stage is removed from pipeline1 to get pipeline2', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline2 = {
        stages: [exampleStage1, exampleStage2],
        connections: [fromExample1ToExample2],
      };

      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage3DiffKey]: {
            diff: exampleStage3,
            stage1: exampleStage3,
            stage2: undefined,
            diffIndicator: DiffIndicator.DELETED,
          },
        },
      });
    });

    it('should indicate modification of a stage when a stage from pipeline1 is modified to get pipeline2', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline2 = {
        stages: [exampleStage1ModifiedProperty, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };

      const examplePipeline3 = {
        stages: [exampleStage2, exampleStage1ModifiedProperty, exampleStage3],
        connections: [fromExample1ToExample2],
      };

      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage1DiffKey]: {
            diff: {
              plugin: {
                properties: {
                  property: {
                    __old: exampleStage1.plugin.properties.property,
                    __new: exampleStage1ModifiedProperty.plugin.properties.property,
                  },
                },
              },
            },
            stage1: exampleStage1,
            stage2: exampleStage1ModifiedProperty,
            diffIndicator: '~',
          },
        },
      });

      expect(computePipelineDiff(examplePipeline1, examplePipeline3).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage1DiffKey]: {
            diff: {
              plugin: {
                properties: {
                  property: {
                    __old: exampleStage1.plugin.properties.property,
                    __new: exampleStage1ModifiedProperty.plugin.properties.property,
                  },
                },
              },
            },
            stage1: exampleStage1,
            stage2: exampleStage1ModifiedProperty,
            diffIndicator: '~',
          },
        },
      });

      expect(computePipelineDiff(examplePipeline2, examplePipeline1).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage1DiffKey]: {
            diff: {
              plugin: {
                properties: {
                  property: {
                    __old: exampleStage1ModifiedProperty.plugin.properties.property,
                    __new: exampleStage1.plugin.properties.property,
                  },
                },
              },
            },
            stage1: exampleStage1ModifiedProperty,
            stage2: exampleStage1,
            diffIndicator: '~',
          },
        },
      });

      expect(computePipelineDiff(examplePipeline3, examplePipeline1).diffMap).toEqual({
        connections: {},
        stages: {
          [exampleStage1DiffKey]: {
            diff: {
              plugin: {
                properties: {
                  property: {
                    __old: exampleStage1ModifiedProperty.plugin.properties.property,
                    __new: exampleStage1.plugin.properties.property,
                  },
                },
              },
            },
            stage1: exampleStage1ModifiedProperty,
            stage2: exampleStage1,
            diffIndicator: '~',
          },
        },
      });
    });

    it('should indicate addition of a connection when a connection is added to pipeline1 to get pipeline2', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };
      const examplePipeline2 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2, fromExample1ToExample3],
      };

      const pipeline3 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample3, fromExample1ToExample2],
      };
      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {
          [fromExample1ToExample3DiffKey]: {
            diff: fromExample1ToExample3,
            from: exampleStage1,
            to: exampleStage3,
            diffIndicator: DiffIndicator.ADDED,
          },
        },
        stages: {},
      });

      expect(computePipelineDiff(examplePipeline1, pipeline3).diffMap).toEqual({
        connections: {
          [fromExample1ToExample3DiffKey]: {
            diff: fromExample1ToExample3,
            from: exampleStage1,
            to: exampleStage3,
            diffIndicator: DiffIndicator.ADDED,
          },
        },
        stages: {},
      });
    });

    it('should indicate deletion of a connection when a connection is deleted froms pipeline1 to get pipeline2', () => {
      const examplePipeline1 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2, fromExample1ToExample3],
      };
      const examplePipeline2 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample3],
      };

      const examplePipeline3 = {
        stages: [exampleStage1, exampleStage2, exampleStage3],
        connections: [fromExample1ToExample2],
      };
      expect(computePipelineDiff(examplePipeline1, examplePipeline2).diffMap).toEqual({
        connections: {
          [fromExample1ToExample2DiffKey]: {
            diff: fromExample1ToExample2,
            from: exampleStage1,
            to: exampleStage2,
            diffIndicator: DiffIndicator.DELETED,
          },
        },
        stages: {},
      });

      expect(computePipelineDiff(examplePipeline1, examplePipeline3).diffMap).toEqual({
        connections: {
          [fromExample1ToExample3DiffKey]: {
            diff: fromExample1ToExample3,
            from: exampleStage1,
            to: exampleStage3,
            diffIndicator: DiffIndicator.DELETED,
          },
        },
        stages: {},
      });
    });
  });
});
