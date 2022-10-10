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

import React, { useEffect } from 'react';
import styled from 'styled-components';

export interface IWizardSelectActionStepProps {
  postActionsList: {};
  pluginFetch: (action) => void;
  setShowValidateButton: (show: boolean) => void;
}

const ActionButton = styled.button`
  flex-grow: 1;
  box-shadow: 1px 4px 7px -5px rgb(0 0 0 / 65%);
  border: 1px solid #ddd;
  margin: 10px;
`;

const ActionsList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  margin: 10px 0;
`;

export const WizardSelectActionStep = (props: IWizardSelectActionStepProps) => {
  useEffect(() => {
    props.setShowValidateButton(false);
  }, []);
  return (
    <>
      <ActionsList>
        {props.postActionsList &&
          Object.values(props.postActionsList).map((action: any) => {
            return (
              <ActionButton className="btn btn-default" onClick={() => props.pluginFetch(action)}>
                {action.name}
              </ActionButton>
            );
          })}
      </ActionsList>
    </>
  );
};
