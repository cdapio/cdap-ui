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

import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';
import PipelineTriggersStore from 'components/PipelineTriggers/store/PipelineTriggersStore';
import NamespaceStore from 'services/NamespaceStore';
import { MyAppApi } from 'api/app';
import { MyScheduleApi } from 'api/schedule';
import { GLOBALS } from 'services/global-constants';
import { extractErrorMessage } from 'services/helpers';
import {
  ICompositeTrigger,
  IPipelineInfo,
  IProgramStatusTrigger,
  ISchedule,
  ITriggeringPipelineInfo,
  ICompositeTriggerRunArgs,
  ITriggerPropertyMapping,
  ICompositeTriggerRunArgsWithTargets,
  ITriggeringPipelineId,
} from 'components/PipelineTriggers/store/ScheduleTypes';

const WORKFLOW_TYPE = 'workflows';

export function changeNamespace(namespace: string) {
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const state = PipelineTriggersStore.getState().triggers;
  const pipelineName = state.pipelineName;
  const existingTriggers = state.enabledTriggers;

  MyAppApi.list({
    namespace,
  }).subscribe((res: IPipelineInfo[]) => {
    const pipelineList = _filterPipelineList(
      existingTriggers,
      res,
      currentNamespace,
      namespace,
      pipelineName
    );

    PipelineTriggersStore.dispatch({
      type: PipelineTriggersActions.changeNamespace,
      payload: {
        pipelineList,
        selectedNamespace: namespace,
      },
    });
  });
}

export function changeTriggersType(selectedTriggersType: string) {
  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setTriggerType,
    payload: {
      selectedTriggersType,
    },
  });
}

/**
 * Method to remove the selected trigger from the composite AND or OR trigger group.
 */
export function removePipelineFromGroup(pipelineToRemove: IProgramStatusTrigger) {
  const triggersGroup: IProgramStatusTrigger[] = PipelineTriggersStore.getState().triggers
    .triggersGroupToAdd;
  const updatedTriggersGroup = triggersGroup.filter(
    (pipelineTrigger: IProgramStatusTrigger) =>
      !(
        pipelineTrigger.programId.application === pipelineToRemove.programId.application &&
        pipelineTrigger.programId.namespace === pipelineToRemove.programId.namespace
      )
  );
  const triggersGroupRunArgs: ICompositeTriggerRunArgsWithTargets = PipelineTriggersStore.getState()
    .triggers.triggersGroupRunArgsToAdd;
  const updatedTargetMapping = new Map<string, ITriggeringPipelineId>();
  triggersGroupRunArgs.targets.forEach((value, key) => {
    if (!checkPipelineId(value, pipelineToRemove)) {
      updatedTargetMapping.set(key, value);
    }
  });

  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setTriggersGroup,
    payload: {
      triggersGroupToAdd: updatedTriggersGroup,
      triggersGroupRunArgsToAdd: {
        arguments: triggersGroupRunArgs.arguments.filter(
          (triggerArg) => !checkPipelineId(triggerArg.pipelineId, pipelineToRemove)
        ),
        pluginProperties: triggersGroupRunArgs.pluginProperties.filter(
          (plugin) => !checkPipelineId(plugin.pipelineId, pipelineToRemove)
        ),
        targets: updatedTargetMapping,
      },
    },
  });
}

const checkPipelineId = (pipelineId: ITriggeringPipelineId, pipeline: IProgramStatusTrigger) => {
  return (
    pipelineId.namespace === pipeline.programId.namespace &&
    pipelineId.pipelineName === pipeline.programId.application
  );
};

function setConfigureError(err) {
  const errMessage = extractErrorMessage(err);
  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setConfigureTriggerError,
    payload: {
      error: errMessage,
    },
  });
}

/**
 * Method to reset the AND or OR group trigger.
 */
function resetTriggersGroup(pipelineTriggers: any) {
  // fetch list triggers
  fetchTriggersAndApps(pipelineTriggers.pipelineName, pipelineTriggers.workflowName);
  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.resetTriggersGroup,
  });
}

/**
 * Method to enable the AND or OR group trigger.
 * @param setTab - the arrow function that resets the tab.
 * @param scheduleName - the name of the new trigger schedule.
 * @param computeProfile - the compute profile of thie schedule.
 */
export function enableGroupTrigger(
  scheduleName: string,
  setTab: (tab: number) => void,
  computeProfile: any
) {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const pipelineTriggers = PipelineTriggersStore.getState().triggers;
  const runArgsMapping: ICompositeTriggerRunArgs = {
    arguments: [...pipelineTriggers.triggersGroupRunArgsToAdd.arguments],
    pluginProperties: [...pipelineTriggers.triggersGroupRunArgsToAdd.pluginProperties],
  };

  const requestObj: ISchedule = {
    name: scheduleName,
    description: '',
    program: {
      programName: pipelineTriggers.workflowName,
      programType: 'WORKFLOW',
    },
    properties: {
      'triggering.properties.mapping': JSON.stringify(runArgsMapping),
      ...computeProfile,
    },
    trigger: {
      triggers: pipelineTriggers.triggersGroupToAdd,
      type: pipelineTriggers.selectedTriggersType || PipelineTriggersTypes.orType,
    },
    constraints: [
      {
        maxConcurrency: 3,
        type: 'CONCURRENCY',
        waitUntilMet: false,
      },
    ],
    timeoutMillis: 24 * 60 * 60 * 1000,
  };

  const scheduleParams = {
    namespace,
    appId: pipelineTriggers.pipelineName,
    scheduleName,
  };

  MyScheduleApi.get(scheduleParams).subscribe(
    () => {
      // Schedule exist, update it
      MyScheduleApi.update(scheduleParams, requestObj)
        .flatMap(() => {
          return MyScheduleApi.enableTrigger(scheduleParams);
        })
        .subscribe(
          () => {
            resetTriggersGroup(pipelineTriggers);
            setTab(0);
          },
          (err) => {
            if (err.statusCode === 409) {
              resetTriggersGroup(pipelineTriggers);
              setTab(0);
            } else {
              setConfigureError(err);
            }
          }
        );
    },
    () => {
      // Schedule does not exist, create it
      MyScheduleApi.create(scheduleParams, requestObj)
        .flatMap(() => {
          return MyScheduleApi.enableTrigger(scheduleParams);
        })
        .subscribe(() => {
          resetTriggersGroup(pipelineTriggers);
          setTab(0);
        }, setConfigureError);
    }
  );
}

export function enableSchedule(
  pipelineTrigger: ITriggeringPipelineInfo,
  workflowName: string,
  activePipeline: string,
  selectedNamespace: string,
  config: any
) {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const scheduleName = `${activePipeline}.${namespace}.${pipelineTrigger.id}.${selectedNamespace}`;

  const requestObj: ISchedule = {
    name: scheduleName,
    description: '',
    program: {
      programName: workflowName,
      programType: 'WORKFLOW',
    },
    properties: { ...config.properties },
    trigger: {
      programId: {
        namespace: selectedNamespace,
        application: pipelineTrigger.id,
        version: pipelineTrigger.version || '-SNAPSHOT', // FIXME: This is a temporary hack and is not required
        type: 'WORKFLOW',
        entity: 'PROGRAM',
        program: pipelineTrigger.workflowName,
      },
      programStatuses: config.eventTriggers,
      type: PipelineTriggersTypes.programStatus,
    },
    constraints: [
      {
        maxConcurrency: 3,
        type: 'CONCURRENCY',
        waitUntilMet: false,
      },
    ],
    timeoutMillis: 24 * 60 * 60 * 1000,
  };

  // This API change will be replaced with a single API from Backend
  const scheduleParams = {
    namespace,
    appId: activePipeline,
    scheduleName,
  };

  MyScheduleApi.get(scheduleParams).subscribe(
    () => {
      // Schedule exist, update it
      MyScheduleApi.update(scheduleParams, requestObj)
        .flatMap(() => {
          return MyScheduleApi.enableTrigger(scheduleParams);
        })
        .subscribe(
          () => {
            // fetch list triggers
            fetchTriggersAndApps(activePipeline, workflowName);
          },
          (err) => {
            if (err.statusCode === 409) {
              fetchTriggersAndApps(activePipeline, workflowName);
            } else {
              setConfigureError(err);
            }
          }
        );
    },
    () => {
      // Schedule does not exist, create it
      MyScheduleApi.create(scheduleParams, requestObj)
        .flatMap(() => {
          return MyScheduleApi.enableTrigger(scheduleParams);
        })
        .subscribe(() => {
          // fetch list triggers
          fetchTriggersAndApps(activePipeline, workflowName);
        }, setConfigureError);
    }
  );
}

/**
 * Method to configure composite trigger.
 * @param mapping - the argument mappings of the pipeline trigger.
 * @param triggersGroupRunArgsToAdd - the run arguments of the pipeline group trigger.
 * @param triggersGroupToAdd - the argument mappings of the pipeline trigger.
 * @param selectedNamespace - the selected namespace.
 * @param triggeringPipelineInfo - the triggering pipeline's info.
 * @param config - the rconfig of the pipeline group trigger.
 */
export function addToTriggerGroup(
  mapping: ITriggerPropertyMapping[],
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets,
  triggersGroupToAdd: IProgramStatusTrigger[],
  selectedNamespace: string,
  triggeringPipelineInfo: ITriggeringPipelineInfo,
  config: any
) {
  const newTriggersGroupToAdd = [
    ...triggersGroupToAdd,
    {
      programId: {
        namespace: selectedNamespace,
        application: triggeringPipelineInfo.id,
        version: triggeringPipelineInfo.version || '-SNAPSHOT',
        type: 'WORKFLOW',
        entity: 'PROGRAM',
        program: triggeringPipelineInfo.workflowName,
      },
      programStatuses: config.eventTriggers,
      type: PipelineTriggersTypes.programStatus,
    },
  ];

  const triggersGroupRunArgs = { ...triggersGroupRunArgsToAdd };

  if (!!mapping && !!triggersGroupRunArgs) {
    mapping.forEach((map) => {
      const keySplit = map.key.split(':');
      const currentPipelineId = {
        namespace: selectedNamespace,
        pipelineName: triggeringPipelineInfo.id,
      };
      if (keySplit.length > 1) {
        triggersGroupRunArgs.pluginProperties.push({
          pipelineId: currentPipelineId,
          stageName: keySplit[1],
          source: keySplit[2],
          target: map.value,
        });
        triggersGroupRunArgs.targets.set(map.value || keySplit[2], currentPipelineId);
      } else {
        triggersGroupRunArgs.arguments.push({
          pipelineId: currentPipelineId,
          source: map.key,
          target: map.value,
        });
        triggersGroupRunArgs.targets.set(map.value || map.key, currentPipelineId);
      }
    });
  }

  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setTriggersGroup,
    payload: {
      triggersGroupToAdd: newTriggersGroupToAdd,
      triggersGroupRunArgsToAdd: triggersGroupRunArgs,
    },
  });
}

/**
 * Method to generate runtime mappings.
 * if key is triggering pipeline's run time argument use this as map
 *    {"runtimeArgumentKey":"runtimeArgsKey","type":"RUNTIME_ARG","namespace":"ns1","pipelineName":"p1"}
 * if key is triggering pipeline's plugin property then use this as map
 *    {"pluginName":"name1","propertyKey":"key1","type":"PLUGIN_PROPERTY","namespace":"ns1","pipelineName":"p1"}
 * @param mapping - the argument mappings of the pipeline trigger.
 */
export function generateRuntimeMapping(mapping: ITriggerPropertyMapping[]) {
  const runArgsMapping = {
    arguments: [],
    pluginProperties: [],
  };
  mapping.forEach((map) => {
    const keySplit = map.key.split(':');
    if (keySplit.length > 1) {
      runArgsMapping.pluginProperties.push({
        stageName: keySplit[1],
        source: keySplit[2],
        target: map.value,
      });
    } else {
      runArgsMapping.arguments.push({
        source: map.key,
        target: map.value,
      });
    }
  });
  return JSON.stringify(runArgsMapping);
}

/**
 * Method to validate the incoming trigger argument mapping.
 *
 * @param mappings - the argument mappings of the pipeline trigger.
 * @param triggersGroupRunArgsToAdd - the run arguments of the pipeline group trigger.
 * @returns {string} the validation result, null for valid result, string error for invalid result.
 */
export function validateTriggerMappping(
  mappings: ITriggerPropertyMapping[],
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets
): string {
  if (!mappings) {
    return null;
  }
  for (const mapping of mappings) {
    const keySplit = mapping.key.split(':');
    let targetToAdd: string;
    if (keySplit.length > 1) {
      targetToAdd = mapping.value || keySplit[2];
    } else {
      targetToAdd = mapping.value || mapping.key;
    }

    if (triggersGroupRunArgsToAdd.targets.has(targetToAdd)) {
      const pipelineId = triggersGroupRunArgsToAdd.targets.get(targetToAdd);
      return `Argument mapping of "${targetToAdd}" already selected in pipeline: "${pipelineId.pipelineName}" of namespace: "${pipelineId.namespace}"`;
    }
  }
  return null;
}

export function fetchTriggersAndApps(
  pipeline: string,
  workflowName: string,
  activeNamespace = null
) {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const activeNamespaceView =
    activeNamespace || PipelineTriggersStore.getState().triggers.selectedNamespace;

  const params = {
    namespace,
    appId: pipeline,
    workflowId: workflowName,
    'schedule-status': 'SCHEDULED',
  };

  const lifecycleManagementEditEnabled = PipelineTriggersStore.getState().triggers
    .lifecycleManagementEditEnabled;
  const listParam: any = { namespace: activeNamespaceView };
  if (lifecycleManagementEditEnabled) {
    listParam.latestOnly = 'true';
  }
  MyScheduleApi.getTriggers(params)
    .combineLatest(MyAppApi.list(listParam))
    .subscribe((res) => {
      const existingTriggers = _transformSchedule(res[0]);
      const appsList = res[1];

      const pipelineList = _filterPipelineList(
        existingTriggers,
        appsList,
        namespace,
        activeNamespaceView,
        pipeline
      );

      PipelineTriggersStore.dispatch({
        type: PipelineTriggersActions.setTriggersAndPipelineList,
        payload: {
          pipelineList,
          enabledTriggers: existingTriggers,
          selectedNamespace: activeNamespaceView,
        },
      });
    });
}

export function disableSchedule(schedule: ISchedule, activePipeline: string, workflowName: string) {
  const namespace = NamespaceStore.getState().selectedNamespace;

  const params = {
    namespace,
    appId: activePipeline,
    scheduleName: schedule.name,
  };

  MyScheduleApi.delete(params).subscribe(
    () => {
      fetchTriggersAndApps(activePipeline, workflowName);
    },
    (err) => {
      const errMessage = extractErrorMessage(err);
      PipelineTriggersStore.dispatch({
        type: PipelineTriggersActions.setDisableTriggerError,
        payload: {
          error: errMessage,
        },
      });
    }
  );
}

export function getPipelineInfo(schedule: ISchedule) {
  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setExpandedSchedule,
    payload: {
      expandedSchedule: schedule ? schedule.name : null,
    },
  });

  if (!schedule) {
    return;
  }

  const params = {
    namespace: (schedule.trigger as IProgramStatusTrigger).programId.namespace,
    appId: (schedule.trigger as IProgramStatusTrigger).programId.application,
  };

  MyAppApi.get(params).subscribe((res: IPipelineInfo) => {
    PipelineTriggersStore.dispatch({
      type: PipelineTriggersActions.setEnabledTriggerPipelineInfo,
      payload: {
        pipelineInfo: res,
      },
    });
  });
}

/**
 * Method to get the information of member trigger of an AND or OR pipeline trigger group.
 * @param schedule - the member pipeline trigger.
 * @returns the observerable that gets the pipeline info.
 */
export function getGroupInlinePipelineInfo(schedule: IProgramStatusTrigger) {
  if (!schedule) {
    return null;
  }

  const params = {
    namespace: schedule.programId.namespace,
    appId: schedule.programId.application,
  };

  return MyAppApi.get(params);
}

export function getCompositePipelineInfo(schedule: ISchedule) {
  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setExpandedSchedule,
    payload: {
      expandedSchedule: schedule ? schedule.name : null,
    },
  });

  if (!schedule) {
    return;
  }

  PipelineTriggersStore.dispatch({
    type: PipelineTriggersActions.setEnabledTriggerPipelineInfo,
    payload: { pipelineInfo: null },
  });
}

function _filterPipelineList(
  existingTriggers: ISchedule[],
  appsList: IPipelineInfo[],
  namespace: string,
  activeNamespaceView: string,
  activePipeline: string
) {
  const triggersPipelineName = existingTriggers
    .filter((schedule) => {
      return (
        schedule.trigger.type === PipelineTriggersTypes.programStatus &&
        (schedule.trigger as IProgramStatusTrigger).programId.namespace === activeNamespaceView
      );
    })
    .map((schedule) => {
      return (schedule.trigger as IProgramStatusTrigger).programId.application;
    });
  const pipelineCompositeTriggersEnabled = PipelineTriggersStore.getState().triggers
    .pipelineCompositeTriggersEnabled;

  const pipelineList = appsList.filter((app) => {
    const isWorkflow = GLOBALS.programType[app.artifact.name] === WORKFLOW_TYPE;

    const isCurrentNamespace =
      namespace === activeNamespaceView ? app.name !== activePipeline : true;

    const isNotExistingTrigger = triggersPipelineName.indexOf(app.name) === -1;

    return (
      isWorkflow && isCurrentNamespace && (pipelineCompositeTriggersEnabled || isNotExistingTrigger)
    );
  });

  return pipelineList;
}

/**
 * Method to transform the single trigger to OR group trigger.
 * @param existingSchedules - the existing enabled trigger schedules.
 */
function _transformSchedule(existingSchedules: ISchedule[]) {
  const pipelineCompositeTriggersEnabled = PipelineTriggersStore.getState().triggers
    .pipelineCompositeTriggersEnabled;

  if (!pipelineCompositeTriggersEnabled) {
    return existingSchedules;
  }

  const enabledGroupSchedule = existingSchedules.filter(
    (schedule) => schedule.trigger.type !== PipelineTriggersTypes.programStatus
  );

  const transformedSchedules = existingSchedules
    .filter((schedule) => schedule.trigger.type === PipelineTriggersTypes.programStatus)
    .map((schedule) => {
      const transformedSchedule = {
        ...schedule,
        trigger: {
          triggers: [{ ...schedule.trigger }],
          type: PipelineTriggersTypes.orType,
        } as ICompositeTrigger,
        isTransformed: true,
      };

      return transformedSchedule;
    });

  return [...transformedSchedules, ...enabledGroupSchedule];
}
