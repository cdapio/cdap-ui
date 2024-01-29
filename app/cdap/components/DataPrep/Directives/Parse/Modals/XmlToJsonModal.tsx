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

import React, { useState, useEffect } from 'react';
import T from 'i18n-react';
import Mousetrap from 'mousetrap';
import classnames from 'classnames';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const PREFIX = 'features.DataPrep.Directives.Parse';

interface IXmlToJsonProps {
  toggle(): void;
  onApply(configuration?: string): void;
}

export default function XmlToJsonModal({ toggle, onApply }: IXmlToJsonProps) {
  const [depthValue, setDepthValue] = useState<number>(1);
  const [keepStrings, setKeepStrings] = useState<boolean>(false);

  useEffect(() => {
    Mousetrap.bind('enter', handleApply);

    return () => Mousetrap.reset();
  }, []);

  const parserTitle = T.translate(`${PREFIX}.Parsers.XMLTOJSON.label`);

  function onDepthChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDepthValue(parseInt(e.target.value, 10));
  }

  function toggleKeepStrings() {
    setKeepStrings((val) => !val);
  }

  function handleApply() {
    onApply(`${depthValue} ${keepStrings || ''}`.trim());
  }

  return (
    <Modal
      isOpen={true}
      toggle={toggle}
      size="md"
      backdrop="static"
      zIndex="1061"
      className="dataprep-parse-modal cdap-modal"
      autoFocus={false}
    >
      <ModalHeader>
        <span>{T.translate(`${PREFIX}.modalTitle`, { parser: parserTitle })}</span>
        <div className="close-section float-right" onClick={toggle}>
          <span className="fa fa-times" />
        </div>
      </ModalHeader>

      <ModalBody>
        <div>
          <label className="control-label">
            {T.translate(`${PREFIX}.Parsers.XMLTOJSON.fieldLabel`)}
          </label>
          <input
            type="number"
            min={0}
            className="form-control mousetrap"
            placeholder={T.translate(`${PREFIX}.Parsers.XMLTOJSON.placeholder`).toString()}
            value={depthValue}
            onChange={onDepthChange}
            autoFocus
          />
        </div>
        <br />
        <div className="optional-config">
          <span onClick={toggleKeepStrings}>
            <span
              className={classnames('fa', {
                'fa-square-o': !keepStrings,
                'fa-check-square': keepStrings,
              })}
            />
            <span>{T.translate(`${PREFIX}.Parsers.XMLTOJSON.keepStringsLabel`)}</span>
          </span>
        </div>
      </ModalBody>

      <ModalFooter>
        <button className="btn btn-primary" onClick={handleApply}>
          {T.translate('features.DataPrep.Directives.apply')}
        </button>
        <button className="btn btn-secondary" onClick={toggle}>
          {T.translate('features.DataPrep.Directives.cancel')}
        </button>
      </ModalFooter>
    </Modal>
  );
}
