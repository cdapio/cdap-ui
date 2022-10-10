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

import ConfigurationGroup from 'components/shared/ConfigurationGroup';
import IconSVG from 'components/shared/IconSVG';
import React, { useEffect, useState } from 'react';
import uuidV4 from 'uuid/v4';

export interface IWizardConfigureConfirmStepProps {
  wizardNavState: any;
  disabled: boolean;
  dispatch: (action: any) => void;
  addPostAction: (action: any) => void;
  mode: string;
  setShowValidateButton: (show: boolean) => void;
  setAction: (action: any) => void;
  propertyErrors: object;
  onNextButtonClick: (action: any, toggleNextValidate: any) => void;
}

export const WizardConfigureConfirmStep = (props: IWizardConfigureConfirmStepProps) => {
  useEffect(() => {
    props.setShowValidateButton(true);
  }, []);
  const [values, setValues] = useState(props.wizardNavState.values);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const action = { ...props.wizardNavState.selectedAction };
    action.plugin.properties = values;
    // below might not be necessary
    action.properties = values;
    props.setAction(action);
  }, [values]);

  const getConfirmedAction = () => {
    const confirmedAction = props.wizardNavState.selectedAction;
    const newValuesPlugin = { ...confirmedAction.plugin, properties: values };
    return {
      name: confirmedAction.name,
      id: confirmedAction.id || confirmedAction.name + uuidV4(),
      plugin: newValuesPlugin,
      description: confirmedAction.description,
    };
  };

  return (
    <>
      <div className="confirm-step-content">
        <ConfigurationGroup
          values={values}
          pluginProperties={props.wizardNavState.selectedAction._backendProperties}
          widgetJson={props.wizardNavState.widgetJson}
          disabled={props.disabled}
          onChange={setValues}
          errors={props.propertyErrors}
        />
      </div>
      <div className="confirm-step-wizard-footer">
        <div className="pull-right">
          {props.wizardNavState.currentStage > 2 || props.mode !== 'edit' ? (
            <button
              className="btn btn-grey-cancel"
              onClick={() => {
                if (props.wizardNavState.currentStage === 2) {
                  props.setAction(null);
                }
                props.dispatch({
                  type: 'back',
                });
              }}
            >
              Back
            </button>
          ) : null}

          {props.wizardNavState.currentStage === 2 && (
            <button
              className="btn btn-blue confirm-step-next-btn"
              data-cy="next-btn"
              onClick={() => {
                setIsValidating(true);
                props.onNextButtonClick(getConfirmedAction(), setIsValidating);
              }}
            >
              {isValidating ? (
                <span>
                  <IconSVG name="icon-spinner" className="fa-spin" />
                </span>
              ) : (
                <span>Next</span>
              )}
            </button>
          )}

          {props.wizardNavState.currentStage === 3 && (
            <button
              className="btn btn-blue confirm-step-next-btn"
              data-cy="confirm-btn"
              onClick={() => {
                props.addPostAction(getConfirmedAction());
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </>
  );
};
