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

import { MyPipelineApi } from 'api/pipeline';
import React, { useEffect, useReducer, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { WizardSelectActionStep } from './WizardSelectActionStep';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';
import { MyArtifactApi } from 'api/artifact';
import { WizardConfigureConfirmStep } from './WizardConfigureConfirmStep';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import classnames from 'classnames';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import { initialState, reducer } from './reducer';

export interface IWizardNavProps {
  mode: string;
  artifact: any;
  currentStage: number;
  setAction: (action: any) => void;
  actionCreator: any;
  toggle: () => void;
  getPostActions: () => void;
  action?: object;
  setShowValidateButton: (show: boolean) => void;
  propertyErrors: object;
  validatePluginProperties: (action: any, errorCb: any) => void;
  validateCallback: (errorCount: number, propertyErrors: any) => void;
  onValidateStart: () => void;
}

function findLatestArtifact(plugin) {
  const allArtifacts = plugin.allArtifacts;
  const versions = allArtifacts.map((pa) => pa.artifact.version);
  const latestVersion = findHighestVersion(versions, true);
  return allArtifacts.find((pa) => pa.artifact.version === latestVersion);
}

// TODO: sumengwang clean up the necessary properties
function filterPlugins(results) {
  const pluginsMap = {};
  results.forEach((plugin) => {
    if (!pluginsMap[plugin.name]) {
      pluginsMap[plugin.name] = Object.assign({}, plugin, {
        defaultArtifact: plugin.artifact,
        allArtifacts: [],
      });
    }
    pluginsMap[plugin.name].allArtifacts.push(plugin);
    const latestArtifact = findLatestArtifact(pluginsMap[plugin.name]);
    pluginsMap[plugin.name].defaultArtifact = latestArtifact.artifact;
    pluginsMap[plugin.name].plugin = {};
    pluginsMap[plugin.name].plugin.name = plugin.name;
    pluginsMap[plugin.name].plugin.artifact = latestArtifact.artifact;
    pluginsMap[plugin.name].plugin.type = plugin.type;
    pluginsMap[plugin.name].plugin.properties = {};
    pluginsMap[plugin.name].properties = {};
  });
  return pluginsMap;
}

export const WizardNav = (props: IWizardNavProps) => {
  function pluginFetch(action) {
    if (action) {
      const { name, version, scope } = action.plugin.artifact;
      const pluginParams = {
        namespace: getCurrentNamespace(),
        artifactId: name,
        version,
        scope,
        extensionType: action.plugin.type,
        pluginName: action.plugin.name,
      };

      MyArtifactApi.fetchPluginDetails(pluginParams).subscribe((res) => {
        action._backendProperties = res[0].properties;
        fetchWidgets(action);
      });
    }
  }

  // Fetching Widget JSON for the plugin
  function fetchWidgets(action) {
    const { name, version, scope } = action.plugin.artifact;
    const widgetKey = `widgets.${action.plugin.name}-${action.plugin.type}`;
    const widgetParams = {
      namespace: getCurrentNamespace(),
      artifactName: name,
      scope,
      artifactVersion: version,
      keys: widgetKey,
    };
    MyPipelineApi.fetchWidgetJson(widgetParams).subscribe((res) => {
      try {
        const parsedWidget = JSON.parse(res[widgetKey]);
        dispatch({
          type: 'select',
          payload: {
            action,
            widgetJson: parsedWidget,
          },
        });
        props.setAction(action);
      } catch (e) {
        // tslint:disable-next-line: no-console
        console.log(`Cannot parse widget JSON for ${action.plugin.name}`, e);
      }
    });
  }

  // save the confirmed action and close the alert configure modal
  function addPostAction(action) {
    dispatch({ type: 'confirm' });
    if (props.mode === 'edit') {
      PipelineConfigurationsStore.dispatch({
        type: PipelineConfigurationsActions.EDIT_POST_ACTION,
        payload: {
          editedAction: action,
        },
      });
      props.actionCreator.editPostAction(action);
    } else {
      PipelineConfigurationsStore.dispatch({
        type: PipelineConfigurationsActions.ADD_POST_ACTION,
        payload: {
          confirmedAction: action,
        },
      });
      props.actionCreator.addPostAction(action);
    }
    props.setAction(null);
    props.getPostActions();
    props.toggle();
  }

  function onNextButtonClick(action, toggleNextValidate) {
    props.onValidateStart();
    const errorCb = ({ errorCount, propertyErrors }) => {
      props.validateCallback(errorCount, propertyErrors);
      // only go to next step if validation success
      if (errorCount === 0) {
        dispatch({
          type: 'next',
          payload: {
            values: action.plugin.properties,
          },
        });
      }
      toggleNextValidate(false);
    };
    props.validatePluginProperties(action, errorCb);
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [postActionsList, setPostActionsList] = useState({});
  const params = {
    namespace: getCurrentNamespace(),
    pipelineType: props.artifact.name,
    version: props.artifact.version,
    extensionType: 'postaction',
  };

  useEffect(() => {
    if (state.currentStage === 1) {
      MyPipelineApi.fetchPlugins(params).subscribe({
        next: (res: any) => {
          setPostActionsList(filterPlugins(res));
        },
        error: (err) => {
          // tslint:disable-next-line: no-console
          console.log('ERROR: ', err);
        },
      });
    }
    pluginFetch(props.action);
  }, []);

  return (
    <>
      <div className="wizard-nav">
        <div
          className={classnames('capsule', {
            current: state.currentStage === 1,
            complete: state.currentStage > 1,
          })}
        >
          <strong className="badge">
            {state.currentStage === 1 && <span>1</span>}
            {state.currentStage > 1 && <CheckRoundedIcon fontSize="inherit" />}
          </strong>
          <span className="nav-title">Select Alert</span>
        </div>
        <div
          className={classnames('line', {
            complete: state.currentStage > 1,
          })}
        ></div>
        <div
          className={classnames('capsule', {
            current: state.currentStage === 2,
            complete: state.currentStage > 2,
          })}
        >
          <span className="badge">
            {state.currentStage <= 2 && <span>2</span>}
            {state.currentStage > 2 && <CheckRoundedIcon fontSize="inherit" />}
          </span>
          <span className="nav-title">Configure</span>
        </div>
        <div
          className={classnames('line', {
            complete: state.currentStage > 2,
          })}
        ></div>
        <div
          className={classnames('capsule', {
            current: state.currentStage === 3,
          })}
        >
          <span className="badge">{state.currentStage <= 3 && <span>3</span>}</span>
          <span className="nav-title">Confirm</span>
        </div>
      </div>
      {state.currentStage === 1 && props.mode === 'create' && (
        <WizardSelectActionStep
          postActionsList={postActionsList}
          pluginFetch={pluginFetch}
          setShowValidateButton={props.setShowValidateButton}
        />
      )}
      {state.currentStage === 2 && (
        <WizardConfigureConfirmStep
          wizardNavState={state}
          dispatch={dispatch}
          disabled={false}
          addPostAction={addPostAction}
          mode={props.mode}
          setShowValidateButton={props.setShowValidateButton}
          onNextButtonClick={onNextButtonClick}
          setAction={props.setAction}
          propertyErrors={props.propertyErrors}
        />
      )}
      {state.currentStage === 3 && (
        <WizardConfigureConfirmStep
          wizardNavState={state}
          dispatch={dispatch}
          disabled={true}
          addPostAction={addPostAction}
          onNextButtonClick={onNextButtonClick}
          mode={props.mode}
          setShowValidateButton={props.setShowValidateButton}
          setAction={props.setAction}
          propertyErrors={props.propertyErrors}
        />
      )}
    </>
  );
};
