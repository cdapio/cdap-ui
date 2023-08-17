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
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';

require('./WizardModal.scss');

export default function WizardModal({
  children,
  title,
  isOpen,
  toggle,
  className,
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className={classnames('wizard-modal cdap-modal', className)}
      size="lg"
      backdrop="static"
      zIndex="1061"
    >
      <ModalHeader>
        <span className="float-left">{title}</span>
        <div className="close-section float-right" onClick={toggle}>
          <span className="fa fa-times" />
        </div>
      </ModalHeader>
      <ModalBody>
        <CSSTransition
          component="div"
          transitionName="wizard-modal-content"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          timeout={300}
        >
          {children}
        </CSSTransition>
      </ModalBody>
    </Modal>
  );
}
WizardModal.defaultProps = {
  title: 'Wizard',
  isOpen: false,
  closeHandler: () => {},
};

WizardModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  className: PropTypes.string,
};
