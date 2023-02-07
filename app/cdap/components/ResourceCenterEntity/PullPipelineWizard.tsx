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

import React from 'react';
import T from 'i18n-react';
import { Provider } from 'react-redux';
import { Action } from 'redux';
import SourceControlManagementSyncStore from 'components/SourceControlManagement/store';
import { RemotePipelineListView } from 'components/SourceControlManagement/RemotePipelineListView';
import StandardModal from 'components/shared/StandardModal';
import Alert from 'components/shared/Alert';

interface IAction<T = string, TPayload = any> extends Action {
  type: T;
  payload?: TPayload;
}

type Actions =
  | IAction<'TOGGLE_MODAL'>
  | IAction<'SET_ERROR', { error: string }>
  | IAction<'SET_LOADING', { loading: boolean }>;

export const reducer = (state, action: Actions) => {
  switch (action.type) {
    case 'TOGGLE_MODAL':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
  }
};

export const defaultState = {
  isOpen: false,
  error: null,
  loading: false,
};

interface IPullPipelineWizardProps {
  isOpen: boolean;
  error: string;
  dispatch: React.Dispatch<Actions>;
}

export const PullPipelineWizard = ({ isOpen, error, dispatch }: IPullPipelineWizardProps) => {
  return (
    <>
      <Alert
        message={error}
        type="error"
        showAlert={error !== null}
        onClose={() => dispatch({ type: 'SET_ERROR', payload: { error: null } })}
      />
      <StandardModal
        headerText={T.translate('features.SourceControlManagement.pull.modalTitle')}
        open={isOpen}
        toggle={() => dispatch({ type: 'TOGGLE_MODAL' })}
      >
        <Provider store={SourceControlManagementSyncStore}>
          <RemotePipelineListView redirectOnSubmit={true} />
        </Provider>
      </StandardModal>
    </>
  );
};
