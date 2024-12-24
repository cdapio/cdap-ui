/*
 * Copyright © 2024 Cask Data, Inc.
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
import { useSelector } from 'react-redux';
import usePropertiesPanel from './usePropertiesPanel';

let counter = 0;

export default function PropertiesPanel() {
  const uiState = useSelector((state) => state.uiState);
  const { propertiesPanelProps, propertiesPanelOnClose } = uiState;

  console.log(' *************  ', counter++, ' ', propertiesPanelProps);
  useEffect(() => {
    console.log(' =====  ', counter++, ' ', propertiesPanelProps);
  }, [propertiesPanelProps, propertiesPanelOnClose]);

  if (!propertiesPanelProps) {
    return <div />;
  }

  return (
    <PropertiesPanelInner passedProps={propertiesPanelProps} onClose={propertiesPanelOnClose} />
  );
}

function PropertiesPanelInner({ passedProps, onClose }) {
  const { state } = usePropertiesPanel(passedProps?.pluginNode);
  console.log({ state });

  return (
    <div className="modal-header clearfix">
      <h5
        className={`modal-title ${
          state?.groupsConfig?.jumpConfig?.datasets?.length ? 'with-jump' : ''
        }`}
      >
        <span>
          {(state?.config && state?.config['display-name']) || state?.node?.plugin?.name} Properties
          <small>{state?.node?.plugin?.artifact?.version}</small>
        </span>
        {state?.noConfigMessage && state?.node?.plugin?.name !== 'Validator' && (
          <small className="text-danger">({state?.noConfigMessage})</small>
        )}

        <p title={state?.node?.description}>
          <small>{state?.node?.description}</small>
        </p>
      </h5>
      {JSON.stringify(passedProps, null, 2)}
      <button onClick={onClose}>close</button>
    </div>
  );
}
