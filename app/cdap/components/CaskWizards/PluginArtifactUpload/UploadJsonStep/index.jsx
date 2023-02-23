/*
 * Copyright © 2016 Cask Data, Inc.
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

import PropTypes from 'prop-types';

import React from 'react';
import { connect, Provider } from 'react-redux';
import PluginArtifactUploadStore from 'services/WizardStores/PluginArtifactUpload/PluginArtifactUploadStore';
import PluginArtifactUploadActions from 'services/WizardStores/PluginArtifactUpload/PluginArtifactUploadActions';
import FileDnD from 'components/FileDnD';
import T from 'i18n-react';

const mapStateWithDNDFileProps = (state) => {
  return {
    file: state.upload.json.contents,
    error: state.upload.json.__error,
  };
};
const mapDispatchWithDNDFileProps = (dispatch) => {
  return {
    onDropHandler: (e) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        dispatch({
          type: PluginArtifactUploadActions.setJson,
          payload: {
            json: evt.target.result,
            jsonFile: e[0],
          },
        });
      };

      reader.readAsText(e[0], 'UTF-8');
    },
  };
};
const ArtifactUploader = connect(
  mapStateWithDNDFileProps,
  mapDispatchWithDNDFileProps
)(FileDnD);

export default function UploadJsonStep(props, context) {
  return (
    <Provider store={PluginArtifactUploadStore}>
      <div
        className="upload-step-container"
        data-cy="plugin-json-upload-container"
      >
        {/* TODO: shouldn't do this, replace in 4.2} */
        context.isMarket ? (
          <h4 className="upload-instruction">
            {T.translate(
              'features.Wizard.PluginArtifact.Step1.uploadHelperText'
            )}
          </h4>
        ) : null}
        <ArtifactUploader />
      </div>
    </Provider>
  );
}
UploadJsonStep.contextTypes = {
  isMarket: PropTypes.bool,
};
