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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'components/FieldLevelLineage/store/Store';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import LoadingSVG from 'components/shared/LoadingSVG';
import ModalContent from 'components/FieldLevelLineage/OperationsModal/ModalContent';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';

const PREFIX = 'features.FieldLevelLineage.OperationsModal';

require('./OperationsModal.scss');

function OperationsModalView({
  showOperations,
  loading,
  closeModal,
  fieldName,
  direction,
}) {
  if (!showOperations) {
    return null;
  }

  const loadingIndicator = (
    <div className="loading-container text-center">
      <LoadingSVG />
    </div>
  );

  return (
    <Modal
      isOpen={true}
      toggle={closeModal}
      size="lg"
      backdrop="static"
      zIndex="1061"
      className="field-level-lineage-modal cdap-modal"
    >
      <ModalHeader>
        <span>
          {T.translate(`${PREFIX}.Title.${direction}`, { fieldName })}
        </span>

        <div className="close-section float-right" onClick={closeModal}>
          <IconSVG name="icon-close" />
        </div>
      </ModalHeader>

      <ModalBody>{loading ? loadingIndicator : <ModalContent />}</ModalBody>
    </Modal>
  );
}

OperationsModalView.propTypes = {
  showOperations: PropTypes.bool,
  loading: PropTypes.bool,
  closeModal: PropTypes.func,
  fieldName: PropTypes.string,
  direction: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    showOperations: state.operations.showOperations,
    loading: state.operations.loading,
    fieldName: state.lineage.activeField,
    direction: state.operations.direction,
  };
};

const mapDispatch = (dispatch) => {
  return {
    closeModal: () => {
      dispatch({
        type: Actions.closeOperations,
      });
    },
  };
};

const OperationsModal = connect(
  mapStateToProps,
  mapDispatch
)(OperationsModalView);

export default OperationsModal;
