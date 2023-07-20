/*
 * Copyright © 2018 Cask Data, Inc.
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

import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
require('./PipelineExportModal.scss');

const PREFIX = 'features.PipelineDetails.TopPanel';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  pipelineConfig: any;
  onExport: (config: any) => void;
}

const PipelineExportModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  pipelineConfig,
  onExport,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="lg"
      backdrop="static"
      className="cdap-modal pipeline-export-modal"
    >
      <ModalHeader>
        <span>{T.translate(`${PREFIX}.exportModalTitle`)}</span>

        <div className="close-section float-right" onClick={onClose}>
          <IconSVG name="icon-close" />
        </div>
      </ModalHeader>

      <ModalBody>
        <fieldset disabled className="view-plugin-json">
          <div className="widget-json-editor">
            <div className="textarea-container">
              <textarea
                className="form-control"
                value={JSON.stringify(pipelineConfig, null, 2)}
                readOnly
              />
            </div>
          </div>
        </fieldset>
      </ModalBody>
      <ModalFooter>
        <div
          className="btn btn-primary"
          onClick={onExport.bind(null, pipelineConfig)}
        >
          {T.translate(`${PREFIX}.export`)}
        </div>
        <div className="btn btn-secondary close-button" onClick={onClose}>
          {T.translate('commons.close')}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PipelineExportModal;
